import { createStore } from 'vuex';
import auth from './modules/auth';
import user from './modules/user';
import dependent from './modules/dependent';
import appointment from './modules/appointment';
import relationship from './modules/relationship';
import transactions from './modules/transactions';
import notifications from './modules/notifications';
import tutorInvite from './modules/tutorInvite';
import alerts from './modules/alerts';

export default createStore({
    modules: {
        auth,
        user,
        dependent,
        appointment,
        relationship,
        transactions,
        notifications,
        tutorInvite,
        alerts,
    }
});
