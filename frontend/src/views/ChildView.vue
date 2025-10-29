<template>
    <form @submit.prevent="saveChild">
        <input type="text" v-model="child.name" placeholder="Nome" required />
        <input type="date" v-model="child.birth_date" required />
        <textarea v-model="child.notes" placeholder="Notas"></textarea>
        <button type="submit">Salvar</button>
    </form>
</template>

<script>
export default {

    data() {        
        return {
            child: {}
        };
    },

    methods: {
        
        saveChild() {
            this.$store.dispatch('children/createChild', {
                ...this.child
            });
        }
    }
}
</script>
