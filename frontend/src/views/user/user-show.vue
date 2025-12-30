<template>
    <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Detalhes do Usuário</h2>

        <p><strong>Nome:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Função:</strong> {{ user.role || '-' }}</p>

        <button @click="$router.push({ name: 'UserList' })" class="btn mt-3">Voltar</button>
    </div>
</template>

<script>
import UserMixin from '@/mixins/UserMixin';

export default {
    name: 'UserShow',

    mixins: [UserMixin],

    computed: {
        user() {
            return this.$store.state.user.user;
        },
    },

    mounted() {
        this.getUser(this.$route.params.id);
    },
};
</script>
