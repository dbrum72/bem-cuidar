import { createResource } from '@/services/resource.js';
import { mapMutations } from 'vuex';
import router from "@/router";

const userAPI = createResource('auth/login');

export default {

  methods: {
    ...mapMutations('auth', ['setToken', 'setUser']),

    async login(payload) {
      const call = () => userAPI.post(payload);
      const response = await this._execRequest(call, {
        errorMsg: 'Erro no login.',
      });
      if (response?.data) {
        this.setToken(response.data.token);
        this.setUser(response.data.user);
        router.push({ name: 'DashboardView' });
      }
    },

     async _execRequest(callFn, { successMsg = null, errorMsg = null, swallow = true } = {}) {
            // usa this.handleRequest se existir (preserva tratamento global/alertas)
            if (typeof this.handleRequest === 'function') {
                try {
                    return await this.handleRequest(callFn, successMsg, errorMsg, swallow);
                } catch (err) {
                    // handleRequest deve já ter mostrado mensagem. retornamos null.
                    return null;
                }
            }

            // fallback direto (sem handleRequest)
            try {
                const res = await callFn();
                if (successMsg && this.$toast) {
                    // se você tiver um plugin de toast
                    this.$toast.success(successMsg);
                }
                return res;
            } catch (err) {
                if (errorMsg && this.$toast) this.$toast.error(errorMsg);
                console.error(errorMsg ?? 'Erro na requisição', err);
                return null;
            }
        }
  },
};
