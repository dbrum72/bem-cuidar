import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap'

import GlobalLoader from "@/components/loaders/global-loader.vue";

const app = createApp(App);

app.component('GlobalLoader', GlobalLoader);

app.use(store);
app.use(router);

app.mount('#app');

