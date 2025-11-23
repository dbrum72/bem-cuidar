<template>
    <div class="container mt-4">
        <div class="d-flex areaHeader">
            <h4 class="text-2xl font-semibold mb-6">Dependente</h4>
            <router-link class="btn btn-sm btn-gray" :to="{ name: 'DependentList' }">Lista</router-link>
        </div>

        <div class="subArea mb-5">
            <div class="d-flex justify-content-between m-2 title-sub-area">
                <div><span>Informações</span></div>
            </div>
            <div class="dados">
                <div class="tupla">
                    <div class="field">
                        ID
                    </div>
                    <div class="data">
                        {{ dependent.id }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Nome
                    </div>
                    <div class="data">
                        {{ dependent.name }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Data de Nascimento
                    </div>
                    <div class="data">
                        {{ formatDate(dependent.birth_date) ?? '' }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Nota
                    </div>
                    <div class="data">
                        {{ dependent.notes }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Criado em
                    </div>
                    <div class="data">
                        {{ formatDateTime(this.dependent.created_at) ?? '' }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Atualizado em
                    </div>
                    <div class="data">
                        {{ formatDateTime(this.dependent.updated_at) ?? '' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"
import AbstractMixin from '@/mixins/AbstractMixin'
import DependentMixin from '@/mixins/DependentMixin'

export default {

    name: 'DependentShow',

    mixins: [AbstractMixin, DependentMixin],

    computed: {
        ...mapState(['errors', 'loader']),
        ...mapState('dependent', ['dependent']),
    },

    mounted() {
        this.getDependent(this.$route.params.id)
    }
}
</script>

<style></style>