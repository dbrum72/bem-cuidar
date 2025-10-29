import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ChildView from '@/views/ChildView.vue';
import SharedCareView from '@/views/SharedCareView.vue';
import TransactionView from '@/views/TransactionView.vue';

const routes = [
  { path:'/', name:'Dashboard', component:DashboardView },
  { path:'/login', name:'Login', component:LoginView },
  { path:'/register', name:'Register', component:RegisterView },
  { path:'/child', name:'Children', component:ChildView },
  { path:'/shared-care', name:'SharedCare', component:SharedCareView },
  { path:'/transactions', name:'Transactions', component:TransactionView },
];

export default createRouter({ history:createWebHistory(), routes });
