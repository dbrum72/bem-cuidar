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

        addRelationship(state, relationship) {
            if (!relationship || !relationship.id) return;
            const index = state.relationships.findIndex(a => a.id === relationship.id);
            if (index !== -1) state.relationships.splice(index, 1, relationship);
            else state.relationships.push(relationship);
        },
    },

    actions: {

        async _execRequest({ rootGetters }, { callFn, successMsg = null, errorMsg = null, swallow = true }) {

            const handleRequest = rootGetters["handleRequest"];

            if (typeof handleRequest === "function") {
                try {
                    return await handleRequest(callFn, successMsg, errorMsg, swallow);
                } catch {
                    return null;
                }
            }

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
        // GET LIST
        // =====================================================
        async getRelationships({ commit, dispatch }, { filter, extendedFilter, relationship, sort }) {
            const call = () => relationshipAPI.list({ filter, extendedFilter, relationship, sort });

            const response = await dispatch("_execRequest", {
                callFn: call,
                options: {
                    errorMsg: "Erro ao carregar a lista de relacionamentos.",
                    swallow: false
                }
            });

            if (response?.data) {
                commit("setRelationships", response.data.relationships);
            }
        },

        // =====================================================
        // GET ONE
        // =====================================================
        async getRelationship({ commit, dispatch }, id) {
            const call = () => relationshipAPI.get(id);

            const response = await dispatch("_execRequest", {
                callFn: call,
                options: {
                    errorMsg: "Erro ao carregar os dados do registro.",
                    swallow: false
                }
            });

            if (response?.data) {
                commit("setRelationship", response.data.relationship);
            }

            return response?.data?.relationship ?? null;
        },

        // =====================================================
        // SAVE or UPDATE
        // =====================================================
        async saveOrUpdate({ commit, dispatch }, payload) {
            
            const call = () => relationshipAPI.save(payload);

            const response = await dispatch("_execRequest", {
                callFn: call,
                options: {
                    errorMsg: "Erro ao salvar os dados."
                }
            });

            if (response?.data) {
                commit("addRelationship", response.data.relationship);
                return response.data.relationship;
            }

            return null;
        },

        // =====================================================
        // DESTROY
        // =====================================================
        async destroyRelationship({ dispatch }, id) {
            const call = () => relationshipAPI.remove(id);

            const response = await dispatch("_execRequest", {
                callFn: call,
                options: {
                    successMsg: "Registro excluído com sucesso.",
                    errorMsg: "Erro ao excluir registro."
                }
            });

            return !!response;
        },

        // =====================================================
        // GET FILE (repassado como no mixin)
        // =====================================================
        getFile(_, file) {
            return file; // ou service específico
        },
    }
}
