<template>
    <div class="d-flex">
        <h4>Dependente</h4>
        <router-link class="btn btn-sm btn-gray" :to="{ name: 'DependentList' }">Lista</router-link>
    </div>

    <div class="d-flex justify-content-between m-2 title-sub-area">
        <div><span>Informações</span></div>
    </div>
    <div v-if="dependent" class="dados">
        <div v-for="field in fields" :key="field.key" class="row mb-3">
            <div class="col-sm-12 col-lg-4 text-sm-start text-lg-end">
                {{ field.label }}
            </div>
            <div class="col-sm-12 col-lg-4">
                {{ field.value }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import AbstractMixin from '@/mixins/AbstractMixin'

export default {

    name: 'DependentShow',

    mixins: [AbstractMixin],

    computed: {
        ...mapState(['errors', 'loader']),
        ...mapState('dependent', ['dependent']),

        id() {
            return this.$route.params.id
        },

        fields() {
            if (!this.dependent) return []

            return [
                { key: 'id', label: 'ID', value: this.dependent.id },
                { key: 'name', label: 'Nome', value: this.dependent.name },
                { key: 'document', label: 'Nº. documento', value: this.dependent.document_number + ' (' + this.dependent.document_type + ')' },
                { key: 'birth_date', label: 'Data de Nascimento', value: this.formatDate(this.dependent.birth_date) },
                { key: 'notes', label: 'Nota', value: this.dependent.notes },
                { key: 'created_at', label: 'Criado em', value: this.formatDateTime(this.dependent.created_at) },
                { key: 'updated_at', label: 'Atualizado em', value: this.formatDateTime(this.dependent.updated_at) },
            ]
        }
    },

    methods: {
        ...mapActions('dependent', ['getDependent']),
    },

    created() {
        this.getDependent(this.id)
    }
}
</script>