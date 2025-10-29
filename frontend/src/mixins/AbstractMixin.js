import { mapMutations } from "vuex"
import http from '@/services/http.js' 

export default {

    methods: {

        ...mapMutations(['SET_USER', 'PUSH_NOTIFICATION', 'SET_ERRORS', 'SET_LOADER']),

        async handleRequest(request, successMessage, errorMessage, showNotification = true, showLoader = true) {
            if (showLoader) {
                this.SET_LOADER({ 'active': true, 'text': 'Processando...' });
            }
            try {
                const response = await request();
                if (showNotification) {
                    this.PUSH_NOTIFICATION({ type: 'success', message: successMessage || response.data.msg });
                }
                this.SET_ERRORS([])
                return response;
            } catch (error) {
                const message = error?.response
                    ? errorMessage || 'Ocorreu um erro inesperado. Tente novamente.'
                    : 'Erro de rede ou servidor. Tente novamente.';
                this.PUSH_NOTIFICATION({ type: 'error', message });
                this.SET_ERRORS(error.response.data.errors)
            } finally {
                if (showLoader) {
                    this.SET_LOADER({ 'active': false, 'text': '' });
                }
            }
        },

        getCookieToken() {

            const cookieToken = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            return cookieToken ? cookieToken : null
        },

        async getDadosApi(url) {

            this.SET_LOADER({ 'active': true, 'text': 'Carregando dados...' })

            try {
                let response = await http.get(url)
                return response.data
            }
            catch (error) {
                if (error?.response?.status == '404') {
                    this.PUSH_NOTIFICATION({
                        type: 'informe',
                        message: 'Nenhum registro foi localizado.'
                    })
                }
                this.errors = error?.response?.data.errors
                return []
            }
            finally {
                this.SET_LOADER({ 'active': false, 'text': '' })
            }
        },

        formatDate(dateString) {
            if (!dateString) return '---'; // ou return ''

            const date = new Date(dateString)
            if (isNaN(date.getTime())) return '---'; // data inválida

            return new Intl.DateTimeFormat('default', { dateStyle: 'short', timeStyle: 'short' }).format(date)
        },

        toCurrency(value) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        },
    }
}