import { getCollection, getData, upstoreData, deleteData } from '@/services/abstract.js';
import { mapState, mapMutations } from "vuex";

export default {

    methods: {

        ...mapMutations(['SET_ERRORS']),

        computed: {
        ...mapState('child', ['child']),
    },

        async getChildren(filter, extendedFilter, parameter, sort) {
            const url = `${ import.meta.env.VITE_BACKEND_URL }/child`
            const response = await this.handleRequest(
                () => getCollection(url, filter, extendedFilter, parameter, sort),
                null,
                'Erro ao carregar a lista de produtos.',
                false
            );
            if (response) {
                this.$store.commit('child/setChildren', response.data.children);
            }
        },

        async getChild(id) {
            console.log("ID do Child:", id);
            const url = `${ import.meta.env.VITE_BACKEND_URL }/child/${id}`
            const response = await this.handleRequest(
                () => getData(url),
                null,
                'Erro ao carregar a lista de produtos.',
                false
            );
            if (response) {
                this.$store.commit('child/setChild', response.data.child);
            }
        },

        async storeChild(payload) {
            const url = `${ import.meta.env.VITE_BACKEND_URL }/child`
            const response = await this.handleRequest(
                () => upstoreData(url, null, payload),
                null,
                'Erro ao salvar os dados.'
            );
            if (response) {
                this.$store.commit('child/addChild', response.data.child);
                //this.resetChildView();
            }
        },

        async updateChild(payload) {
            const url = `${ import.meta.env.VITE_BACKEND_URL }/child`
            const response = await this.handleRequest(
                () => upstoreData(url, payload.id, payload),
                null,
                'Erro ao salvar os dados.'
            );
            if (response) {
                this.$store.commit('child/addChild', response.data.child);
                //this.resetChildView(response.data.id);
            }
        },

        async destroyChild(id) {
            const url = `${ import.meta.env.VITE_BACKEND_URL }/child`
            const response = await this.handleRequest(
                () => deleteData(url, id),
                'Registro excluído com sucesso.',
                'Erro ao excluir o produto.'
            );
            if (response) {
                this.resetChildView();
            }
        },

        getFile(file) {
            return getFile(file)
        },

        resetChildView(id) {
            this.Child = {}
            this.SET_ERRORS([])
            id ? this.$router.push({ name: 'ShowChild', params: { 'id': id } }) : this.$router.push({ name: 'ListChildren' })
        },
    }
}