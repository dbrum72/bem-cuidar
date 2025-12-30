import { createResource } from "@/services/resource.js";

const relationshipAPI = createResource("relationship");

export default {
	namespaced: true,

	state: {
		relationship: {},
		relationships: [],
		tutorsByDependent: [],
	},

	mutations: {
		SET_RELATIONSHIPS(state, relationships) {
			state.relationships = relationships;
		},

		SET_RELATIONSHIP(state, relationship) {
			state.relationship = relationship;
		},

		ADD_RELATIONSHIP(state, relationship) {
			if (!relationship || !relationship.id) return;
			const index = state.relationships.findIndex(
				(a) => a.id === relationship.id
			);
			if (index !== -1)
				state.relationships.splice(index, 1, relationship);
			else state.relationships.push(relationship);
		},

		REMOVE_RELATIONSHIP(state, relationshipId) {
			state.relationships = state.relationships.filter(
				(r) => r.id !== relationshipId
			);

			if (state.relationship?.id === relationshipId) {
				state.relationship = {};
			}
		},

		SET_TUTOR_BY_DEPENDENT(state, tutorsByDependent) {
			state.tutorsByDependent = tutorsByDependent;
		},
	},

	actions: {
		// =====================================================
		// GET LIST
		// =====================================================
		async getRelationships({ commit, dispatch }) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => relationshipAPI.list({ skipLoader: true }),
					successMsg: (response) =>
						response?.data?.relationships?.length
							? "Relacionamentos carregados com sucesso."
							: "Nenhum relacionamento cadastrado.",
					errorMsg: "Erro ao carregar relacionamentos.",
				},
				{ root: true }
			);

			if (response?.data) {
				commit("SET_RELATIONSHIPS", response.data.relationships);
			}
		},

		// =====================================================
		// GET ONE
		// =====================================================
		async getRelationship({ commit, dispatch }, id) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => relationshipAPI.get(id, { skipLoader: true }),
					successMsg: "Dados do relacionamento carregados com sucesso.",
					errorMsg: "Erro ao carregar os dados do relacionamento.",
				},
				{ root: true }
			);

			if (response?.data) {
				commit("SET_RELATIONSHIP", response.data.relationship);
			}
		},

		// =====================================================
		// SAVE or UPDATE
		// =====================================================
		async saveOrUpdate({ commit, dispatch }, payload) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => relationshipAPI.save(payload, { skipLoader: true }),
					successMsg: "Dados do relacionamento salvos com sucesso.",
					errorMsg: "Erro ao salvar dados do relacionamento.",
				},
				{ root: true }
			);

			if (response?.data) {
				commit("ADD_RELATIONSHIP", response.data.relationship);
				return response.data.relationship;
			}

			return null;
		},

		// =====================================================
		// DESTROY
		// =====================================================
		async destroyRelationship({ commit, dispatch }, id) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => relationshipAPI.remove(id, { skipLoader: true }),
					successMsg: "Dados do relacionamento excluídos com sucesso.",
					errorMsg: "Erro ao excluir dados do relacionamento.",
				},
				{ root: true }
			);

			if (response) {
				commit("REMOVE_RELATIONSHIP", id);
				return true;
			}

			return !!response;
		},

		// =====================================================
		// GET TUTORS BY DEPENDENT
		// =====================================================
		async getTutorsByDependent({ commit, dispatch }, dependentId) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () =>
						relationshipAPI.get(`getTutors/${dependentId}`, {
							skipLoader: true,
						}),
					successMsg: "Tutores carregados com sucesso.",
					errorMsg: "Erro ao carregar tutores.",
				},
				{ root: true }
			);

			if (response?.data) {
				commit(
					"SET_TUTOR_BY_DEPENDENT",
					response.data.tutorsByDependent
				);
			}
		},

		// =====================================================
		// GET FILE
		// =====================================================
		getFile(_, file) {
			return file; // ou service específico
		},
	},
};
