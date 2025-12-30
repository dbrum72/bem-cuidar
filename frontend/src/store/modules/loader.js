export default {
    namespaced: true,

    state: () => ({
        active: false,
        counter: 0, // suporta múltiplas requisições simultâneas
    }),

    mutations: {
        START_LOADING(state) {
            state.counter++;
            state.active = true;
        },

        STOP_LOADING(state) {
            state.counter = Math.max(0, state.counter - 1);
            state.active = state.counter > 0;
        },

        RESET_LOADING(state) {
            state.counter = 0;
            state.active = false;
        },
    },
};
