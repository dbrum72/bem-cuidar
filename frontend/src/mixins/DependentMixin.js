import { createResource } from "@/services/resource.js";
import { mapMutations } from "vuex";

let dependentAPI = createResource("dependent");

export default {
	methods: {
		...mapMutations("dependent", [
			"setDependents",
			"setDependent",
			"addDependent",
		]),

		async getDependents(filter, extendedFilter, relationship, sort) {
			const call = () =>
				dependentAPI.list({filter, extendedFilter, relationship, sort});
			const response = await this._execRequest(call, {
				errorMsg: "Erro ao carregar a lista de produtos.",
				swallow: false,
			}); 
			if (response?.data) this.setDependents(response.data.dependents);
		},

		async getDependent(id) {
			const call = () => dependentAPI.get(id);
			const response = await this._execRequest(call, {
				errorMsg: "Erro ao carregar os dados do registro.",
				swallow: false,
			});

			if (response?.data) {
				this.$store.commit(
					"dependent/setDependent",
					response.data.dependent
				);
			}

			return null;
		},

		async storeDependent(payload) {
			const call = () => dependentAPI.saveOrUpdate(payload);
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
			const call = () => dependentAPI.saveOrUpdate(payload);
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
			const call = () => dependentAPI.remove(id);
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

		resetDependentView(id) {
			// mantém compatibilidade com seus nomes de rota
			// ajuste os nomes das rotas caso necessário
			this.Dependent = {};
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
