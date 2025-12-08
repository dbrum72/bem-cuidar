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
                <tr v-for="item in appointments" :key="item.id">
                    <td>{{ getDependentName(item.dependent_id) }}</td>
                    <td>{{ item.title }}</td>
                    <td>{{ item.start_datetime }}</td>
                    <td>{{ item.end_datetime }}</td>
                    <td>{{ item.location }}</td>
                    <td>{{ item.total_expense }}</td>
                    <td>
                        <router-link :to="{ name: 'AppointmentShow', params: { id: item.id } }">
                            Visualizar
                        </router-link>
                        <router-link :to="{ name: 'AppointmentSave', params: { id: item.id } }">
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
