import { createResource } from '@/services/resource.js';
import { mapMutations } from 'vuex';

const childAPI = createResource('child');

export default {
    methods: {
        ...mapMutations('child', ['setChildren', 'setChild', 'addChild']),

        /**
         * Usa this.handleRequest(...) se existir — assim você mantém tratamento centralizado.
         * Caso não exista, cai em fallback simples try/catch com console.error.
         */

        async getChildren(filter, extendedFilter, relationship, sort) {
            const call = () => childAPI.list({ filter, extendedFilter, relationship, sort });
            const response = await this._execRequest(call, { errorMsg: 'Erro ao carregar a lista de produtos.', swallow: false });
            if (response?.data) this.setChildren(response.data.children);
        },

        async getChild(id) {
            const call = () => childAPI.get(id);
            const response = await this._execRequest(call, { errorMsg: 'Erro ao carregar os dados do registro.', swallow: false });
            if (response?.data) this.$store.commit('child/setChild', response.data.child);
        },

        async storeChild(payload) {
            const call = () => childAPI.saveOrUpdate(payload);
            const response = await this._execRequest(call, { errorMsg: 'Erro ao salvar os dados.' });
            if (response?.data) {
                this.$store.commit('child/addChild', response.data.child);
                this.resetChildView();
            }
        },

        async updateChild(payload) {
            const call = () => childAPI.saveOrUpdate(payload);
            const response = await this._execRequest(call, { errorMsg: 'Erro ao salvar os dados.' });
            if (response?.data) {
                this.$store.commit('child/addChild', response.data.child);
                this.resetChildView(response.data.child.id);
            }
        },

        async destroyChild(id) {
            const call = () => childAPI.remove(id);
            const response = await this._execRequest(call, { successMsg: 'Registro excluído com sucesso.', errorMsg: 'Erro ao excluir o produto.' });
            if (response) {
                this.resetChildView();
            }
        },

        getFile(file) {
            // se tiver um serviço para isso, importe-o. Aqui só repassamos.
            // Exemplo: return fileService.getFile(file)
            return file;
        },

        resetChildView(id) {
            // mantém compatibilidade com seus nomes de rota
            // ajuste os nomes das rotas caso necessário
            this.Child = {};
            if (this.SET_ERRORS) this.SET_ERRORS([]);
            id ? this.$router.push({ name: 'ChildShow', params: { id } }) : this.$router.push({ name: 'ChildList' });
        },

        /**
         * _execRequest: reutiliza a lógica de tratamento de requests.
         * Se o componente tiver this.handleRequest definido, usamos ele (mantendo comportamento anterior).
         * Caso contrário, fazemos try/catch padrão. Retornamos a response ou null se falhar.
         */
        async _execRequest(callFn, { successMsg = null, errorMsg = null, swallow = true } = {}) {
            // usa this.handleRequest se existir (preserva tratamento global/alertas)
            if (typeof this.handleRequest === 'function') {
                try {
                    return await this.handleRequest(callFn, successMsg, errorMsg, swallow);
                } catch (err) {
                    // handleRequest deve já ter mostrado mensagem. retornamos null.
                    return null;
                }
            }

            // fallback direto (sem handleRequest)
            try {
                const res = await callFn();
                if (successMsg && this.$toast) {
                    // se você tiver um plugin de toast
                    this.$toast.success(successMsg);
                }
                return res;
            } catch (err) {
                if (errorMsg && this.$toast) this.$toast.error(errorMsg);
                console.error(errorMsg ?? 'Erro na requisição', err);
                return null;
            }
        }
    }
};
