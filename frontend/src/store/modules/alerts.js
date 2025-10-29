export default {

    namespaced: true,

    state: {
        alerts: []
    },

    mutations: {

        pushAlert: (state, alert) => {
            state.alerts.push({
                ...alert,
                id: Date.now().toString(),
            });
        },

        filterAlert: (state, alertToRemove) => {
            state.alerts = state.alerts.filter((alert) => {
                return alert.id != alertToRemove.id;
            });
        }
    }
}
