import { mapState, mapMutations } from "vuex";
import { createResource } from '@/services/resource.js';
import http from "@/services/http.js";

export default {
	computed: {
		...mapState("tutorInvite", ["invites", "invite"]),
	},

	methods: {
		...mapMutations("tutorInvite", [ "setInvites", "setInvite", "addInvite" ]),

		getTutorInviteResource() {
			return createResource("tutor-invite");
		},

		async fetchInvites() {
			try {
				const res = await this.getTutorInviteResource().list();
				const invites = res?.data?.invites || [];
				this.setInvites(invites);
				return invites;
			} catch (err) {
				this._handleError(err, "Erro ao carregar convites.");
			}
		},

		async sendInvite(payload) {
			try {
				const res = await this.getTutorInviteResource().post(payload);
				const invite = res?.data?.invite;
				if (invite) this.addInvite(invite);
				this._toastSuccess(
					res?.data?.message || "Convite enviado com sucesso!"
				);
				return invite;
			} catch (err) {
				this._handleError(err, "Erro ao enviar convite.");
				throw err;
			}
		},

		async resendInvite(id) {
			try {
				const { data } = await http.post(`tutor-invites/${id}/resend`);
				this._toastSuccess(data?.message || "Convite reenviado.");
				return data;
			} catch (err) {
				this._handleError(err, "Erro ao reenviar convite.");
			}
		},

		/**
		 * Exclui um convite (com confirmação)
		 */
		async deleteInvite(id) {
			const confirmDelete = confirm(
				"Tem certeza que deseja excluir este convite?"
			);
			if (!confirmDelete) return;

			try {
				await this.getTutorInviteResource().delete(id);
				const updated = this.invites.filter((i) => i.id !== id);
				this.setInvites(updated);
				this._toastSuccess("Convite excluído com sucesso.");
			} catch (err) {
				this._handleError(err, "Erro ao excluir convite.");
			}
		},

		_handleError(err, defaultMessage) {
			console.error(err);
			const msg = err?.response?.data?.message || defaultMessage;
			this._toastError(msg);
		},

		_toastSuccess(msg) {
			if (this.$toast) this.$toast.success(msg);
			else alert(msg);
		},

		_toastError(msg) {
			if (this.$toast) this.$toast.error(msg);
			else alert(msg);
		},
	},
};
