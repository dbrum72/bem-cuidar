import { createResource } from '@/services/resource.js';
import { mapMutations } from 'vuex';

const userAPI = createResource('user');

export default {
    methods: {
        ...mapMutations('user', ['setUsers', 'setUser', 'addUser']),

        async getUsers() {
            const res = await userAPI.list();
            if (res?.data) this.setUsers(res.data.users);
        },

        async getUser(id) {
            const res = await userAPI.get(id);
            if (res?.data) this.setUser(res.data.user);
        },

        async saveUser(payload) {
            const res = await userAPI.saveOrUpdate(payload);
            if (res?.data) {
                this.addUser(res.data.user);
                this.$router.push({ name: 'UserList' });
            }
        },

        async deleteUser(id) {
            const confirmDelete = confirm('Tem certeza que deseja excluir este usuário?');
            if (!confirmDelete) return;

            await userAPI.remove(id);
            this.$toast?.success('Usuário excluído com sucesso.');
            this.getUsers();
        },
    }
};
