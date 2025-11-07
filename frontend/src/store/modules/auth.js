import http from "@/services/http.js";
import router from "@/router";

export default {
    namespaced: true,

    state: {
        token: localStorage.getItem("token") || null,
        user: (() => {
            try {
                const saved = localStorage.getItem("user");
                return saved ? JSON.parse(saved) : null;
            } catch {
                localStorage.removeItem("user");
                return null;
            }
        })(),
    },

    mutations: {
        setToken(state, token) {
            state.token = token;
            if (token) localStorage.setItem("token", token);
            else localStorage.removeItem("token");
        },

        setUser(state, user) {
            state.user = user;
            if (user) localStorage.setItem("user", JSON.stringify(user));
            else localStorage.removeItem("user");
        }
    },

    actions: {
        async login({ commit }, credentials) {
            const { data } = await http.post('auth/login', credentials);
            commit('setToken', data.token);
            commit('setUser', data.user);
            router.push({ name: 'Dashboard' });
        },

        async register({ commit }, payload) {
            const { data } = await http.post('auth/register', payload);
            commit('setToken', data.token);
            commit('setUser', data.user);
            router.push({ name: 'Dashboard' });
        },

        logout({ commit }) {
            commit('setToken', null);
            commit('setUser', null);
            router.push({ name: 'Index' });
        }
    }
}
