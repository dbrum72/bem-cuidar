<template>
    <div class="">
        <div class="d-flex areaHeader">
            <span class="font12rW600TuCg pe-2">Criança</span>
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
                        {{ dependent.birth_date }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Criado em
                    </div>
                    <div class="data">
                        {{ dependent.created_at ? formatDate(this.dependent.created_at) : '' }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Atualizado em
                    </div>
                    <div class="data">
                        {{ dependent.updated_at ? formatDate(this.dependent.updated_at) : '' }}
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