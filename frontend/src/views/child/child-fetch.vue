<template>

    <HeaderBar />

    <div class="d-flex justify-content-between px-3">
        <h2>Crianças</h2>
        <router-link :to="{ name: 'ChildSave' }">Adicionar</router-link>
    </div>
    <div v-if="list.length === 0">Nenhuma criança cadastrada</div>

    <div v-else>
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Data Nascimento</th>
                    <th>Notas</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in list" :key="i.id" class="">
                    <td>{{ i.name }}</td>
                    <td>{{ i.birth_date }}</td>
                    <td>{{ i.notes }}</td>
                    <td>
                        <router-link :to="{ name: 'ChildSave', params: { id: i.id } }">
                            Editar
                        </router-link>
                        <router-link class="" :to="{ name: 'ChildDelete', params: { id: i.id } }">
                            Excluir
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState } from "vuex"
import AbstractMixin from '@/mixins/AbstractMixin'
import ChildMixin from '@/mixins/ChildMixin'
import HeaderBar from "@/components/bars/header-bar.vue"

export default {

    name: "ChildFetch",

    components: { HeaderBar },

    mixins: [AbstractMixin, ChildMixin],

    computed: {
        ...mapState('child', ['list'])
    },

    mounted() {
        this.getList(null, null, null, null);
    },
}
</script>
