<template>
    <form @submit.prevent="saveAppointment">
        <h2>Evento de Cuidado Compartilhado</h2>

        <div class="col-sm-12 col-lg-8 mb-2">
            <h6>{{ isEditing ? `Editando... (Id. ${form.id})` : 'Novo registro...' }}</h6>
        </div>

        <label>Criança:</label>
        <select v-model="form.child_id" required>
            <option v-for="child in children" :key="child.id" :value="child.id">{{ child.name }}</option>
        </select>

        <label>Título:</label>
        <input type="text" v-model="form.title" placeholder="Título" required />

        <label>Descrição:</label>
        <textarea v-model="form.description" placeholder="Descrição"></textarea>

        <label>Início:</label>
        <input type="datetime-local" v-model="form.start_datetime" required />

        <label>Fim:</label>
        <input type="datetime-local" v-model="form.end_datetime" required />

        <label>Local:</label>
        <input type="text" v-model="form.location" placeholder="Local" />

        <label>Despesa:</label>
        <input type="text" v-model="form.total_expense" class="form-control"
            placeholder="R$ 0,00" />

        <h3>Participantes</h3>
        <div v-for="(p, index) in participants" :key="index" class="participant-row">
            <select v-model="p.user_id">
                <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
            <input type="number" v-model.number="p.share_percentage" placeholder="Porcentagem (%)" min="0" max="100" />
            <button type="button" @click="removeParticipant(index)">Remover</button>
        </div>
        <button type="button" @click="addParticipant">Adicionar Participante</button>

        <button type="submit">Salvar Appointment</button>
    </form>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            form: {},
            participants: [],
            isEditing: false
        };
    },

    computed: {
        ...mapState('appointments', ['appointment']),
        ...mapState('children', ['children']),
        ...mapState('auth', ['users'])
    },
    
    methods: {
        addParticipant() {
            this.participants.push({ user_id: '', share_percentage: 0 });
        },

        removeParticipant(index) {
            this.participants.splice(index, 1);
        },

        async saveAppointment() {
            
            if (!this.form.child_id || !this.form.title || !this.form.start_datetime || !this.form.end_datetime) {
                alert('Preencha todos os campos obrigatórios!');
                return;
            }

            try {
                await this.$store.dispatch('appointments/saveAppointment', {
                    ...this.form,
                    participants: this.participants
                });

                this.$store.commit(
                    'alerts/pushAlert',
                    {
                        type: 'success',
                        message: "Evento salvo com sucesso."
                    },
                    { root: true }
                );

                this.$router.push({ name: 'AppointmentList' });

                // Reset do formulário
                this.resetForm();
            } catch (error) {
                this.$store.commit(
                    'alerts/pushAlert',
                    {
                        type: 'error',
                        message: error.response?.data?.msg || "Erro ao salvar evento."
                    },
                    { root: true }
                );
            }
        },

        resetForm() {
            this.form = {};
            this.participants = [];
            this.formattedExpense = 'R$ 0,00';
        }
    },

    watch: {
        '$route.params.id': {
            immediate: true,
            async handler(newId) {
                if (newId) {
                    this.isEditing = true;
                    await this.$store.dispatch('appointments/getAppointment', newId);
                    this.form = { ...this.appointment } || {};
                    this.participants = this.appointment.participants ? [...this.appointment.participants] : [];
                } else {
                    this.isEditing = false;
                    this.resetForm();
                }
            }
        }
    },

    mounted() {
        this.$store.dispatch('children/fetchChildren');
        // Carregar usuários se necessário
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
