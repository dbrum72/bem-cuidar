<template>
    <HeaderBar />

    <div class="d-flex justify-content-between px-3">
        <h2>Agendamentos</h2>
        <router-link :to="{ name: 'AppointmentSave' }">Adicionar</router-link>
    </div>
    <div v-if="appointments.length === 0">Nenhum evento agendado.</div>
    <div v-else>
        <table>
            <thead>
                <tr>
                    <th>Criança</th>
                    <th>Título</th>
                    <th>Início</th>
                    <th>Término</th>
                    <th>Local</th>
                    <th>Despesas</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="e in appointments" :key="e.id">
                    <td>{{ getDependentName(e.dependent_id) }}</td>
                    <td>{{ e.title }}</td>
                    <td>{{ e.start_datetime }}</td>
                    <td>{{ e.end_datetime }}</td>
                    <td>{{ e.location }}</td>
                    <td>{{ e.total_expense }}</td>
                    <td>
                        <router-link :to="{ name: 'AppointmentSave', params: { id: e.id } }">
                            Editar
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>

<script>
import { mapState } from "vuex";
import AppointmentMixin from '@/mixins/AppointmentMixin';
import DependentMixin from '@/mixins/DependentMixin';
import HeaderBar from "@/components/bars/header-bar.vue";

export default {

    name: "AppointmentFetch",

    components: { HeaderBar },

    mixins: [AppointmentMixin, DependentMixin],

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
