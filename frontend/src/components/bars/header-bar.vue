<template>
    <div>
        <nav>
            <router-link to="/dashboard">Dashboard</router-link> |
            <router-link to="/child">Crianças</router-link> |
            <router-link to="/appointment">Agendamentos</router-link> |
            <router-link to="/transactions">Transações</router-link> |
            <button @click="logout">Logout</button>
        </nav>
    </div>
</template>
<script>
export default {
    name: 'HeaderBar',

    methods: {
        logout() {
            this.$store.dispatch('auth/logout');
            this.$router.push('/login');
        }
    }
}
</script>