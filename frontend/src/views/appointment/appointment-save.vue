<template>
    <HeaderBar />

    <form @submit.prevent="save">
        <h2>Evento de Cuidado Compartilhado</h2>

        <div class="col-sm-12 col-lg-8 mb-2">
            <h6>{{ isEditing ? `Editando... (Id. ${form.id})` : 'Novo registro...' }}</h6>
        </div>

        <label>Criança:</label>
        <select v-model="form.dependent_id" required>
            <option value="" selected>Selecione...</option>
            <option v-for="dependent in dependents" :key="dependent.id" :value="dependent.id">{{ dependent.name }}</option>
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
        <button type="button" @click="cancelSave">Cancelar</button>
        <button type="submit">Salvar</button>
    </form>
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
