<template>
    <HeaderBar />
    <div class="container mt-4">
        <h2>Evento de Cuidado Compartilhado</h2>

        <div class="col-sm-12 col-lg-8 mb-2">
            <h6>{{ isEditing ? `Editando... (Id. ${form.id})` : 'Novo registro...' }}</h6>
        </div>

        <form @submit.prevent="save">

            <label class="form-label">Criança:</label>
            <select v-model="form.dependent_id" class="form-select" required>
                <option value="" selected>Selecione...</option>
                <option v-for="dependent in dependents" :key="dependent.id" :value="dependent.id">{{ dependent.name }}
                </option>
            </select>

            <label class="form-label">Título:</label>
            <input type="text" v-model="form.title" class="form-control" placeholder="Título" required />

            <label class="form-label">Descrição:</label>
            <textarea v-model="form.description" class="form-control" placeholder="Descrição"></textarea>

            <label class="form-label">Início:</label>
            <input type="datetime-local" v-model="form.start_datetime" class="form-control" required />

            <label class="form-label">Fim:</label>
            <input type="datetime-local" v-model="form.end_datetime" class="form-control" required />

            <label class="form-label">Local:</label>
            <input type="text" v-model="form.location" class="form-control" placeholder="Local" />

            <label class="form-label">Despesa:</label>
            <input type="text" v-model="form.total_expense" class="form-control" placeholder="R$ 0,00" />

            <h3>Participantes</h3>
            <div v-for="(p, index) in participants" :key="index" class="participant-row">
                <select v-model="p.user_id" class="form-select" required>
                    <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
                </select>
                <input type="number" v-model.number="p.share_percentage" placeholder="Porcentagem (%)" min="0"
                    max="100" />
                <button type="button" @click="removeParticipant(index)">Remover</button>
            </div>
            <button type="button" class="btn btn-outline-success me-3" @click="addParticipant">Adicionar
                Participante</button>
            <button type="button" class="btn btn-secondary me-3" @click="cancelSave">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar</button>
        </form>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import AppointmentMixin from '@/mixins/AppointmentMixin';
import DependentMixin from '@/mixins/DependentMixin';
import HeaderBar from "@/components/bars/header-bar.vue"

export default {
    name: "AppointmentSave",

    components: { HeaderBar },

    mixins: [AppointmentMixin, DependentMixin],

    data() {
        return {
            form: {},
            participants: [],
            isEditing: false
        };
    },

    computed: {
        ...mapState('appointment', ['appointment']),
        ...mapState('dependent', ['dependents']),
        ...mapState('auth', ['users'])
    },

    methods: {

        async save() {

            if (this.isEditing) {
                await this.updateAppointment(this.form)
            } else {
                await this.storeAppointment(this.form)
            }
        },

        cancelSave() {
            this.$router.push({ name: 'AppointmentList' })
        }
    },

    async mounted() {
        const id = this.$route.params.id;
        if (id) {
            this.isEditing = true
            await this.getAppointment(id)
            this.form = { ...this.$store.state.appointment.appointment }
        }
        await this.getDependents()
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
