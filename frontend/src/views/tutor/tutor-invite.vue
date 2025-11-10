<template>
    <div class="invite-tutor card p-4">
        <h2>Convidar Tutor</h2>

        <form @submit.prevent="onSubmit">
            <div class="form-group">
                <label for="tutor_email">E-mail do tutor</label>
                <input v-model="form.tutor_email" id="tutor_email" type="email" class="form-control" required />
            </div>

            <div class="form-group mt-2">
                <label for="message">Mensagem (opcional)</label>
                <textarea v-model="form.message" id="message" class="form-control" rows="3"></textarea>
            </div>

            <div class="mt-3">
                <button class="btn btn-primary" :disabled="loading">
                    {{ loading ? 'Enviando...' : 'Enviar Convite' }}
                </button>
            </div>
        </form>

        <hr />

        <div>
            <h3>Convites enviados</h3>
            <button class="btn btn-link" @click="fetchInvites">Atualizar</button>

            <ul v-if="invites && invites.length">
                <li v-for="i in invites" :key="i.id" class="my-2">
                    <strong>{{ i.tutor_email }}</strong> —
                    <span>{{ i.status }}</span> —
                    <small>{{ formatDate(i.created_at) }}</small>

                    <button v-if="i.status === 'pending'" @click="resendInvite(i.id)"
                        class="btn btn-sm btn-outline-secondary mx-1">
                        Reenviar
                    </button>

                    <button @click="deleteInvite(i.id)" class="btn btn-sm btn-outline-danger mx-1">
                        Excluir
                    </button>
                </li>
            </ul>
            <div v-else>Nenhum convite enviado ainda.</div>
        </div>
    </div>
</template>

<script>
import TutorInviteMixin from '@/mixins/TutorInviteMixin.js'

export default {
    name: 'TutorInvite',

    mixins: [TutorInviteMixin],

    data() {
        return {
            form: { tutor_email: '', message: '' },
            loading: false
        }
    },

    methods: {
        async onSubmit() {
            this.loading = true
            try {
                await this.sendInvite({ ...this.form })
                this.form.tutor_email = ''
                this.form.message = ''
                await this.fetchInvites()
            } finally {
                this.loading = false
            }
        },

        formatDate(date) {
            if (!date) return '---'
            return new Date(date).toLocaleString()
        }
    },
    
    mounted() {
        this.fetchInvites()
    }
}
</script>
