<template>
    <div class="register-container">
        <h2>Cadastro</h2>

        <form @submit.prevent="register">
            <div class="form-group">
                <label>Nome</label>
                <input v-model="form.name" type="text" required />
            </div>

            <div class="form-group">
                <label>E-mail</label>
                <input v-model="form.email" type="email" required />
            </div>

            <div class="form-group">
                <label>Senha</label>
                <input v-model="form.password" type="password" required />
            </div>

            <div class="form-group">
                <label>Confirmar senha</label>
                <input v-model="form.password_confirmation" type="password" required />
            </div>

            <button type="submit" class="btn-primary">Cadastrar</button>
        </form>

        <p class="mt-4">
            Já possui conta?
            <router-link :to="{ name: 'Login' }">Entrar</router-link>
        </p>
    </div>
</template>

<script>
import AuthMixin from "@/mixins/AuthMixin";

export default {
    name: "RegisterView",
    mixins: [AuthMixin],

    data() {
        return {
            form: {
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
            },
            loading: false,
        };
    },

    methods: {
        async register() {
            this.loading = true;
            try {
                const resource = this.getAuthResource();

                const { data } = await resource.post("register", this.form);

                if (data?.token) {
                    this.setToken(data.token);
                    this.setUser(data.user);
                    this._toastSuccess("Cadastro realizado com sucesso!");
                    this.$router.push({ name: "DashboardView" });
                } else {
                    this._toastSuccess("Cadastro realizado! Faça login para continuar.");
                    this.$router.push({ name: "Login" });
                }
            } catch (err) {
                console.error("Erro ao registrar:", err);
                const msg =
                    err?.response?.data?.message ||
                    "Não foi possível realizar o cadastro.";
                this._toastError(msg);
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.register-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1rem;
}

.btn-primary {
    width: 100%;
    padding: 0.75rem;
    background-color: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.btn-primary:hover {
    background-color: #2563eb;
}
</style>
