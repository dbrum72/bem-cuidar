import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Index',
        component: () => import('@/views/index.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/appointment',
        name: 'Appointment',
        component: () => import('@/views/appointment/appointment-fetch.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: 'save/:id?',
                name: 'AppointmentSave',
                component: () => import('@/views/appointment/appointment-save.vue'),
            }
        ]
    },
    {
        path: '/child',
        name: 'Child',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'list',
                name: 'ChildList',
                component: () => import('@/views/child/child-fetch.vue'),
            },
            {
                path: 'show/:id',
                name: 'ChildShow',
                component: () => import('@/views/child/child-show.vue'),
            },
            {
                path: 'save/:id?',
                name: 'ChildSave',
                component: () => import('@/views/child/child-save.vue'),
            },
            {
                path: 'delete/:id',
                name: 'ChildDelete',
                component: () => import('@/views/child/child-delete.vue'),
            }
        ]
    },
    {
        path: '/transactions',
        name: 'Transactions',
        component: () => import('@/views/TransactionView.vue'),
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;
