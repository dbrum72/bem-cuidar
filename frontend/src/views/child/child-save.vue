<template>
    <form @submit.prevent="saveChild">
        <input type="text" v-model="form.name" placeholder="Nome" required />
        <input type="date" v-model="form.birth_date" required />
        <textarea v-model="form.notes" placeholder="Notas"></textarea>
        <button type="submit">Salvar</button>
    </form>
</template>

<script>
import AbstractMixin from '@/mixins/AbstractMixin'
import ChildMixin from '@/mixins/ChildMixin'

export default {

    name: "ChildSave",

    mixins: [AbstractMixin, ChildMixin],

    data() {
        return {
            form: {},
            isEditing: false
        };
    },

    methods: {

        async saveChild() {

            if (this.isEditing) {
                await this.updateChild(this.form)
            } else {
                await this.storeChild(this.form)
            }
        },

        cancelSave() {
            this.$router.push({ name: 'Children' })
        }
    },

    async mounted() {
        const id = this.$route.params.id;
        if (id) {
            this.isEditing = true
            await this.getChild(id)
            this.form = { ...this.$store.state.child.child }
        }
    }
}

</script>
