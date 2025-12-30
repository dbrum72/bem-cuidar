
import { createResource } from "@/services/resource.js";

const fileAPI = createResource("appointment/file");

export default {
	namespaced: true,

	state: () => ({
		fileToDelete: null
	}),

	mutations: {
		SET_FILE_TO_DELETE(state, fileToDelete) {
			state.fileToDelete = fileToDelete;
		},
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
		async destroyFile({ dispatch }, id) {
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

			await dispatch(
				'appointment/getAppointment',
				id,
				{ root: true }
			);

			return !!response;
		},
	}
};  