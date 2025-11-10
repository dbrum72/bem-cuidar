import { createStore } from 'vuex';
import auth from './modules/auth';
import dependent from './modules/dependent';
import appointment from './modules/appointment';
import transactions from './modules/transactions';
import notifications from './modules/notifications';
import tutorInvite from './modules/tutorInvite';
import alerts from './modules/alerts';

export default createStore({
    modules: {
        auth,
        dependent,
        appointment,
        transactions,
        notifications,
        tutorInvite,
        alerts,
    }
});
