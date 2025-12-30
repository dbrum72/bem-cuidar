import { mapMutations } from "vuex"
import http from '@/services/http.js'

export default {

    methods: {

        formatDate(dateString) {
            if (!dateString) return '---';

            let date;
            const dateOnlyMatch = typeof dateString === 'string' && dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);

            if (dateOnlyMatch) {
                const [, y, m, d] = dateOnlyMatch;
                date = new Date(Number(y), Number(m) - 1, Number(d)); // ano, mêsIndexado, dia (local)
            } else if (typeof dateString === 'number') {
                // timestamp em ms
                date = new Date(dateString);
            } else {
                // casos: ISO com hora (ex: 2025-11-08T14:30:00Z), string com fuso, etc.
                date = new Date(dateString);
            }

            if (isNaN(date.getTime())) return '---';

            return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(date);
        },


        formatDateTime(dateString) {
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