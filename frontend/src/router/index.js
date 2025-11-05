import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ChildView from '@/views/child/child-save.vue';
import TransactionView from '@/views/TransactionView.vue';

const routes = [
    { path: '/', name: 'Dashboard', component: DashboardView },
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/register', name: 'Register', component: RegisterView },
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
    {
        path: '/child',
        name: 'Child',
        children: [
            {
                path: 'list',
                name: 'ChildrenList',
                component: () => import('@/views/child/child-fetch.vue'),
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
    { path: '/transactions', name: 'Transactions', component: TransactionView },
];

export default createRouter({ history: createWebHistory(), routes });
