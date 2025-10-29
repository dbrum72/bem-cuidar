<template>
    <form @submit.prevent="loginUser">
        <h2>Login</h2>
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Senha" required />
        <button type="submit">Login</button>
    </form>
</template>

<script>
export default {

    data() {
        return {
            email: 'dbrum72@gmail.com',
            password: 'password'
        };
    },

    methods: {
        async loginUser() {
            try {
                await this.$store.dispatch('auth/login', {
                    email: this.email,
                    password: this.password
                });
                this.$router.push('/');
            } catch (e) { alert('Erro no login'); }
        }
    }
}
</script>
