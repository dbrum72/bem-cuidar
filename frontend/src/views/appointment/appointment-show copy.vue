<template>
    <HeaderBar />

    <div class="container-fluid py-4">

        <!-- Título + Breadcrumb -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <div>
                <h3 class="fw-bold mb-1">Agendamento</h3>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb small m-0">
                        <li class="breadcrumb-item">
                            <router-link :to="{ name: 'AppointmentList' }">Agendamentos</router-link>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">
                            Detalhes
                        </li>
                    </ol>
                </nav>
            </div>

            <router-link
                class="btn btn-primary d-flex align-items-center gap-2 mt-3 mt-md-0"
                :to="{ name: 'AppointmentList' }"
            >
                <i class="fa-solid fa-arrow-left"></i>
                Voltar
            </router-link>
        </div>

        <div v-if="appointment">

            <!-- Cards de métricas rápidas -->
            <div class="row g-3 mb-4">
                <div class="col-sm-6 col-lg-4">
                    <div class="card metric-card shadow-sm border-0 h-100">
                        <div class="card-body d-flex justify-content-between">
                            <div>
                                <p class="text-uppercase small text-muted fw-semibold mb-1">ID</p>
                                <h4 class="fw-bold">{{ appointment.id }}</h4>
                            </div>
                            <i class="fa-solid fa-hashtag metric-icon"></i>
                        </div>
                    </div>
                </div>

                <div class="col-sm-6 col-lg-4">
                    <div class="card metric-card shadow-sm border-0 h-100">
                        <div class="card-body d-flex justify-content-between">
                            <div>
                                <p class="text-uppercase small text-muted fw-semibold mb-1">Criado em</p>
                                <h6 class="fw-medium">{{ appointment.created_at }}</h6>
                            </div>
                            <i class="fa-solid fa-calendar-plus metric-icon"></i>
                        </div>
                    </div>
                </div>

                <div class="col-sm-6 col-lg-4">
                    <div class="card metric-card shadow-sm border-0 h-100">
                        <div class="card-body d-flex justify-content-between">
                            <div>
                                <p class="text-uppercase small text-muted fw-semibold mb-1">Atualizado em</p>
                                <h6 class="fw-medium">{{ appointment.updated_at_formatted }}</h6>
                            </div>
                            <i class="fa-solid fa-calendar-check metric-icon"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Card principal -->
            <div class="card shadow-sm border-0 rounded-3 mb-4">
                <div class="card-header bg-white py-3">
                    <h5 class="fw-semibold m-0 d-flex align-items-center gap-2">
                        <i class="fa-solid fa-circle-info text-primary"></i>
                        Informações do Agendamento
                    </h5>
                </div>

                <div class="card-body p-4">

                    <div class="row g-4">
                        <div v-for="field in fieldGroups" :key="field.key" class="col-12 col-md-6">
                            <div class="d-flex align-items-start gap-3 p-3 bg-light rounded-3 hover-card">
                                <i :class="field.icon + ' text-primary fs-4'"></i>

                                <div>
                                    <p class="small text-muted text-uppercase fw-semibold mb-1">{{ field.label }}</p>
                                    <h6 class="fw-bold mb-0">{{ field.value }}</h6>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>

        <div v-else class="alert alert-warning mt-4">
            Nenhum dado encontrado.
        </div>
    </div>
</template>


<script>
import { mapActions, mapState } from "vuex"
import AbstractMixin from '@/mixins/AbstractMixin'
import HeaderBar from '@/components/bars/header-bar.vue'


export default {

    name: 'AppointmentShow',

    components: { HeaderBar },

    mixins: [AbstractMixin],

    computed: {
        ...mapState('appointment', ['appointment']),
        ...mapState('dependent', ['dependent']),
        ...mapState(['errors', 'loader']),

        id() {
            return this.$route.params.id
        },

        fields() {
            if (!this.appointment) return []

            return [
                { key: 'id', label: 'ID', value: this.appointment.id },
                { key: 'name', label: 'Dependente', value: this.appointment.dependent?.name },
                { key: 'title', label: 'Título', value: this.appointment.title },
                { key: 'start_datetime', label: 'Início', value: this.formatDateTime(this.appointment.start_datetime) },
                { key: 'end_datetime', label: 'Fim', value: this.formatDateTime(this.appointment.end_datetime) },
                { key: 'location', label: 'Local', value: this.appointment.location },
                { key: 'description', label: 'Descrição', value: this.appointment.description },
                { key: 'created_at', label: 'Criado em', value: this.formatDateTime(this.appointment.created_at) },
                { key: 'updated_at', label: 'Atualizado em', value: this.formatDateTime(this.appointment.updated_at) },
            ]
        },

        fieldGroups() {
            return [
                {
                    key: 'dependent',
                    label: 'Dependente',
                    icon: 'fa-solid fa-user',
                    value: this.appointment.dependent?.name
                },
                {
                    key: 'title',
                    label: 'Título',
                    icon: 'fa-solid fa-pen-to-square',
                    value: this.appointment.title
                },
                {
                    key: 'start',
                    label: 'Início',
                    icon: 'fa-solid fa-calendar-day',
                    value: this.appointment.start_formatted
                },
                {
                    key: 'end',
                    label: 'Fim',
                    icon: 'fa-solid fa-calendar-days',
                    value: this.appointment.end_formatted
                },
                {
                    key: 'location',
                    label: 'Local',
                    icon: 'fa-solid fa-location-dot',
                    value: this.appointment.location
                },
                {
                    key: 'description',
                    label: 'Descrição',
                    icon: 'fa-solid fa-align-left',
                    value: this.appointment.description
                },
            ];
        }
    },

    methods: {
        ...mapActions('appointment', ['getAppointment']),

        isLast(field) {
            const last = this.fields[this.fields.length - 1];
            return last.key === field.key;
        }
    },

    created() {
        this.getAppointment(this.id)
    }
}
</script>

<style>
.card-body div.row:hover {
    background: rgba(0, 0, 0, 0.02);
    transition: background 0.2s ease;
}

.metric-card {
    transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}

.metric-icon {
    font-size: 2rem;
    opacity: .2;
}

.hover-card {
    transition: background 0.2s ease, transform 0.15s ease;
}

.hover-card:hover {
    background: #e9f2ff;
    transform: translateY(-2px);
}
</style>