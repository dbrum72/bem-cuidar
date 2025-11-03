<template>
  <div>
    <h2>Registrar Pagamento</h2>

    <form @submit.prevent="saveTransaction">
      <label>Participante:</label>
      <select v-model="transaction.participant_id" required>
        <option v-for="p in participants" :key="p.id" :value="p.id">
          {{ p.user.name }} - {{ p.appointmentEvent.title }}
        </option>
      </select>

      <label>Valor:</label>
      <input type="number" v-model.number="transaction.amount" placeholder="Valor pago" required />

      <label>Comprovante:</label>
      <input type="file" @change="handleFileUpload" />

      <button type="submit">Registrar Pagamento</button>
    </form>

    <h3>Transações Registradas</h3>
    <div v-for="t in transactions" :key="t.id" class="transaction-card">
      <p><strong>{{ t.participant.user.name }}</strong> - {{ t.participant.appointmentEvent.title }}</p>
      <p>Valor: {{ t.amount }}</p>
      <p>Status: {{ t.status }}</p>
      <p v-if="t.receipt">
        Comprovante: <a :href="t.receipt_url" target="_blank">Visualizar</a>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      transaction: {
        participant_id: '',
        amount: 0
      },
      receiptFile: null
    };
  },
  computed: {
    ...mapState('transactions', ['transactions']),
    ...mapState('appointment', ['events']),
    participants() {
      // retornar todos participantes de todos eventos
      return this.events.flatMap(e => e.participants || []);
    }
  },
  methods: {
    handleFileUpload(e) {
      this.receiptFile = e.target.files[0];
    },
    async saveTransaction() {
      if (!this.transaction.participant_id || !this.transaction.amount) {
        alert('Preencha todos os campos obrigatórios!');
        return;
      }

      try {
        await this.$store.dispatch('transactions/createTransaction', {
          ...this.transaction,
          receipt: this.receiptFile
        });
        alert('Pagamento registrado com sucesso!');

        // resetar formulário
        this.transaction = { participant_id:'', amount:0 };
        this.receiptFile = null;

        // atualizar lista de transações
        this.$store.dispatch('transactions/fetchTransactions');
      } catch (error) {
        console.error(error);
        alert('Erro ao registrar pagamento.');
      }
    }
  },
  created() {
    // carregar eventos e transações
    this.$store.dispatch('appointment/fetchEvents');
    this.$store.dispatch('transactions/fetchTransactions');
  }
};
</script>

<style scoped>
.transaction-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
}
</style>
