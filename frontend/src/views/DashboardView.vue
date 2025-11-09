<template>
    <div>
        <HeaderBar />

        <h1>Dashboard</h1>

        <section>
            <h2>Dependentes</h2>
            <div v-if="dependents.length === 0">Nenhum dependente cadastrado.</div>
            <div v-for="dependent in dependents" :key="dependent.id" class="card">
                <p><strong>{{ dependent.name }}</strong></p>
                <p>Data de nascimento: {{ dependent.birth_date }}</p>
                <p v-if="dependent.notes">Notas: {{ dependent.notes }}</p>
            </div>
        </section>

        <section>
            <h2>Eventos de Cuidado Compartilhado</h2>
            <div v-if="appointments.length === 0">Nenhum evento</div>
            <div v-for="e in appointments" :key="e.id" class="card">
                <p><strong>{{ e.title }}</strong></p>
                <p>Criança: {{ getDependentName(e.dependent_id) }}</p>
                <p>Início: {{ e.start_datetime }}</p>
                <p>Fim: {{ e.end_datetime }}</p>
                <p>Local: {{ e.location }}</p>
                <p>Total: {{ e.total_cost }}</p>
            </div>
        </section>
        <!--
        <section>
            <h2>Transações</h2>
            <div v-if="transactions.length === 0">Nenhuma transação</div>
            <div v-for="t in transactions" :key="t.id" class="card">
                <p>Participante: {{ t.participant.user.name }}</p>
                <p>Evento: {{ t.participant.appointmentEvent.title }}</p>
                <p>Valor: {{ t.amount }}</p>
                <p>Status: {{ t.status }}</p>
                <p v-if="t.receipt"><a :href="t.receipt_url" target="_blank">Visualizar comprovante</a></p>
            </div>
        </section>
        
        <section>
            <NotificationList />
        </section>
        -->
    </div>
</template>

<script>
import { mapState } from "vuex"
import AppointmentMixin from '@/mixins/AppointmentMixin'
import DependentMixin from '@/mixins/DependentMixin'
//import NotificationList from './NotificationList.vue';
import HeaderBar from "@/components/bars/header-bar.vue";

export default {
    name: "DashboardView",

    components: { HeaderBar },

    mixins: [ AppointmentMixin, DependentMixin],

    computed: {
        ...mapState('dependent', ['dependents']),
        ...mapState('appointment', ['appointments']),
        //...mapState('transactions', ['transactions'])
    },

    methods: {
        getDependentName(dependent_id) {
            const c = this.dependents.find(ch => ch.id === dependent_id);
            return c ? c.name : '';
        }
    },

    mounted() {
        this.getDependents();
        this.getAppointments();
        //this.$store.dispatch('transactions/fetchTransactions');
        //this.$store.dispatch('notifications/fetchNotifications');
    }
}
</script>

<style scoped>
.card {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 6px;
}

img {
    max-width: 100px;
    max-height: 100px;
    margin-bottom: 5px;
}

section {
    margin-bottom: 20px;
}
</style>
