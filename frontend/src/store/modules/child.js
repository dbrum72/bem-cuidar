export default {

    namespaced: true,

    state: {
        child: {},
        children: []
    },

    mutations: {

        setChildren(state, children) {
            state.children = children;
        },

        setChild(state, child) {
            state.child = child;
        },

        addChild(state, child) {
            if (!child || !child.id) return;
            const index = state.children.findIndex(a => a.id === child.id);
            if (index !== -1) state.children.splice(index, 1, child);
            else state.children.push(child);
        },
    }
}
