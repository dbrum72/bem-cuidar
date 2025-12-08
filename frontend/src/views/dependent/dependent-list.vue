<template>
    <HeaderBar />

    <div class="container-lg mt-4">

        <div class="d-flex justify-content-between">
            <h4>Dependentes</h4>
            <router-link :to="{ name: 'DependentSave' }">Adicionar</router-link>
        </div>

        <div v-if="dependents.length === 0" class="mt-4">
            Nenhum dependente cadastrado.
        </div>

        <div v-else class="d-flex justify-content-center gap-3 mt-4 flex-wrap">
            <DependentCard
                v-for="d in dependents"
                :key="d.id"
                :dependent="d"
                :baseUrl="url_photo"
            />
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AbstractMixin from "@/mixins/AbstractMixin";
import HeaderBar from "@/components/bars/header-bar.vue";
import DependentCard from "@/components/cards/DependentCard.vue";

export default {
    name: "DependentFetch",

    components: { HeaderBar, DependentCard },

    mixins: [AbstractMixin],

    data() {
        return {
            url_photo: import.meta.env.VITE_BACKEND_FILES + "/dependents/",
        };
    },

    computed: {
        ...mapState("dependent", ["dependents"]),
    },

    methods: {
        ...mapActions("dependent", ["getDependents"]),
    },

    async mounted() {
        await this.getDependents({
            filter: null,
            extendedFilter: null,
            relationship: null,
            sort: null,
        });
    },
};
</script>
