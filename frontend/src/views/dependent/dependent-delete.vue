<template>
    <div class="">
        <div class="areaHeader">
            <span class="font12rW600TuCg">CRIANÇA</span>
        </div>

        <div class="p-2">
            <div class="box show">
                <div class="fs-4 pb-2 mb-4 border-bottom border-dark">
                    <span>Atenção</span>
                </div>
                <div style="margin: 10px;">
                    Confirma a exclusão do registro de ID nº. "{{ dependent.id }}" ?
                </div>
                <div class="text-end">
                    <router-link class="btn btn-gray me-2" :to="{ name: 'DependentList'}">Cancelar</router-link>
                    <button type="button" class=""
                        @click="(destroyDependent(dependent.id))">Excluir</button>
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

    name: 'DependentDelete',

    mixins: [AbstractMixin, DependentMixin],

    computed: {
        ...mapState('dependent', ['dependent'])
    },

    mounted() {
        this.getDependent(this.$route.params.id)
    }
}
</script>

<style></style>