import { getCollection, getData, upstoreData, deleteData } from '@/services/abstract.js';
import { mapState, mapMutations } from "vuex";

export default {

    methods: {

        ...mapMutations(['SET_ERRORS']),
        ...mapMutations('appointment', ['setAppointments', 'setAppointment']),

        computed: {
        ...mapState('appointment', ['appointment']),
    },

        async getAppointments(filter, extendedFilter, parameter, sort) {
            const url = `${ import.meta.env.VITE_BACKEND_URL }/appointment`
            const response = await this.handleRequest(
                () => getCollection(url, filter, extendedFilter, parameter, sort),
                null,
                'Erro ao carregar a lista de produtos.',
                false
            );
            if (response) {
                this.setAppointments(response.data.appointments);
            }
        },

        async getAppointment(id) {
            console.log("ID do Appointment:", id);
            const url = `${ import.meta.env.VITE_BACKEND_URL }/appointment/${id}`
            const response = await this.handleRequest(
                () => getData(url),
                null,
                'Erro ao carregar a lista de produtos.',
                false
            );
            if (response) {
                this.setAppointment(response.data.appointment);
            }
        },

        async storeAppointment(payload) {
            const url = `${ import.meta.env.VITE_BACKEND_URL }/appointment`
            const response = await this.handleRequest(
                () => upstoreData(url, null, payload),
                null,
                'Erro ao salvar os dados.'
            );
            if (response) {
                this.$store.commit('appointment/addAppointment', response.data.appointment);
                //this.resetAppointmentView();
            }
        },

        async updateAppointment(payload) {
            const url = `${ import.meta.env.VITE_BACKEND_URL }/appointment`
            const response = await this.handleRequest(
                () => upstoreData(url, payload.id, payload),
                null,
                'Erro ao salvar os dados.'
            );
            if (response) {
                this.$store.commit('appointment/addAppointment', response.data.appointment);
                //this.resetAppointmentView(response.data.id);
            }
        },

        async destroyAppointment(id) {
            const url = `${ import.meta.env.VITE_BACKEND_URL }/appointment`
            const response = await this.handleRequest(
                () => deleteData(url, id),
                'Registro excluído com sucesso.',
                'Erro ao excluir o produto.'
            );
            if (response) {
                this.resetAppointmentView();
            }
        },

        getFile(file) {
            return getFile(file)
        },

        resetAppointmentView(id) {
            this.Appointment = {}
            this.SET_ERRORS([])
            id ? this.$router.push({ name: 'ShowAppointment', params: { 'id': id } }) : this.$router.push({ name: 'ListAppointments' })
        },
    }
}