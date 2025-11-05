<template>

    <HeaderBar />

    <h2>Crianças</h2>
    <div v-if="children.length === 0">Nenhuma criança cadastrada</div>

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
                <tr v-for="child in children" :key="child.id" class="">
                    <td>{{ child.name }}</td>
                    <td>{{ child.birth_date }}</td>
                    <td>{{ child.notes }}</td>
                    <td>
                        <router-link :to="{ name: 'ChildSave', params: { id: child.id } }">
                            Editar
                        </router-link>
                        <router-link class="" :to="{ name: 'ChildDelete', params: { id: child.id } }">
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
import HeaderBar from "@/components/bars/header-bar.vue";

export default {

    name: "ChildFetch",

    components: { HeaderBar },

    mixins: [AbstractMixin, ChildMixin],

    computed: {
        ...mapState('child', ['children'])
    },

    mounted() {
        this.getChildren();
    },
}
</script>
