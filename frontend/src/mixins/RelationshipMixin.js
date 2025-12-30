import { createResource } from "@/services/resource.js";
import { mapMutations } from "vuex";

let relationshipAPI = createResource("relationship");

export default {
	methods: {
		/*...mapMutations("dependent", [
			"setDependents",
			"setDependent",
			"addDependent",
		]),

		async getDependents(filter, extendedFilter, relationship, sort) {
			const call = () =>
				relationshipAPI.list({
					filter,
					extendedFilter,
					relationship,
					sort,
				});
			const response = await this._execRequest(call, {
				errorMsg: "Erro ao carregar a lista de dependentes.",
				swallow: false,
			});
			if (response?.data) this.setDependents(response.data.dependents);
		},*/

		async getRelationship(id, relationship) {
			const call = () => relationshipAPI.get(id, relationship);
			const response = await this._execRequest(call, {
				errorMsg: "Erro ao carregar os dados do registro.",
				swallow: false,
			});

			if (response?.data) {
				this.$store.commit(
					"relationship/setRelationship",
					response.data.relationship
				);
			}

			return null;
		},

		async saveOrUpdate(payload) {
			
			if (!(payload.photo instanceof File)) {
				delete payload.photo;
			}

			const call = () => relationshipAPI.saveOrUpdate(payload);

			const response = await this._execRequest(call, {
				errorMsg: "Erro ao salvar os dados.",
			});
			if (response?.data) {
				this.$store.commit(
					"dependent/addDependent",
					response.data.dependent
				);
				this.resetDependentView();
			}
		},

		async updateDependent(payload) {
			if (!(payload.photo instanceof File)) {
				delete payload.photo;
			}

			const formData = new FormData();

			Object.keys(payload).forEach((key) => {
				if (payload[key] !== null && payload[key] !== undefined) {
					formData.append(key, payload[key]);
				}
			});

			const call = () => relationshipAPI.saveOrUpdate(formData);

			const response = await this._execRequest(call, {
				errorMsg: "Erro ao salvar os dados.",
			});

			if (response?.data) {
				this.$store.commit(
					"dependent/addDependent",
					response.data.dependent
				);
				this.resetDependentView(response.data.dependent.id);
			}
		},

		async destroyDependent(id) {
			const call = () => relationshipAPI.remove(id);
			const response = await this._execRequest(call, {
				successMsg: "Registro excluído com sucesso.",
				errorMsg: "Erro ao excluir o produto.",
			});
			if (response) {
				this.resetDependentView();
			}
		},

		getFile(file) {
			// se tiver um serviço para isso, importe-o. Aqui só repassamos.
			// Exemplo: return fileService.getFile(file)
			return file;
		},

		resetRelationshipView(id) {
			// mantém compatibilidade com seus nomes de rota
			// ajuste os nomes das rotas caso necessário
			this.relationship = {};
			if (this.SET_ERRORS) this.SET_ERRORS([]);
			id
				? this.$router.push({ name: "DependentShow", params: { id } })
				: this.$router.push({ name: "DependentList" });
		},

		/**
		 * _execRequest: reutiliza a lógica de tratamento de requests.
		 * Se o componente tiver this.handleRequest definido, usamos ele (mantendo comportamento anterior).
		 * Caso contrário, fazemos try/catch padrão. Retornamos a response ou null se falhar.
		 */
		async _execRequest(
			callFn,
			{ successMsg = null, errorMsg = null, swallow = true } = {}
		) {
			// usa this.handleRequest se existir (preserva tratamento global/alertas)
			if (typeof this.handleRequest === "function") {
				try {
					return await this.handleRequest(
						callFn,
						successMsg,
						errorMsg,
						swallow
					);
				} catch (err) {
					// handleRequest deve já ter mostrado mensagem. retornamos null.
					return null;
				}
			}

			// fallback direto (sem handleRequest)
			try {
				const res = await callFn();
				if (successMsg && this.$toast) {
					// se você tiver um plugin de toast
					this.$toast.success(successMsg);
				}
				return res;
			} catch (err) {
				if (errorMsg && this.$toast) this.$toast.error(errorMsg);
				console.error(errorMsg ?? "Erro na requisição", err);
				return null;
			}
		},
	},
};
