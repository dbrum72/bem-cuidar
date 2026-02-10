<template>
    <div class="invite-tutor card p-4">
        <h2>Convidar Tutor</h2>

        <form @submit.prevent="onSubmit">
            <div class="form-group mb-3">
                <label class="form-label">Dependente</label>
                <select v-model="form.dependent_id" class="form-select" aria-label="Dependente" required>
                    <option value="">Selecione...</option>
                    <option v-for="dependent in dependents" :key="dependent.id" :value="dependent.id">
                        {{ dependent.name }}
                    </option>
                </select>
            </div>

            <div class="form-group mb-3">
                <label for="tutor_email">E-mail do tutor</label>
                <input v-model="form.tutor_email" id="tutor_email" type="email" class="form-control" required />
            </div>

            <div class="form-group mb-3">
                <label for="message">Mensagem (opcional)</label>
                <textarea v-model="form.message" id="message" class="form-control" rows="3"></textarea>
            </div>

            <div class="form-group">
                <button class="btn btn-primary" :disabled="loading">
                    {{ loading ? 'Enviando...' : 'Enviar Convite' }}
                </button>
            </div>
        </form>

        <hr class="mb-4" />

        <div>
            <h3>Convites enviados</h3>
            <button class="btn btn-link" @click="fetchInvites">Atualizar</button>

            <ul v-if="invites && invites.length">
                <li v-for="i in invites" :key="i.id" class="my-2">
                    <strong>{{ i.tutor_email }}</strong> —
                    <span>{{ i.status }}</span> —
                    <small>{{ formatDate(i.created_at) }}</small>

                    <button v-if="i.status === 'pendente'" @click="resendInvite(i.id)"
                        class="btn btn-sm btn-outline-secondary mx-1">
                        Reenviar
                    </button>

                    <button @click="destroyInvite(i.id)" class="btn btn-sm btn-outline-danger mx-1">
                        Excluir
                    </button>
                </li>
            </ul>
            <div v-else>Nenhum convite enviado ainda.</div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'TutorInvite',

    data() {
        return {
            form: {
                tutor_email: null,
                dependent_id: null,
                message: null
            },
            loading: false
        }
    },

    computed: {
        ...mapState('tutorInvite', ['invites']),
        ...mapState('dependent', ['dependents']),

        getDependentName() {
            const id = Number(this.form.dependent_id)
            if (!id || !this.dependents?.length) return null
            return this.dependents.find(d => d.id === id)?.name ?? null
        }
    },

    methods: {
        ...mapActions('tutorInvite', [
            'addOrUpdate',
            'getInvites',
            'resendInvite',
            'destroyInvite'
        ]),

        async onSubmit() {
            this.loading = true
            try {
                await this.addOrUpdate({ 
                    ...this.form,
                    dependent_name: this.getDependentName
                })
            } finally {
                await this.getInvites(),
                    this.form.dependent_id = '',
                    this.form.dependent_name = '',
                    this.form.tutor_email = '',
                    this.form.message = '',
                    this.loading = false
            }
        },

        formatDate(date) {
            if (!date) return '---'
            return new Date(date).toLocaleString()
        }
    },

    mounted() {
        this.getInvites()
    }
}
</script>
