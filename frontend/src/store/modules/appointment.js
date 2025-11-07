import http from "@/services/http.js";

export default {
    namespaced: true,

    state: {
        appointment: {},
        appointments: []
    },

    mutations: {
        addAppointment(state, appointment) {
            if (!appointment || !appointment.id) return;
            const index = state.appointments.findIndex(a => a.id === appointment.id);
            if (index !== -1) state.appointments.splice(index, 1, appointment);
            else state.appointments.push(appointment);
        },

        setAppointments(state, appointments) {
            state.appointments = appointments.map(app => {
                if (app.total_expense && typeof app.total_expense === 'string') {
                    app.total_expense = app.total_expense.replace(/\./g, ',');
                }
                return app;
            });
            state.appointments = appointments;
        },

        setAppointment(state, appointment) {
            if (appointment.total_expense && typeof appointment.total_expense === 'string') {
                appointment.total_expense = appointment.total_expense.replace(/\./g, ',');
            }
            state.appointment = appointment;
        }
    },

    actions: {
        async fetchAppointments({ commit }) {
            const { data } = await http.get('appointments');
            commit('setAppointments', data.appointments);
        },

        async saveAppointment({ commit }, payload) {
            if (payload.id) {
                const { data } = await http.patch(`appointments/${payload.id}`, payload);
                commit('addAppointment', data.appointment);
                commit('setAppointment', data.appointment);
                return;
            }
            const { data } = await http.post('appointments', payload);
            commit('addAppointment', data.appointment);
            commit('setAppointment', data.appointment);

        },

        async getAppointment({ commit }, id) {
            const { data } = await http.get(`appointments/${id}`);
            commit('setAppointment', data.appointment);
        }
    }
}
