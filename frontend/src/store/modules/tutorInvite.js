import { createResource } from "@/services/resource.js";

const inviteAPI = createResource("tutor/invite");

export default {
	namespaced: true,

	state: {
		invite: {},
		invites: [],
	},

	mutations: {
		setInvites(state, invites) {
			state.invites = invites;
		},

		setInvite(state, invite) {
			state.invite = invite;
		},

		addInvite(state, invite) {
			if (!invite || !invite.id) return;
			const index = state.invites.findIndex(
				(a) => a.id === invite.id
			);
			if (index !== -1) state.invites.splice(index, 1, invite);
			else state.invites.push(invite);
		},
	},

	actions: {
		// =====================================================
		// GET LIST
		// =====================================================
		async getInvites({ commit, dispatch }) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => dependentAPI.list({ skipLoader: true }),
					successMsg: (response) =>
						response?.data?.invites?.length
							? "Convites carregados com sucesso."
							: "Nenhum convite cadastrado.",
					errorMsg: "Erro ao carregar convites.",
				},
				{ root: true }
			);

			if (response?.data) {
				commit("setInvites", response.data.invites);
			}
		},


		// =====================================================
		// GET ONE
		// =====================================================
		async getInvite({ commit, dispatch }, id) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => dependentAPI.get(id, { skipLoader: true }),
					successMsg: "Dados do convite carregados com sucesso.",
					errorMsg: "Erro ao carregar os dados do convite."
				},
				{ root: true }
			);

			if (response?.data) {
				commit("setInvite", response.data.invite);
			}
		},

		// =====================================================
		// SAVE or UPDATE
		// =====================================================
		async addOrUpdate({ commit, dispatch }, payload) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => inviteAPI.save(payload, { skipLoader: true }),
					successMsg: "Dados salvos com sucesso.",
					errorMsg: "Erro ao salvar dados.",
				},
				{ root: true }
			);

			if (response?.data) {
				commit("addInvite", response.data.invite);
				return;
			}

			return null;
		},

		// =====================================================
		// DESTROY
		// =====================================================
		async destroyInvite({ dispatch }, id) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => inviteAPI.remove(id, { skipLoader: true }),
					successMsg: "Dados excluídos com sucesso.",
					errorMsg: "Erro ao excluir dados.",
				},
				{ root: true }
			);
			return !!response;
		}
	},
};
