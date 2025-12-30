
import { createResource } from "@/services/resource.js";

const fileAPI = createResource("appointment/file");

export default {
	namespaced: true,

	state: () => ({
		fileToDelete: null
	}),

	mutations: {
		SET_FILE_TO_DELETE(state, file) {
			state.fileToDelete = file;
		},

		REMOVE_APPOINTMENT_FILE(state, id) {
			if (!state.appointment?.files) return;

			state.appointment.files = state.appointment.files.filter(
				file => file.id !== id
			);
		}
	},

	actions: {

		// =====================================================
		// UPLOAD FILE
		// =====================================================
		async uploadFile({ dispatch }, payload) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => fileAPI.uploadFile(payload),
					successMsg: "Anexos salvos com sucesso.",
					errorMsg: "Erro ao salvar anexos.",
				},
				{ root: true }
			);
			/*if (response?.data) {
				commit("addAppointment", response.data.appointment);
				return response.data.appointment;
			}*/

			return null;
		},


		// =====================================================
		// DESTROY FILE
		// =====================================================
		async removeFile({ dispatch }, id) {
			const response = await dispatch(
				"request/exec",
				{
					callFn: () => fileAPI.destroyFile(id),
					successMsg: "Arquivo excluídos com sucesso.",
					errorMsg: "Erro ao excluir arquivo.",
				},
				{ root: true }
			);

			commit('SET_FILE_TO_DELETE', null);

			commit("REMOVE_APPOINTMENT_FILE", id);

			return !!response;
		},
	}
};  