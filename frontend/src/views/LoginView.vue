<template>
    <div class="container mt-4">
        <div class="card p-3">
            <h4 class="card-title text-center">Login</h4>
            <form @submit.prevent="performLogin">
                <div class="row">
                    <div class="col-12 mb-3">
                        <input type="email" v-model="email" class="input" placeholder="Email" required />
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 mb-3">
                        <input type="password" v-model="password" class="input" placeholder="Senha" required />
                    </div>
                </div>
                <button class="btn-secondary" type="submit">Login</button>
            </form>
        </div>
    </div>
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
