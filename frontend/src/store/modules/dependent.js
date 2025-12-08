import { createResource } from "@/services/resource.js";

const dependentAPI = createResource("dependent");

export default {
    namespaced: true,

    state: {
        dependent: {},
        dependents: []
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
            const index = state.dependents.findIndex(a => a.id === dependent.id);
            if (index !== -1) state.dependents.splice(index, 1, dependent);
            else state.dependents.push(dependent);
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
        async getDependents({ commit, dispatch }) {
            const call = () => dependentAPI.list();

            const response = await dispatch("_execRequest", {
                callFn: call,
                options: {
                    errorMsg: "Erro ao carregar a lista de dependentes.",
                    swallow: false
                }
            });

            if (response?.data) {
                commit("setDependents", response.data.dependents);
            }
        },

        // =====================================================
        // GET ONE
        // =====================================================
        async getDependent({ commit, dispatch }, id) {
            const call = () => dependentAPI.get(id);

            const response = await dispatch("_execRequest", {
                callFn: call,
                options: {
                    errorMsg: "Erro ao carregar os dados do registro.",
                    swallow: false
                }
            });

            if (response?.data) {
                commit("setDependent", response.data.dependent);
            }

            return response?.data?.dependent ?? null;
        },

        // =====================================================
        // SAVE or UPDATE
        // =====================================================
        async addOrUpdate({ commit, dispatch }, payload) {
            const call = () => dependentAPI.save(payload);

            const response = await dispatch("_execRequest", {
                callFn: call,
                options: {
                    errorMsg: "Erro ao salvar os dados."
                }
            });

            if (response?.data) {
                commit("addDependent", response.data.dependent);
                return response.data.dependent;
            }

            return null;
        },

        // =====================================================
        // DESTROY
        // =====================================================
        async destroyDependent({ dispatch }, id) {
            const call = () => dependentAPI.remove(id);

            const response = await dispatch("_execRequest", {
                callFn: call,
                options: {
                    successMsg: "Registro excluído com sucesso.",
                    errorMsg: "Erro ao excluir o produto."
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
};
