<template>

    <!-- Header + breadcrumb -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
            <h3 class="fw-bold mb-1">Agendamento</h3>
            <ol class="breadcrumb small m-0">
                <li class="breadcrumb-item">
                    <router-link :to="{ name: 'AppointmentList' }">Agendamentos</router-link>
                </li>
                <li class="breadcrumb-item active">Detalhes</li>
            </ol>
        </div>

        <router-link class="btn btn-primary d-flex align-items-center gap-2 mt-3 mt-md-0"
            :to="{ name: 'AppointmentList' }">
            <i class="fa-solid fa-arrow-left"></i>
            Voltar
        </router-link>
    </div>

    <div v-if="appointment">
        <!-- Métricas no topo -->
        <div class="row g-3 mb-4">
            <div class="col-sm-6 col-lg-4">
                <MetricCard title="Dependente" :value="appointment.dependent?.name || '---'" icon="fa-solid fa-user" />
            </div>

            <div class="col-sm-6 col-lg-4">
                <MetricCard title="INÍCIO" :value="formatDateTime(appointment.start_datetime)"
                    icon="fa-solid fa-calendar-plus" />
            </div>

            <div class="col-sm-6 col-lg-4">
                <MetricCard title="FIM" :value="formatDateTime(appointment.end_datetime)"
                    icon="fa-solid fa-calendar-check" />
            </div>
        </div>

        <!-- Card com Tabs -->
        <div class="card shadow-sm border-0 rounded-3">

            <!-- Tabs -->
            <ul class="nav nav-tabs px-3 pt-3" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link" :class="{ active: activeTab === 'geral' }" @click="activeTab = 'geral'"
                        type="button" role="tab">
                        <i class="fa-solid fa-circle-info me-1"></i> Geral
                    </button>
                </li>

                <li class="nav-item" role="presentation">
                    <button class="nav-link" :class="{ active: activeTab === 'participantes' }"
                        @click="activeTab = 'participantes'" type="button" role="tab">
                        <i class="fa-solid fa-users me-1"></i> Participantes
                    </button>
                </li>

                <li class="nav-item" role="presentation">
                    <button class="nav-link" :class="{ active: activeTab === 'anexos' }" @click="activeTab = 'anexos'"
                        type="button" role="tab">
                        <i class="fa-solid fa-paperclip me-1"></i> Anexos
                    </button>
                </li>
            </ul>

            <div class="card-body p-4">

                <!-- TAB: Geral -->
                <div v-if="activeTab === 'geral'">
                    <div class="row g-4">
                        <div v-for="field in fieldGroups" :key="field.key" class="col-12 col-md-6">
                            <div class="d-flex align-items-start gap-3 p-3 bg-light rounded-3 hover-card">
                                <i :class="field.icon + ' text-primary fs-4'"></i>

                                <div>
                                    <p class="text-uppercase fw-bold mb-0">{{ field.label }}</p>
                                    <h6 class="middle text-muted fw-semibold mb-1">{{ field.value }}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB: Participantes -->
                <div v-if="activeTab === 'participantes'">

                    <h5 class="fw-semibold mb-3">Participantes</h5>

                    <div v-if="participants.length === 0" class="alert alert-secondary">
                        Nenhum participante cadastrado.
                    </div>

                    <table v-else class="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Percentual</th>
                                <th>Status Pagamento</th>
                                <th>Status Aceite</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in participants" :key="p.id">
                                <td>{{ p.name }}</td>
                                <td>{{ p.pivot.share_percentage || '---' }}%</td>
                                <td>
                                    <span class="badge" :class="statusClass(p.pivot.payment_status)">
                                        {{ p.pivot.payment_status || '---' }}</span>
                                </td>
                                <td>
                                    <span class="badge" :class="statusClass(p.pivot.aceito_status)">
                                        {{ p.pivot.aceito_status || '---' }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                <!-- TAB: Anexos -->
                <div v-if="activeTab === 'anexos'">
                    <h5 class="fw-semibold mb-3">Anexos</h5>

                    <p class="text-muted">
                        Área para upload, documentos e mídia do agendamento.
                    </p>

                    <div class="border rounded-3 p-4 text-center bg-light upload-area" @dragover.prevent
                        @drop.prevent="handleDrop" @click="triggerSelect">
                        <i class="fa-solid fa-cloud-arrow-up fs-1 text-primary"></i>
                        <p class="mt-3">Arraste arquivos aqui ou clique para enviar</p>

                        <input type="file" ref="fileInput" class="d-none" multiple @change="handleFileSelect" />
                    </div>
                </div>


            </div>
        </div>
    </div>

    <div v-else class="alert alert-warning mt-4">Nenhum dado encontrado.</div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import AbstractMixin from "@/mixins/AbstractMixin";
import MetricCard from '@/components/cards/MetricCard.vue';

export default {
    components: { MetricCard },

    mixins: [AbstractMixin],

    data() {
        return {
            files: [],
            activeTab: 'geral' // Tab ativa por padrão,
        };
    },

    computed: {
        ...mapState('appointment', ['appointment']),
        ...mapState('dependent', ['dependent']),
        ...mapState(['errors', 'loader']),

        id() {
            return this.$route.params.id
        },

        fieldGroups() {
            return [
                { key: 'id', label: 'ID', icon: 'fa-solid fa-hashtag', value: this.appointment.id },
                { key: 'title', label: 'Título', icon: 'fa-solid fa-pen-to-square', value: this.appointment.title },
                { key: 'location', label: 'Local', icon: 'fa-solid fa-location-dot', value: this.appointment.location },
                { key: 'description', label: 'Descrição', icon: 'fa-solid fa-align-left', value: this.appointment.description },
                { key: 'created_at', label: 'Criado em', icon: 'fa-solid fa-clock', value: this.formatDateTime(this.appointment.created_at) },
                { key: 'updated_at', label: 'Atualizado em', icon: 'fa-solid fa-clock-rotate-left', value: this.formatDateTime(this.appointment.updated_at) }
            ];
        },

        participants() {
            return this.appointment.participants ?? [];
        }
    },

    methods: {
        ...mapActions('appointment', ['getAppointment', 'uploadAppointmentFiles']),

        statusClass(status) {
            return {
                pendente: 'badge rounded-pill text-bg-warning',
                aceito: 'badge rounded-pill text-bg-success',
                recusado: 'badge rounded-pill text-bg-danger',
                pago: 'badge rounded-pill text-bg-primary',
            }[status] || 'badge rounded-pill text-bg-secondary';
        },

        triggerSelect() {
            this.$refs.fileInput.click();
        },

        handleFileSelect(event) {
            this.files = event.target.files;
            if (!this.files || this.files.length === 0) return;
            this.upload(this.files);
        },

        handleDrop(event) {
            this.files = event.dataTransfer.files;
            if (!this.files || this.files.length === 0) return;
            this.upload(this.files);
        },

        async upload(files) {

            try {
                this.loader = true;

                const formData = new FormData();

                Array.from(files).forEach(file => {
                    formData.append('attachments[]', file);
                });

                formData.append('appointment_id', this.id);

                await this.uploadAppointmentFiles(formData);

                await this.getAppointment(this.id);

                this.$toast.success("Arquivos enviados com sucesso.");
            } catch (error) {
                console.error(error);
                this.$toast.error("Falha ao enviar os arquivos.");
            } finally {
                this.loader = false;
                if (this.$refs.fileInput) {
                    this.$refs.fileInput.value = "";
                }
            }
        }

    },

    created() {
        this.getAppointment(this.id)
    }
};
</script>
