// src/mixins/AuthMixin.js
import { mapState, mapMutations } from "vuex";
import { createResource } from "@/services/resource.js";

export default {
	computed: {
		...mapState("auth", ["token", "user", "roles", "permissions"]),
		isAuthenticated() {
			return !!this.token;
		},
	},

	methods: {
		...mapMutations("auth", [
			"setToken",
			"setUser",
			"setRoles",
			"setPermissions",
			"logout",
		]),

		getAuthResource() {
			return createResource("auth");
		},

		getAuthToken() {
			return this.token || localStorage.getItem("token");
		},

		async login(credentials) {
			const { data } = await this.getAuthResource().post(
				"login",
				credentials
			);
			this.setToken(data.token);
			this.setUser(data.user);
			this.setRoles(data.roles || []);
			this.setPermissions(data.permissions || []);
			this._toastSuccess("Login realizado com sucesso!");
			this.$router.push({ name: "DashboardView" });
		},

		async loadUser() {
			const { data } = await this.getAuthResource().post("me");
			if (data) {
				this.setUser(data.user || data);
				this.setRoles(data.roles || []);
				this.setPermissions(data.permissions || []);
			}
		},

		async logoutUser() {
			try {
				await this.getAuthResource().post("logout");
			} catch (e) {
				console.warn("Logout local forçado:", e);
			}
			this.clearSession();
			this._toastSuccess("Sessão encerrada.");
			if (this.$router) this.$router.push({ name: "Login" });
		},

		clearSession() {
			this.setToken(null);
			this.setUser(null);
			this.setRoles([]);
			this.setPermissions([]);
		},

		_toastSuccess(msg) {
			if (this.$toast) this.$toast.success(msg);
			else console.log("✅", msg);
		},
	},
};
