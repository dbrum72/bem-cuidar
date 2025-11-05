import { createStore } from 'vuex';
import auth from './modules/auth';
import child from './modules/child';
import appointments from './modules/appointments';
import transactions from './modules/transactions';
import notifications from './modules/notifications';
import alerts from './modules/alerts';

export default createStore({
    modules: {
        auth,
        child,
        appointments,
        transactions,
        notifications,
        alerts
    }
});
