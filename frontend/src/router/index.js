import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
	{
		path: "/",
		name: "Index",
		component: () => import("@/views/index.vue"),
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("@/views/LoginView.vue"),
	},
	{
		path: "/register",
		name: "Register",
		component: () => import("@/views/RegisterView.vue"),
	},
	{
		path: "/dashboard",
		name: "DashboardView",
		component: () => import("@/views/DashboardView.vue"),
		meta: { requiresAuth: true },
	},
	{
		path: "/appointment",
		name: "Appointment",
		meta: { requiresAuth: true },
		children: [
			{
				path: "list",
				name: "AppointmentList",
				component: () =>
					import("@/views/appointment/appointment-fetch.vue"),
			},
			{
				path: "save/:id?",
				name: "AppointmentSave",
				component: () =>
					import("@/views/appointment/appointment-save.vue"),
			},
			{
				path: "show/:id",
				name: "AppointmentShow",
				component: () =>
					import("@/views/appointment/appointment-show.vue"),
			},
		],
	},
	{
		path: "/dependent",
		name: "Dependent",
		meta: { requiresAuth: true },
		children: [
			{
				path: "list",
				name: "DependentList",
				component: () =>
					import("@/views/dependent/dependent-list.vue"),
			},
			{
				path: "show/:id",
				name: "DependentShow",
				component: () => import("@/views/dependent/dependent-show.vue"),
			},
			{
				path: "save/:id?",
				name: "DependentSave",
				component: () => import("@/views/dependent/dependent-save.vue"),
			},
			{
				path: "delete/:id",
				name: "DependentDelete",
				component: () =>
					import("@/views/dependent/dependent-delete.vue"),
			},
		],
	},
	{
		path: "/transactions",
		name: "Transactions",
		component: () => import("@/views/TransactionView.vue"),
		meta: { requiresAuth: true },
	},
	{
		path: "/tutor-invite",
		name: "TutorInvite",
		component: () => import("@/views/tutor/tutor-invite.vue"),
		meta: { requiresAuth: true, roles: ['tutor', 'admin'] }
	},
	{
		path: '/user',
		name: 'User',
		meta: { requiresAuth: true },
		children: [
			{ path: 'list', name: 'UserList', component: () => import('@/views/user/user-list.vue') },
			{ path: 'show/:id', name: 'UserShow', component: () => import('@/views/user/user-show.vue') },
			{ path: 'save/:id', name: 'UserSave', component: () => import('@/views/user/user-save.vue') },
		],
	},

];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	const isAuthenticated = !!localStorage.getItem("token");
	const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
	const userPermissions = JSON.parse(localStorage.getItem("permissions") || "[]");

	if (to.meta.requiresAuth && !isAuthenticated) {
		next({ name: "Login" });
		return;
	}

	// se rota exigir roles
	if (to.meta.roles && Array.isArray(to.meta.roles)) {
		const allowed = to.meta.roles.some((r) => userRoles.includes(r));
		if (!allowed) {
			next({ name: "Dashboard" }); // redirecionamento neutro
			return;
		}
	}

	// se rota exigir permissions
	if (to.meta.permissions && Array.isArray(to.meta.permissions)) {
		const allowedPerm = to.meta.permissions.some((p) =>
			userPermissions.includes(p)
		);
		if (!allowedPerm) {
			next({ name: "Dashboard" });
			return;
		}
	}

	next();
});

export default router;
