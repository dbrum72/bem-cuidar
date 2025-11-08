import { createResource } from '@/services/resource.js';
import { mapMutations } from 'vuex';

const appointmentsAPI = createResource('appointments');

export default {
  methods: {
    ...mapMutations('appointment', ['setAppointments', 'setAppointment', 'addAppointment']),

    async getAppointments(filter, extendedFilter, parameter, sort) {
      const call = () => appointmentsAPI.list({ filter, extendedFilter, relationship, sort });
      const response = await this._execRequest(call, {
        errorMsg: 'Erro ao carregar a lista de agendamentos.',
      });
      if (response?.data) this.setAppointments(response.data.appointments);
    },

    async getAppointment(id) {
      const call = () => appointmentsAPI.get(id);
      const response = await this._execRequest(call, {
        errorMsg: 'Erro ao carregar o agendamento.',
      });
      if (response?.data) this.setAppointment(response.data.appointment);
    },

    async storeAppointment(payload) {
      const call = () => appointmentsAPI.saveOrUpdate(payload);
      const response = await this._execRequest(call, {
        errorMsg: 'Erro ao salvar o agendamento.',
      });
      if (response?.data) {
        this.addAppointment(response.data.appointment);
        this.resetAppointmentView();
      }
    },

    async updateAppointment(payload) {
      const call = () => appointmentsAPI.saveOrUpdate(payload);
      const response = await this._execRequest(call, {
        errorMsg: 'Erro ao atualizar o agendamento.',
      });
      if (response?.data) {
        this.addAppointment(response.data.appointment);
        this.resetAppointmentView(response.data.appointment.id);
      }
    },

    async destroyAppointment(id) {
      const call = () => appointmentsAPI.remove(id);
      const response = await this._execRequest(call, {
        successMsg: 'Agendamento excluído com sucesso.',
        errorMsg: 'Erro ao excluir o agendamento.',
      });
      if (response) this.resetAppointmentView();
    },

    resetAppointmentView(id) {
      id
        ? this.$router.push({ name: 'AppointmentShow', params: { id } })
        : this.$router.push({ name: 'AppointmentList' });
    },

    async _execRequest(callFn, { successMsg = null, errorMsg = null, swallow = true } = {}) {
      if (typeof this.handleRequest === 'function') {
        try {
          return await this.handleRequest(callFn, successMsg, errorMsg, swallow);
        } catch {
          return null;
        }
      }
      try {
        const res = await callFn();
        if (successMsg && this.$toast) this.$toast.success(successMsg);
        return res;
      } catch (err) {
        if (errorMsg && this.$toast) this.$toast.error(errorMsg);
        console.error(errorMsg, err);
        return null;
      }
    },
  },
};
