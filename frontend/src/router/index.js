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
        name: 'DashboardView',
        component: () => import('@/views/DashboardView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/appointment',
        name: 'Appointment',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'list',
                name: 'AppointmentList',
                component: () => import('@/views/appointment/appointment-fetch.vue'),
            },
            {
                path: 'save/:id?',
                name: 'AppointmentSave',
                component: () => import('@/views/appointment/appointment-save.vue'),
            },
            {
                path: 'show/:id',
                name: 'AppointmentShow',
                component: () => import('@/views/appointment/appointment-show.vue'),
            }
        ]
    },
    {
        path: '/dependent',
        name: 'Dependent',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'list',
                name: 'DependentList',
                component: () => import('@/views/dependent/dependent-fetch.vue'),
            },
            {
                path: 'show/:id',
                name: 'DependentShow',
                component: () => import('@/views/dependent/dependent-show.vue'),
            },
            {
                path: 'save/:id?',
                name: 'DependentSave',
                component: () => import('@/views/dependent/dependent-save.vue'),
            },
            {
                path: 'delete/:id',
                name: 'DependentDelete',
                component: () => import('@/views/dependent/dependent-delete.vue'),
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
