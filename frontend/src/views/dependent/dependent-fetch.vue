<template>

    <HeaderBar />

    <div class="d-flex justify-content-between px-3">
        <h2>Crianças</h2>
        <router-link :to="{ name: 'DependentSave' }">Adicionar</router-link>
    </div>
    <div v-if="dependents.length === 0">Nenhuma criança cadastrada</div>

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
                <tr v-for="i in dependents" :key="i.id" class="">
                    <td>{{ i.name }}</td>
                    <td>{{ formatDate(i.birth_date) }}</td>
                    <td>{{ i.notes }}</td>
                    <td>
                        <router-link :to="{ name: 'DependentShow', params: { id: i.id } }">
                            Visualizar
                        </router-link>
                        <router-link :to="{ name: 'DependentSave', params: { id: i.id } }">
                            Editar
                        </router-link>
                        <router-link class="" :to="{ name: 'DependentDelete', params: { id: i.id } }">
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
import DependentMixin from "@/mixins/DependentMixin.js";
import HeaderBar from "@/components/bars/header-bar.vue";

export default {

    name: "DependentFetch",

    components: { HeaderBar },

    mixins: [AbstractMixin, DependentMixin],

    computed: {
        ...mapState("dependent", ["dependents"]),
    },

    async mounted() {
        try {
            await this.getDependents();
        } catch (error) {
            console.error("Erro ao carregar dependentes:", error);
        }
    }
}
</script>
