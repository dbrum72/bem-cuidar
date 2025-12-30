import { createResource } from "@/services/resource.js";
import router from "@/router";

const authAPI = createResource("auth");
const userAPI = createResource("auth/login");

export default {
	namespaced: true,

	state: {
		token: localStorage.getItem("token") || null,
		user: localStorage.getItem("user")
			? JSON.parse(localStorage.getItem("user"))
			: null,
		roles: localStorage.getItem("roles")
			? JSON.parse(localStorage.getItem("roles"))
			: [],
		permissions: localStorage.getItem("permissions")
			? JSON.parse(localStorage.getItem("permissions"))
			: [],
	},

	mutations: {
		setToken(state, token) {
			state.token = token;
			token
				? localStorage.setItem("token", token)
				: localStorage.removeItem("token");
		},

		setUser(state, user) {
			state.user = user;
			user
				? localStorage.setItem("user", JSON.stringify(user))
				: localStorage.removeItem("user");
		},

		setRoles(state, roles) {
			state.roles = roles || [];
			roles
				? localStorage.setItem("roles", JSON.stringify(roles))
				: localStorage.removeItem("roles");
		},

		setPermissions(state, permissions) {
			state.permissions = permissions || [];
			permissions
				? localStorage.setItem(
						"permissions",
						JSON.stringify(permissions)
				  )
				: localStorage.removeItem("permissions");
		},

		clearSession(state) {
			state.token = null;
			state.user = null;
			state.roles = [];
			state.permissions = [];
			localStorage.clear();
		},
	},

	actions: {
		async login({ dispatch, commit }, payload) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => userAPI.post(payload),
					successMsg: "Login realizado com sucesso.",
					errorMsg: "Erro ao realizar login.",
				},
				{ root: true }
			);

			if (response?.data) {
				commit("setToken", response.data.token);
				commit("setUser", response.data.user);
				commit("setRoles", response.data.roles ?? []);
				commit("setPermissions", response.data.permissions ?? []);

				router.push({ name: "DashboardView" });
			}

			return response;
		},

		async logout({ dispatch, commit }) {
			await dispatch(
				"request/exec",
				{
					callFn: () => authAPI.post("logout"),
					successMsg: "Sessão encerrada.",
					errorMsg:
						"Falha ao encerrar sessão no servidor. Logout local aplicado.",
					swallow: true, // importante: nunca bloquear logout
				},
				{ root: true }
			);

			commit("clearSession");
			router.push({ name: "Login" });
		},
	},
};
