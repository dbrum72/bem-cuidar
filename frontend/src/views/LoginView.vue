<template>
    <form @submit.prevent="performLogin">
        <h2>Login</h2>
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Senha" required />
        <button type="submit">Login</button>
    </form>
</template>

<script>
import AuthMixin from '@/mixins/AuthMixin'

export default {

    name: 'LoginView',

    mixins: [AuthMixin],

    data() {
        return {
            email: 'dbrum72@gmail.com',
            password: 'password'
        };
    },

    methods: {

        async performLogin() {
            await this.login({
                email: this.email,
                password: this.password
            });
        }
    }
}
</script>
