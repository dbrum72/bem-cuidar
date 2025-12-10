import { createResource } from "@/services/resource.js";

const appointmentAPI = createResource("appointment");

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

        async _execRequest({ rootGetters }, { callFn, successMsg = null, errorMsg = null, swallow = true }) {

            const handleRequest = rootGetters["handleRequest"];

            if (typeof handleRequest === "function") {
                try {
                    return await handleRequest(callFn, successMsg, errorMsg, swallow);
                } catch {
                    return null;
                }
            }

            try {
                const res = await callFn();
                if (successMsg && window?.$toast) window.$toast.success(successMsg);
                return res;
            } catch (err) {
                if (errorMsg && window?.$toast) window.$toast.error(errorMsg);
                console.error(errorMsg ?? "Erro na requisição", err);
                return null;
            }
        },

        // =====================================================
        // GET LIST
        // =====================================================
        async getAppointments({ commit, dispatch }) {
            const call = () => appointmentAPI.list();

            const response = await dispatch("_execRequest", {
                callFn: call,
                options: {
                    errorMsg: "Erro ao carregar a lista de dependentes.",
                    swallow: false
                }
            });

            if (response?.data) {
                commit("setAppointments", response.data.appointments);
            }
        },

        // =====================================================
        // SAVE or UPDATE
        // =====================================================
        async addOrUpdate({ commit, dispatch }, payload) {
            const call = () => appointmentAPI.save(payload);

            const response = await dispatch("_execRequest", {
                callFn: call,
                options: {
                    errorMsg: "Erro ao salvar os dados."
                }
            });

            if (response?.data) {
                commit("addAppointment", response.data.appointment);
                return response.data.appointment;
            }

            return null;
        },

        async getAppointment({ commit }, id) {
            const { data } = await http.get(`appointments/${id}`);
            commit('setAppointment', data.appointment);
        }
    }
}
