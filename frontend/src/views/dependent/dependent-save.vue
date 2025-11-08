<template>
    <HeaderBar />

    <form @submit.prevent="save">
        <input type="text" v-model="form.name" placeholder="Nome" required />
        <input type="date" v-model="form.birth_date" required />
        <textarea v-model="form.notes" placeholder="Notas"></textarea>
        <button type="button" @click="cancelSave">Cancelar</button>
        <button type="submit">Salvar</button>
    </form>
</template>

<script>
import AbstractMixin from '@/mixins/AbstractMixin'
import DependentMixin from '@/mixins/DependentMixin'
import HeaderBar from "@/components/bars/header-bar.vue"

export default {

    name: "DependentSave",

    components: { HeaderBar },

    mixins: [AbstractMixin, DependentMixin],

    data() {
        return {
            form: {},
            isEditing: false
        };
    },

    methods: {

        async save() {

            if (this.isEditing) {
                await this.updateDependent(this.form)
            } else {
                await this.storeDependent(this.form)
            }
        },

        cancelSave() {
            this.$router.push({ name: 'DependentList' })
        }
    },

    async mounted() {
        const id = this.$route.params.id;
        if (id) {
            this.isEditing = true
            await this.getDependent(id)
            this.form = { ...this.$store.state.dependent.dependent }
        }
    }
}

</script>
