<template>
    <h2>Appointmentos de Cuidado Compartilhado</h2>
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
                            <td>{{ getChildName(e.child_id) }}</td>
                            <td>{{ e.title }}</td>                            
                            <td>{{ e.start_datetime }}</td>
                            <td>{{ e.end_datetime }}</td>
                            <td>{{ e.location }}</td>
                            <td>{{ e.total_expense }}</td>
                            <td>
                                <router-link
                                    :to="{ name: 'AppointmentSave', params: { id: e.id } }">
                                    Editar
                                </router-link>
                            </td>
                        </tr>
                        </tbody>
                </table>

    </div>
</template>

<script>
import { mapState } from "vuex"
//import AppointmentMixin from '@/mixins/AppointmentMixin.js';

export default {

    name: "AppointmentFetch",

    //mixins: [AppointmentMixin],

    computed: {
        ...mapState('children', ['children']),
        ...mapState('appointments', ['appointments']),
    },

    mounted() {
        this.$store.dispatch('children/fetchChildren');
        this.$store.dispatch('appointments/fetchAppointments');
    },

    methods: {
        getChildName(child_id) {
            const c = this.children.find(ch => ch.id === child_id);
            return c ? c.name : '';
        }
    },
}
</script>
