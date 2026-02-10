<template>

    <div class="d-flex justify-content-between">
        <h4>Dependentes</h4>
        <div>
            <router-link :to="{ name: 'DependentSave' }" class="me-3">Adicionar</router-link>
            <router-link :to="{ name: 'TutorInvite' }">Convidar tutor</router-link>
        </div>

    </div>

    <div v-if="dependents.length === 0" class="mt-4">
        Nenhum dependente cadastrado.
    </div>

    <div v-else class="d-flex justify-content-center gap-3 mt-4 flex-wrap">
        <DependentCard v-for="d in dependents" :key="d.id" :dependent="d" :baseUrl="url_photo" />
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AbstractMixin from "@/mixins/AbstractMixin";
import DependentCard from "@/components/cards/DependentCard.vue";

export default {
    name: "DependentFetch",

    components: { DependentCard },

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
