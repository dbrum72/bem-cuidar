import http from "@/services/http.js";

export default {

    namespaced: true,

    state: {
        notifications: []
    },

    mutations: {
        setNotifications(state, n) {
            state.notifications = n;
        },

        markRead(state, id) {
            state.notifications = state.notifications.map(n => n.id === id ? {
                ...n, read_at: new Date()
            } : n);
        }
    },

    actions: {
        async fetchNotifications({ commit }) {
            const { data } = await http.get('notifications');
            commit('setNotifications', data);
        },

        async markRead({ commit }, id) {
            await http.post(`notifications/mark-read/${id}`);
            commit('markRead', id);
        }
    }
}
