import http from "@/services/http.js";

export default {
    namespaced: true,

    state: {
        token: localStorage.getItem("token") || null,
        user: localStorage.getItem("user") || null,
    },

    mutations: {        
        setToken(state, token) {
            state.token = token
            localStorage.setItem("token", token);
        },

        setUser(state, user) {
            state.user = user
            localStorage.setItem("user", user);
        }
    },

    actions: {
        async login({ commit }, credentials) {
            const { data } = await http.post('auth/login', credentials);
            commit('setToken', data.token);
            commit('setUser', data.user);
        },

        async register({ commit }, payload) {
            const { data } = await http.post('auth/register', payload);
            commit('setToken', data.token);
            commit('setUser', data.user);
        },
        
        logout({ commit }) {
            commit('setToken', null);
            commit('setUser', null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    }
}
