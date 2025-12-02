// store/relationship.js
import { createResource } from "@/services/resource.js";

const relationshipAPI = createResource("relationship");

export default {
    namespaced: true,

    state: {
        relationship: {},
        relationships: []
    },

    mutations: {

        setRelationships(state, relationships) {
            state.relationships = relationships;
        },

        setRelationship(state, relationship) {
            state.relationship = relationship;
        },

        addOrUpdate(state, relationship) {
            if (!relationship || !relationship.id) return;
            const index = state.relationships.findIndex(r => r.id === relationship.id);
            if (index !== -1) state.relationships.splice(index, 1, relationship);
            else state.relationships.push(relationship);
        },

        removeRelationship(state, id) {
            state.relationships = state.relationships.filter(r => r.id !== id);
        }
    },

    actions: {

        async _execRequest(
            { rootGetters },
            { callFn, successMsg = null, errorMsg = null, swallow = true }
        ) {
            const handleRequest = rootGetters["handleRequest"];

            // usa handleRequest global se existir
            if (typeof handleRequest === "function") {
                try {
                    return await handleRequest(callFn, successMsg, errorMsg, swallow);
                } catch (err) {
                    return null;
                }
            }

            // fallback
            try {
                const res = await callFn();
                if (successMsg && window?.$toast) window.$toast.success(successMsg);
                return res;
            } catch (err) {
                if (errorMsg && window?.$toast) window.$toast.error(errorMsg);
                console.error(errorMsg ?? "Erro na requisição", err);
                return null;
            }
        },

        // =====================================================
        // LIST
        // =====================================================
        async getRelationships({ commit, dispatch }, params = {}) {
            const call = () => relationshipAPI.list(params);

            const response = await dispatch("_execRequest", {
                callFn: call,
                errorMsg: "Erro ao carregar relacionamentos.",
                swallow: false
            });

            if (response?.data) {
                commit("setRelationships", response.data.relationships);
            }

            return response;
        },

        // =====================================================
        // GET ONE
        // =====================================================
        async getRelationship({ commit, dispatch }, id) {
            const call = () => relationshipAPI.get(id);

            const response = await dispatch("_execRequest", {
                callFn: call,
                errorMsg: "Erro ao carregar dados do vínculo.",
                swallow: false
            });

            if (response?.data) {
                commit("setRelationship", response.data.relationship);
                return response.data.relationship;
            }

            return null;
        },

        // =====================================================
        // SAVE or UPDATE
        // Aceita arquivo photo e usa createResource para FormData
        // =====================================================
        async addOrUpdate({ commit, dispatch }, payload) {

            const call = () => relationshipAPI.save(payload);

            const response = await dispatch("_execRequest", {
                callFn: call,
                successMsg: "Vínculo salvo com sucesso!",
                errorMsg: "Erro ao salvar vínculo."
            });

            if (response?.data) {
                commit("addOrUpdate", response.data.relationship);
                return response.data.relationship;
            }

            return null;
        },

        // =====================================================
        // DELETE
        // =====================================================
        async deleteRelationship({ commit, dispatch }, id) {
            const call = () => relationshipAPI.remove(id);

            const response = await dispatch("_execRequest", {
                callFn: call,
                successMsg: "Vínculo excluído com sucesso.",
                errorMsg: "Erro ao excluir vínculo."
            });

            if (response) {
                commit("removeRelationship", id);
            }

            return !!response;
        }
    }
};
