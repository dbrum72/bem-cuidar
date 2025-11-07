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
                    Confirma a exclusão do registro de ID nº. "{{ child.id }}" ?
                </div>
                <div class="text-end">
                    <router-link class="btn btn-gray me-2" :to="{ name: 'ChildList'}">Cancelar</router-link>
                    <button type="button" class=""
                        @click="(destroyChild(child.id))">Excluir</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"
import AbstractMixin from '@/mixins/AbstractMixin'
import ChildMixin from '@/mixins/ChildMixin'

export default {

    name: 'ChildDelete',

    mixins: [AbstractMixin, ChildMixin],

    computed: {
        ...mapState('child', ['child'])
    },

    mounted() {
        this.getChild(this.$route.params.id)
    }
}
</script>

<style></style>