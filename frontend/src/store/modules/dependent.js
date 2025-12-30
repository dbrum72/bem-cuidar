import { createResource } from "@/services/resource.js";

const dependentAPI = createResource("dependent");

export default {
	namespaced: true,

	state: {
		dependent: {},
		dependents: [],
	},

	mutations: {
		setDependents(state, dependents) {
			state.dependents = dependents;
		},

		setDependent(state, dependent) {
			state.dependent = dependent;
		},

		addDependent(state, dependent) {
			if (!dependent || !dependent.id) return;
			const index = state.dependents.findIndex(
				(a) => a.id === dependent.id
			);
			if (index !== -1) state.dependents.splice(index, 1, dependent);
			else state.dependents.push(dependent);
		},
	},

	actions: {
		// =====================================================
		// GET LIST
		// =====================================================
		async getDependents({ commit, dispatch }) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => dependentAPI.list(),
					successMsg: (response) =>
						response?.data?.dependents?.length
							? "Dependentes carregados com sucesso."
							: "Nenhum dependente cadastrado.",
					errorMsg: "Erro ao carregar dependentes.",
				},
				{ root: true }
			);

			if (response?.data) {
				commit("setDependents", response.data.dependents);
			}
		},


		// =====================================================
		// GET ONE
		// =====================================================
		async getDependent({ commit, dispatch }, id) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => dependentAPI.get(id),
					successMsg: "Dados do dependente carregados com sucesso.",
					errorMsg: "Erro ao carregar os dados do dependente.",
				},
				{ root: true }
			);

			if (response?.data) {
				commit("setDependent", response.data.dependent);
			}
		},

		// =====================================================
		// SAVE or UPDATE
		// =====================================================
		async addOrUpdate({ commit, dispatch }, payload) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => dependentAPI.save(payload),
					successMsg: "Dados salvos com sucesso.",
					errorMsg: "Erro ao salvar dados.",
				},
				{ root: true }
			);

			if (response?.data) {
				commit("addDependent", response.data.dependent);
				return;
			}

			return null;
		},

		// =====================================================
		// DESTROY
		// =====================================================
		async destroyDependent({ dispatch }, id) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => dependentAPI.remove(id),
					successMsg: "Dados excluídos com sucesso.",
					errorMsg: "Erro ao excluir dados.",
				},
				{ root: true }
			);
			return !!response;
		},

		// =====================================================
		// GET FILE (repassado como no mixin)
		// =====================================================
		getFile(_, file) {
			return file; // ou service específico
		},
	},
};
