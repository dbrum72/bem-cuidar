<template>

    <HeaderBar />
    <div class="container-lg mt-4">
        <div class="d-flex justify-content-between">
            <h4>Dependentes</h4>
            <router-link :to="{ name: 'DependentSave' }">Adicionar</router-link>
        </div>

        <div v-if="dependents.length === 0">Nenhum dependente cadastrado.</div>

        <div v-else class="d-flex justify-content-center gap-3 mt-4">
            <div class="card" v-for="i in dependents" :key="i.id">
                <img :src="(i.photo_url || '/public/img/default-dependent.png')" class="card-img-top"
                    style="width: 10rem" :alt="i.name">
                <div class="card-body">
                    <h5 class="card-title text-center">{{ i.name }}</h5>
                    <p class="card-text text-center">{{ formatDate(i.birth_date) }}</p>
                    <div class="d-flex justify-content-center gap-3">
                        <router-link :to="{ name: 'DependentShow', params: { id: i.id } }">
                            <i class="fa-solid fa-eye" style="color: green;" alt="Visualizar" />
                        </router-link>
                        <router-link :to="{ name: 'DependentSave', params: { id: i.id } }">
                            <i class="fa-solid fa-user-pen" style="color: blue;" alt="Editar" />
                        </router-link>
                        <router-link class="" :to="{ name: 'DependentDelete', params: { id: i.id } }">
                            <i class="fa-solid fa-trash-can" style="color: red;"></i>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
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
