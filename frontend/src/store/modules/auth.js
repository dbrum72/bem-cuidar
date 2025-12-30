// src/store/modules/auth.js
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
			if (token) localStorage.setItem("token", token);
			else localStorage.removeItem("token");
		},

		setUser(state, user) {
			state.user = user;
			if (user) localStorage.setItem("user", JSON.stringify(user));
			else localStorage.removeItem("user");
		},

		setRoles(state, roles) {
			state.roles = roles || [];
			if (roles) localStorage.setItem("roles", JSON.stringify(roles));
			else localStorage.removeItem("roles");
		},

		setPermissions(state, permissions) {
			state.permissions = permissions || [];
			if (permissions)
				localStorage.setItem(
					"permissions",
					JSON.stringify(permissions)
				);
			else localStorage.removeItem("permissions");
		},

		logout(state) {
			state.token = null;
			state.user = null;
			state.roles = [];
			state.permissions = [];
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			localStorage.removeItem("roles");
			localStorage.removeItem("permissions");
		},
	},

	getters: {
		hasRole: (state) => (role) => state.roles.includes(role),
		hasAnyRole: (state) => (roles) =>
			roles.some((r) => state.roles.includes(r)),
		hasPermission: (state) => (perm) => state.permissions.includes(perm),
	},
};
