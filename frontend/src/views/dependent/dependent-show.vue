<template>
    <div class="container mt-4">
        <div class="d-flex">
            <h4 class="text-2xl font-semibold mb-6">Dependente</h4>
            <router-link class="btn btn-sm btn-gray" :to="{ name: 'DependentList' }">Lista</router-link>
        </div>

        <div class="subArea mb-5">
            <div class="d-flex justify-content-between m-2 title-sub-area">
                <div><span>Informações</span></div>
            </div>
            <div class="dados">
                <div class="row mb-3">
                    <div class="col-sm-12 col-lg-4 text-sm-start text-lg-end">
                        ID
                    </div>
                    <div class="col-sm-12 col-lg-4">
                        {{ dependent.id }}
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-sm-12 col-lg-4 text-sm-start text-lg-end">
                        Nome
                    </div>
                    <div class="col-sm-12 col-lg-4">
                        {{ dependent.name }}
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-sm-12 col-lg-4 text-sm-start text-lg-end">
                        Data de Nascimento
                    </div>
                    <div class="col-sm-12 col-lg-4">
                        {{ formatDate(dependent.birth_date) ?? '' }}
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-sm-12 col-lg-4 text-sm-start text-lg-end">
                        Nota
                    </div>
                    <div class="col-sm-12 col-lg-4">
                        {{ dependent.notes }}
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-sm-12 col-lg-4 text-sm-start text-lg-end">
                        Criado em
                    </div>
                    <div class="col-sm-12 col-lg-4">
                        {{ formatDateTime(this.dependent.created_at) ?? '' }}
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-sm-12 col-lg-4 text-sm-start text-lg-end">
                        Atualizado em
                    </div>
                    <div class="col-sm-12 col-lg-4">
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