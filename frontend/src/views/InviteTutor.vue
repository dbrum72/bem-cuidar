<template>
    <div class="invite-section">
        <h3>Convidar Tutor</h3>

        <div class="invite-form">
            <input v-model="invite.email" placeholder="E-mail do tutor" />
            <input v-model="invite.relationship_type" placeholder="Tipo de relação (ex: mãe, pai)" />
            <button @click="sendInvite">Enviar Convite</button>
        </div>

        <p v-if="message" class="msg">{{ message }}</p>

        <h4 class="mt-4">Tutores vinculados</h4>
        <ul>
            <li v-for="tutor in tutors" :key="tutor.id">
                <strong>{{ tutor.name }}</strong>
                <span v-if="tutor.pivot.status === 'accepted'">✅ Aceito</span>
                <span v-else-if="isExpired(tutor.pivot.expires_at)">⚠️ Expirado</span>
                <span v-else>⏳ Pendente</span>
                <small v-if="tutor.pivot.relationship_type">
                    — {{ tutor.pivot.relationship_type }}
                </small>
            </li>
        </ul>
    </div>
</template>

<script>
import http from '@/services/http'

export default {
    props: ['dependentId'],
    data() {
        return {
            invite: { email: '', relationship_type: '' },
            message: '',
            tutors: []
        }
    },
    mounted() {
        this.loadTutors()
    },
    methods: {
        async sendInvite() {
            try {
                const { data } = await http.post(`/dependents/${this.dependentId}/invite-tutor`, this.invite)
                this.message = data.message
                this.invite = { email: '', relationship_type: '' }
                this.loadTutors()
            } catch (err) {
                this.message = err.response?.data?.message || 'Erro ao enviar convite.'
            }
        },
        async loadTutors() {
            const { data } = await http.get(`/dependents/${this.dependentId}/tutors`)
            this.tutors = data
        },
        isExpired(date) {
            if (!date) return false
            return new Date(date) < new Date()
        }
    }
}
</script>

<style scoped>
.invite-section {
    max-width: 500px;
    margin: 0 auto;
}

.invite-form {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}

.msg {
    color: #2c3e50;
    font-weight: bold;
}
</style>
