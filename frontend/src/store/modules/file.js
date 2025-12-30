import { createResource } from "@/services/resource.js";

const fileAPI = createResource("appointment/file");

export default {
    namespaced: true,

    actions: {

        // =====================================================
        // UPLOAD FILE
        // =====================================================
        async uploadFile({ dispatch }, payload) {
            await dispatch(
                "request/exec",
                {
                    callFn: () => fileAPI.uploadFile(payload),
                    successMsg: "Anexos salvos com sucesso.",
                    errorMsg: "Erro ao salvar anexos.",
                },
                { root: true }
            );
        },

        // =====================================================
        // DESTROY FILE
        // =====================================================
        async removeFile({ dispatch }, id) {
            const response = await dispatch(
                "request/exec",
                {
                    callFn: () => fileAPI.destroyFile(id),
                    successMsg: "Arquivo excluído com sucesso.",
                    errorMsg: "Erro ao excluir arquivo.",
                },
                { root: true }
            );

            return !!response;
        },
    },
};
