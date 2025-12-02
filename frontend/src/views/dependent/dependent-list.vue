<template>
    <HeaderBar />

    <div class="container-lg mt-4">

        <div class="d-flex justify-content-between">
            <h4>Dependentes</h4>
            <router-link :to="{ name: 'DependentSave' }">Adicionar</router-link>
        </div>

        <!-- SEM DADOS -->
        <div v-if="dependents.length === 0" class="mt-4">
            Nenhum dependente cadastrado.
        </div>

        <!-- LISTA -->
        <div v-else class="d-flex justify-content-center gap-3 mt-4 flex-wrap">

            <div class="card" v-for="dependent in dependents" :key="dependent.id">
                <img
                    :src="dependent.photo_url || '/public/img/default-dependent.png'"
                    class="card-img-top"
                    style="width: 10rem"
                    :alt="dependent.name"
                />

                <div class="card-body">
                    <h5 class="card-title text-center">{{ dependent.name }}</h5>
                    <p class="card-text text-center">
                        {{ formatDate(dependent.birth_date) }}
                    </p>

                    <div class="d-flex justify-content-center gap-3">

                        <router-link :to="{ name: 'DependentShow', params: { id: dependent.id } }">
                            <i class="fa-solid fa-eye" style="color: green;" />
                        </router-link>

                        <router-link :to="{ name: 'DependentSave', params: { id: dependent.id } }">
                            <i class="fa-solid fa-user-pen" style="color: blue;" />
                        </router-link>

                        <router-link :to="{ name: 'RelationshipSave', params: { id: dependent.relationship_id } }">
                            <i class="fa-solid fa-link" style="color: #0d6dfb;" />
                        </router-link>

                        <router-link :to="{ name: 'DependentDelete', params: { id: dependent.id } }">
                            <i class="fa-solid fa-trash-can" style="color: red;" />
                        </router-link>

                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AbstractMixin from "@/mixins/AbstractMixin";
import HeaderBar from "@/components/bars/header-bar.vue";

export default {
    name: "DependentFetch",

    components: { HeaderBar },

    mixins: [AbstractMixin],

    computed: {
        ...mapState("dependent", ["dependents"]),
    },

    methods: {
        ...mapActions("dependent", ["getDependents"]),

        getPivotId(dependent) {
        return dependent?.tutors?.[0]?.pivot?.id ?? null;
    }
    },

    mounted() {
        this.getDependents({
            filter: null,
            extendedFilter: null,
            relationship: null,
            sort: null,
        });
    },
};
</script>
