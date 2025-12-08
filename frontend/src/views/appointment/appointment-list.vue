<template>
    <HeaderBar />

    <div class="d-flex justify-content-between align-items-center px-3 mt-3">
        <h2>Agendamentos</h2>

        <router-link :to="{ name: 'AppointmentSave' }" class="btn btn-primary btn-sm">
            Adicionar
        </router-link>
    </div>

    <div class="container mt-3">
        <div v-if="appointments.length === 0" class="alert alert-info">
            Nenhum evento agendado.
        </div>

        <div v-else class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th>Título</th>
                        <th>Dependente</th>                        
                        <th>Início</th>
                        <th>Término</th>
                        <th>Local</th>
                        <th>Despesas</th>
                        <th class="text-end">Ações</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in appointments" :key="item.id">
                        <td>{{ getDependentName(item.dependent_id) }}</td>
                        <td>{{ item.title }}</td>
                        <td>{{ item.start_datetime }}</td>
                        <td>{{ item.end_datetime }}</td>
                        <td>{{ item.location }}</td>
                        <td>{{ item.total_expense }}</td>

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
    </div>
</template>


<script>
import { mapState } from "vuex";
import HeaderBar from "@/components/bars/header-bar.vue";

export default {

    name: "AppointmentFetch",

    components: { HeaderBar },

    computed: {
        ...mapState('dependent', ['dependents']),
        ...mapState('appointment', ['appointments']),
    },

    methods: {
        getDependentName(dependent_id) {
            const c = this.dependents.find(ch => ch.id === dependent_id);
            return c ? c.name : '';
        }
    },

    mounted() {
        this.getAppointments();
        this.getDependents();
    }
}
</script>
