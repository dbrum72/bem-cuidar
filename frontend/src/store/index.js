import { createStore } from 'vuex';
import auth from './modules/auth';
import child from './modules/child';
import appointment from './modules/appointment';
import transactions from './modules/transactions';
import notifications from './modules/notifications';
import alerts from './modules/alerts';

export default createStore({
    modules: {
        auth,
        child,
        appointment,
        transactions,
        notifications,
        alerts
    }
});
