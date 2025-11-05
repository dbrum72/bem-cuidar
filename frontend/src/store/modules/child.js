import http from "@/services/http.js";

export default {

    namespaced: true,

    state: {
        child: {},
        children: []
    },

    mutations: {

        setChildren(state, children) {
            console.log(children)
            state.children = children;
        },

        setChild(state, child) {
            console.log(child)
            state.child = child;
        },

        addChild(state, child) {
            if (!child || !child.id) return;
            const index = state.children.findIndex(a => a.id === child.id);
            if (index !== -1) state.children.splice(index, 1, child);
            else state.children.push(child);
        },
    },

    actions: {

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
