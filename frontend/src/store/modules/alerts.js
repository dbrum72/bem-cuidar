export default {
    namespaced: true,

    state: () => ({
        alerts: []
    }),

    mutations: {
        ADD_ALERT(state, alert) {
            state.alerts.push({
                id: Date.now() + Math.random(),
                type: alert.type || "info",
                message: alert.message,
                icon: alert.icon || { name: "bi-info-circle", color: "blue" },
                timeout: alert.timeout ?? 4000
            });
        },

        REMOVE_ALERT(state, id) {
            state.alerts = state.alerts.filter(a => a.id !== id);
        },

        CLEAR_ALERTS(state) {
            state.alerts = [];
        }
    },

    actions: {
        show({ commit }, alert) {
            commit("ADD_ALERT", alert);
        },

        remove({ commit }, id) {
            commit("REMOVE_ALERT", id);
        },

        clear({ commit }) {
            commit("CLEAR_ALERTS");
        }
    },

    getters: {
        all: state => state.alerts
    }
};
