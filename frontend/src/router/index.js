import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ChildView from '@/views/ChildView.vue';
import TransactionView from '@/views/TransactionView.vue';

const routes = [
    { path: '/', name: 'Dashboard', component: DashboardView },
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/register', name: 'Register', component: RegisterView },
    { path: '/child', name: 'Children', component: ChildView },
    {
        path: '/appointment',
        name: 'Appointment',
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
            }
        ]
    },
    { path: '/transactions', name: 'Transactions', component: TransactionView },
];

export default createRouter({ history: createWebHistory(), routes });
