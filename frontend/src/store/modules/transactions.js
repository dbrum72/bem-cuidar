import http from "@/services/http.js";

export default {
  namespaced:true,
  state:{ transactions:[] },
  mutations:{ setTransactions(state,t){ state.transactions=t; }, addTransaction(state,t){ state.transactions.push(t); } },
  actions:{
    async fetchTransactions({commit}){ const { data } = await http.get('transactions'); commit('setTransactions',data); },
    async createTransaction({commit},payload){
      const formData = new FormData();
      formData.append('participant_id',payload.participant_id);
      formData.append('amount',payload.amount);
      if(payload.receipt) formData.append('receipt',payload.receipt);
      const { data } = await http.post('transactions',formData,{ headers:{ 'Content-Type':'multipart/form-data' } });
      commit('addTransaction',data);
    }
  }
}
