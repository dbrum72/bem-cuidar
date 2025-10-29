import http from "@/services/http.js";

export default {

    namespaced: true,

    state: {
        children: []
    },

    mutations: {

        setChildren(state, children) {
            state.children = children;
        },

        addChild(state, child) {
            state.children.push(child);
        }
    },

    actions: {
        async fetchChildren({ commit }) {
            const { data } = await http.get('children');
            commit('setChildren', data.children);
        },

        async createChild({ commit }, payload) {
            
            const { data } = await http.post('children', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            commit('addChild', data);
        }
    }
}
