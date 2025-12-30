<template>
    <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Usuários</h2>
        <button @click="$router.push({ name: 'Register' })" class="btn btn-primary mb-4">Novo Usuário</button>

        <table class="table-auto w-full border">
            <thead>
                <tr class="bg-gray-100">
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Função</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="u in users" :key="u.id">
                    <td>{{ u.name }}</td>
                    <td>{{ u.email }}</td>
                    <td>{{ u.role || '-' }}</td>
                    <td>
                        <button @click="$router.push({ name: 'UserShow', params: { id: u.id } })"
                            class="btn btn-sm">Ver</button>
                        <button @click="$router.push({ name: 'UserSave', params: { id: u.id } })"
                            class="btn btn-sm">Editar</button>
                        <button @click="deleteUser(u.id)" class="btn btn-sm btn-danger">Excluir</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import UserMixin from '@/mixins/UserMixin';

export default {    
    name: 'UserList',

    mixins: [UserMixin],

    computed: {
        users() {
            return this.$store.state.user.users;
        },
    },
    
    mounted() {
        this.getUsers();
    },
};
</script>
