<template>
    <div>
        <nav>
            <router-link to="/">Dashboard</router-link> |
            <router-link to="/child">Crianças</router-link> |
            <router-link to="/shared-care">Eventos</router-link> |
            <router-link to="/transactions">Transações</router-link> |
            <button @click="logout">Logout</button>
        </nav>
        <AlertList />
        <router-view />
    </div>
</template>

<script>
import AlertList from './components/alerts/alert-list.vue'

export default {

    components: { AlertList },

    methods: {
        logout() {
            this.$store.dispatch('auth/logout');
            this.$router.push('/login');
        }
    }
}
</script>
