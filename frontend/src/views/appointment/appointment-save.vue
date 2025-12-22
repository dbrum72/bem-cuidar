<template>
        <h2>Evento de Cuidado Compartilhado</h2>

        <div class="col-sm-12 col-lg-8 mb-2">
            <h6>{{ isEditing ? `Editando... (Id. ${form.id})` : 'Novo registro...' }}</h6>
        </div>

        <form @submit.prevent="handleSubmit">
            <div class="row">
                <div class="col mb-3">
                    <label class="form-label">Título:</label>
                    <input type="text" v-model="form.title" class="form-control" placeholder="Título" required />
                </div>
            </div>

            <div class="row">
                <div class="col mb-3">
                    <label class="form-label">Dependente:</label>
                    <select v-model="form.dependent_id" class="form-select" required>
                        <option value="">Selecione...</option>
                        <option v-for="dependent in dependents" :key="dependent.id" :value="dependent.id">
                            {{ dependent.name }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-12 col-lg-6 mb-3">
                    <label class="form-label">Início:</label>
                    <input type="datetime-local" v-model="form.start_datetime" class="form-control" required />
                </div>
                <div class="col-sm-12 col-lg-6 mb-3">
                    <label class="form-label">Fim:</label>
                    <input type="datetime-local" v-model="form.end_datetime" class="form-control" required />
                </div>
            </div>

            <div class="row">
                <div class="col-sm-12 col-lg-6 mb-3">
                    <label class="form-label">Local:</label>
                    <input type="text" v-model="form.location" class="form-control" placeholder="Local" />
                </div>
                <div class="col-sm-12 col-lg-6 mb-3">
                    <label class="form-label">Despesa:</label>
                    <input type="text" v-model="form.total_expense" class="form-control" placeholder="R$ 0,00" />
                </div>
            </div>

            <div class="row">
                <div class="col mb-3">
                    <label class="form-label">Descrição:</label>
                    <textarea v-model="form.description" class="form-control" placeholder="Descrição"></textarea>
                </div>
            </div>

            <div v-if="form.dependent_id">
                <h6>Participantes:</h6>

                <ParticipantRow v-for="(p, i) in participants" :key="i" v-model="participants[i]"
                    :tutors="tutorsByDependent" :existing="participants.map(x => x.tutor_id)"
                    @remove="removeParticipant(i)" />

                <div class="row">
                    <div class="col mb-3">
                        <button type="button" class="btn btn-outline-success" @click="addParticipant">
                            Adicionar Participante
                        </button>

                        <small v-if="totalPercentage !== 100 && participants.length > 0" class="text-danger">
                            A soma deve ser 100% (atual: {{ totalPercentage }}%)
                        </small>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col mb-3">
                    <button type="button" class="btn btn-secondary me-3" @click="cancelSave">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </div>
        </form>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ParticipantRow from "@/components/selects/ParticipantRow.vue"

export default {
    name: "AppointmentSave",

    components: { ParticipantRow },

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
        ...mapState('relationship', ['tutorsByDependent']),

        totalPercentage() {
            return this.participants.reduce((sum, p) => sum + (p.share_percentage || 0), 0);
        }
    },

    watch: {
        "form.dependent_id": {
            immediate: false,
            async handler(newVal) {
                if (newVal) {
                    await this.getTutors(newVal);

                    // popula automaticamente os participantes
                    this.participants = this.tutorsByDependent.map(t => ({
                        tutor_id: t.id,
                        share_percentage: Math.floor(100 / this.tutorsByDependent.length)
                    }));
                    //this.participants = [];

                    this.normalizePercentages();
                } else {
                    this.participants = [];
                }
            }
        }
    },

    methods: {

        ...mapActions('appointment', ['addOrUpdate', 'getAppointment']),
        ...mapActions('dependent', ['getDependents']),
        ...mapActions('relationship', ['getTutorsByDependent']),

        async handleSubmit() {
            this.isSaving = true;

            if (this.totalPercentage !== 100) {
                alert("A soma das porcentagens precisa ser 100%");
                return;
            }

            this.form.participants = this.participants.map(p => ({
                participant_id: p.tutor_id,
                share_percentage: p.share_percentage,
                payment_status: p.payment_status || "pendente",
                aceito_status: p.aceito_status || "pendente"
            }));

            try {
                await this.addOrUpdate(this.form);
                //this.$toast?.success("Evento salvo com sucesso!");
                this.$router.push({ name: "AppointmentList" });
            }
            catch (error) {
                console.error("Erro ao salvar evento:", error);
                //this.$toast?.error("Erro ao salvar evento.");
            }
            finally {
                this.isSaving = false;
            }
        },

        cancelSave() {
            this.$router.push({ name: 'AppointmentList' })
        },

        normalizePercentages() {
            if (!this.participants.length) return;

            const equal = Math.floor(100 / this.participants.length);
            this.participants.forEach(p => (p.share_percentage = equal));
        },

        addParticipant() {
            this.participants.push({
                tutor_id: "",
                share_percentage: 0
            });
        },

        removeParticipant(index) {
            this.participants.splice(index, 1);
            this.normalizePercentages();
        },

        async getTutors(dependent_id) {
            if (!dependent_id) return;
            await this.getTutorsByDependent(dependent_id);
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