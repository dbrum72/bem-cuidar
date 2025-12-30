import { createResource } from "@/services/resource.js";

const appointmentAPI = createResource("appointment");

export default {
	namespaced: true,

	state: {
		appointment: {},
		appointments: [],
	},

	mutations: {
		addAppointment(state, appointment) {
			if (!appointment || !appointment.id) return;
			const index = state.appointments.findIndex(
				(a) => a.id === appointment.id
			);
			if (index !== -1) state.appointments.splice(index, 1, appointment);
			else state.appointments.push(appointment);
		},

		setAppointments(state, appointments) {
			state.appointments = appointments.map((app) => {
				if (
					app.total_expense &&
					typeof app.total_expense === "string"
				) {
					app.total_expense = app.total_expense.replace(/\./g, ",");
				}
				return app;
			});
			state.appointments = appointments;
		},

		setAppointment(state, appointment) {
			if (
				appointment.total_expense &&
				typeof appointment.total_expense === "string"
			) {
				appointment.total_expense = appointment.total_expense.replace(
					/\./g,
					","
				);
			}
			state.appointment = appointment;
		},

		REMOVE_APPOINTMENT_FILE(state, fileId) {
			if (!state.appointment?.files) return;

			state.appointment.files = state.appointment.files.filter(
				(file) => file.id !== fileId
			);
		},
	},

	actions: {
		// =====================================================
		// GET LIST
		// =====================================================
		async getAppointments({ commit, dispatch }) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => appointmentAPI.list(),
					successMsg: (response) =>
						response?.data?.appointments?.length
							? "Agendamentos carregados com sucesso."
							: "Nenhum agendamento cadastrado.",
					errorMsg: "Erro ao carregar a lista de agendamentos.",
				},
				{ root: true }
			);

			if (response?.data) {
				commit("setAppointments", response.data.appointments);
			}
		},

		// =====================================================
		// GET ONE
		// =====================================================
		async getAppointment({ commit, dispatch }, id) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => appointmentAPI.get(id),
					successMsg: "Dados do agendamento carregados com sucesso.",
					errorMsg: "Erro ao carregar os dados do agendamento.",
				},
				{ root: true }
			);

			if (response?.data) {
				commit("setAppointment", response.data.appointment);
			}

			return response?.data?.appointment ?? null;
		},

		// =====================================================
		// SAVE or UPDATE
		// =====================================================
		async addOrUpdate({ commit, dispatch }, payload) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => appointmentAPI.save(payload),
					successMsg: "Agendamento salvo com sucesso.",
					errorMsg: "Erro ao salvar agendamento.",
				},
				{ root: true }
			);

			if (response?.data) {
				commit("addAppointment", response.data.appointment);
				return response.data.appointment;
			}

			return null;
		},
	},
};
