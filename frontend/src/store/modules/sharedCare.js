import http from "@/services/http.js";

export default {
    namespaced: true,

    state: {
        sharedCare: []
    },

    mutations: {
        setSharedCare(state, sharedCare) {
            state.sharedCare = sharedCare;
        },

        addSharedCare(state, event) {
            state.sharedCare.push(event);
        }
    },

    actions: {
        async fetchSharedCare({ commit }) {
            const { data } = await http.get('shared-care-events');
            commit('setSharedCare', data.sharedCareEvents);
        },

        async createSharedCare({ commit }, payload) {
            const { data } = await http.post('shared-care-events', payload);
            commit('addSharedCare', data);
        }
    }
}
