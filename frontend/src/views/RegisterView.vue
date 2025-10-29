<template>
    <form @submit.prevent="registerUser">
        <h2>Registrar</h2>
        <input type="text" v-model="name" placeholder="Nome" required />
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Senha" required />
        <button type="submit">Registrar</button>
    </form>
</template>

<script>
export default {

    data() {
        return {
            name: '',
            email: '',
            password: ''
        };
    },

    methods: {
        async registerUser() {
            try {
                await this.$store.dispatch('auth/register', {
                    name: this.name, email:
                    this.email, password:
                    this.password
                });
                this.$router.push('/');
            } catch (e) {
                alert('Erro no registro');
            }
        }
    }
}
</script>
