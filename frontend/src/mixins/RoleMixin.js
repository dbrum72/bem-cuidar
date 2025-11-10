// src/mixins/RoleMixin.js
export default {

	computed: {
		userRoles() {
			return this.$store.state.auth.roles || [];
		},
        
		userPermissions() {
			return this.$store.state.auth.permissions || [];
		},
	},

	methods: {
		hasRole(role) {
			if (!role) return false;
			return this.userRoles.includes(role);
		},

		hasAnyRole(roles = []) {
			return roles.some((r) => this.hasRole(r));
		},

		hasPermission(permission) {
			if (!permission) return false;
			return this.userPermissions.includes(permission);
		},
	},
};
