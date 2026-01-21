import { createStore } from 'vuex';
import alerts from './modules/alerts';
import appointment from './modules/appointment';
import auth from './modules/auth';
import dependent from './modules/dependent';
import file from './modules/file';
import loader from "./modules/loader";
import notifications from './modules/notifications';
import relationship from './modules/relationship';
import request from "../helpers/request";
import transactions from './modules/transactions';
import tutorInvite from './modules/tutorInvite';
import user from './modules/user';

export default createStore({
    modules: {
        alerts,
        appointment,
        auth,
        dependent,
        file,
        loader,
        notifications,       
        relationship,
        request,
        transactions,
        tutorInvite,
        user       
    }
});
