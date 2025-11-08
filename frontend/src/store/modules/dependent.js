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
    }
}
