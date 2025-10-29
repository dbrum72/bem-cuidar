<template>
    <form @submit.prsharedCare="saveSharedCare">
        <h2>Criar SharedCareo de Cuidado Compartilhado</h2>

        <label>Criança:</label>
        <select v-model="sharedCare.child_id" required>
            <option v-for="child in children" :key="child.id" :value="child.id">{{ child.name }}</option>
        </select>

        <label>Título:</label>
        <input type="text" v-model="sharedCare.title" placeholder="Título" required />

        <label>Descrição:</label>
        <textarea v-model="sharedCare.description" placeholder="Descrição"></textarea>

        <label>Início:</label>
        <input type="datetime-local" v-model="sharedCare.start_datetime" required />

        <label>Fim:</label>
        <input type="datetime-local" v-model="sharedCare.end_datetime" required />

        <label>Local:</label>
        <input type="text" v-model="sharedCare.location" placeholder="Local do cuidado" />

        <label>Valor total:</label>
        <input type="number" v-model.number="sharedCare.total_cost" placeholder="Valor total" required />

        <h3>Participantes</h3>
        <div v-for="(p, index) in participants" :key="index" class="participant-row">
            <select v-model="p.user_id">
                <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
            <input type="number" v-model.number="p.share_percentage" placeholder="Porcentagem (%)" min="0" max="100" />
            <button type="button" @click="removeParticipant(index)">Remover</button>
        </div>
        <button type="button" @click="addParticipant">Adicionar Participante</button>

        <button type="submit">Salvar SharedCareo</button>
    </form>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            sharedCare: {},
            participants: []
        };
    },
    computed: {
        ...mapState('children', ['children']),
        ...mapState('auth', ['users']) // assumindo que você carregou todos usuários no auth ou outro módulo
    },
    methods: {
        addParticipant() {
            this.participants.push({ user_id: '', share_percentage: 0 });
        },
        removeParticipant(index) {
            this.participants.splice(index, 1);
        },
        async saveSharedCare() {
            if (!this.sharedCare.child_id || !this.sharedCare.title || !this.sharedCare.start_datetime || !this.sharedCare.end_datetime) {
                alert('Preencha todos os campos obrigatórios!');
                return;
            }

            // dispatch para Vuex
            try {
                await this.$store.dispatch('sharedCare/createSharedCare', {
                    ...this.sharedCare,
                    participants: this.participants
                });
                commit(
                    'alerts/pushAlert',
                    {
                        type: 'success',
                        message: error.response?.data?.msg || "Evento criado com sucesso."
                    },
                    { root: true }
                );
                // reset do formulário
                this.sharedCare = { child_id: '', title: '', description: '', start_datetime: '', end_datetime: '', location: '', total_cost: 0 };
                this.participants = [];
            } catch (error) {
                commit(
                    'alerts/pushAlert',
                    {
                        type: 'error',
                        message: error.response?.data?.msg || "Erro ao criar evento."
                    },
                    { root: true }
                );
            }
        }
    },
    created() {
        // carregar crianças
        this.$store.dispatch('children/fetchChildren');
        // carregar usuários participantes, caso não tenha no auth
        // this.$store.dispatch('users/fetchUsers');
    }
};
</script>

<style scoped>
.participant-row {
    display: flex;
    gap: 10px;
    margin-bottom: 5px;
}
</style>
