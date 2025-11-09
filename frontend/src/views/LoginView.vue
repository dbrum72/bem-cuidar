<template>
    <form @submit.prevent="performLogin">
        <h2>Login</h2>
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Senha" required />
        <button type="submit">Login</button>
    </form>
</template>

<script>
import LoginMixin from '@/mixins/LoginMixin';

export default {

    name: 'LoginView',

    mixins: [LoginMixin],

    data() {
        return {
            email: 'dbrum72@gmail.com',
            password: 'password'
        };
    },

    methods: {

        performLogin() {
            this.login({
                email: this.email,
                password: this.password
            });
        }
    }
}
</script>
