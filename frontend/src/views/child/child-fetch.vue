<template>

    <HeaderBar />

    <div class="d-flex justify-content-between px-3">
        <h2>Crianças</h2>
        <router-link :to="{ name: 'ChildSave' }">Adicionar</router-link>
    </div>
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
                <tr v-for="i in children" :key="i.id" class="">
                    <td>{{ i.name }}</td>
                    <td>{{ i.birth_date }}</td>
                    <td>{{ i.notes }}</td>
                    <td>
                        <router-link :to="{ name: 'ChildShow', params: { id: i.id } }">
                            Visualizar
                        </router-link>
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
import AbstractMixin from '@/mixins/AbstractMixin.js';
import ChildMixin from "@/mixins/ChildMixin.js";
import HeaderBar from "@/components/bars/header-bar.vue";

export default {

    name: "ChildFetch",

    components: { HeaderBar },

    mixins: [AbstractMixin, ChildMixin],

    computed: {
        ...mapState("child", ["children"]),
    },

    async mounted() {
        try {
            await this.getChildren();
        } catch (error) {
            console.error("Erro ao carregar crianças:", error);
        }
    }
}
</script>
