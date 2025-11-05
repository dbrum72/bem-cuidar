import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import TransactionView from '@/views/TransactionView.vue';

const routes = [
    {
        path: '/',
        name: 'Index',
        component: () => import('@/views/index.vue'),
    },
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/register', name: 'Register', component: RegisterView },     
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
    },    
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
        component: () => import('@/views/child/child-fetch.vue'),
        children: [
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
