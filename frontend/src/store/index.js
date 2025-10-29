import { createStore } from 'vuex';
import auth from './modules/auth';
import children from './modules/children';
import sharedCare from './modules/sharedCare';
import transactions from './modules/transactions';
import notifications from './modules/notifications';
import alerts from './modules/alerts';

export default createStore({
    modules: {
        auth,
        children,
        sharedCare,
        transactions,
        notifications,
        alerts
    }
});
