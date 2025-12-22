<template> 

        <div class="d-flex justify-content-between align-items-center px-3 mt-3 mb-4">
            <h4>Agendamentos</h4>
            <router-link :to="{ name: 'AppointmentSave' }" class="btn btn-primary btn-sm">Adicionar</router-link>
        </div>

        <div v-if="appointments.length === 0" class="alert alert-info">
            Nenhum evento agendado.
        </div>

        <div v-else class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th>Início</th>
                        <th>Término</th>
                        <th>Título</th>
                        <th>Dependente</th>
                        <th>Participantes</th>
                        <th>Local</th>
                        <th>Despesas</th>
                        <th class="text-end">Ações</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in appointments" :key="item.id">
                        <td>{{ formatDateTime(item.start_datetime) }}</td>
                        <td>{{ formatDateTime(item.end_datetime) }}</td>
                        <td>{{ item.title }}</td>
                        <td>{{ item.dependent_name }}</td>
                        <td></td>
                        
                        <td>{{ item.location }}</td>
                        <td>R${{ item.total_expense }}</td>

                        <td class="text-end">
                            <router-link :to="{ name: 'AppointmentShow', params: { id: item.id } }"
                                class="btn btn-outline-secondary btn-sm me-2">
                                Visualizar
                            </router-link>

                            <router-link :to="{ name: 'AppointmentSave', params: { id: item.id } }"
                                class="btn btn-outline-primary btn-sm">
                                Editar
                            </router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
</template>


<script>
import { mapState, mapActions } from "vuex";
import AbstractMixin from "@/mixins/AbstractMixin";

export default {

    name: "AppointmentFetch",

    mixins: [AbstractMixin],

    computed: {
        ...mapState('appointment', ['appointments']),
    },

    methods: {
        ...mapActions("appointment", ["getAppointments"]),
    },

    mounted() {
        this.getAppointments();
    }
}
</script>
