<template>

    <div class="container mt-4">
        <h4 class="text-2xl font-semibold mb-6">
            {{ isEditing ? "Editar Relacionamento" : "Novo Relacionamento" }}
        </h4>

        <form @submit.prevent="handleSubmit" class="space-y-4">

            <div class="row">
                <div class="col-12 mb-3">
                    <label class="form-label">Foto</label>
                    <input type="file" class="form-control" accept="image/*" @change="onFileChange" />

                    <div v-if="preview" class="mt-2">
                        <img :src="preview" alt="Pré-visualização" class="w-32 h-32 object-cover rounded-lg border" />
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-end my-3">
                <button type="button" class="btn btn-secondary me-3" @click="$router.push({ name: 'DependentList' })">
                    Cancelar
                </button>

                <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    {{ isSaving ? "Salvando..." : isEditing ? "Atualizar" : "Salvar" }}
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapState, mapActions} from 'vuex';
import HeaderBar from "@/components/bars/header-bar.vue";

export default {
    name: "RelationshipSave",

    components: { HeaderBar },

    data() {
        return {
            form: {
                id: null,
                photo: null
            },
            preview: null,
            isSaving: false,
            isEditing: false,
        };
    },

    computed: {
        ...mapState('relationship', ['relationship'])
    },


    methods: {
        ...mapActions('relationship', ['saveOrUpdate', 'getRelationship']),

        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.form.photo = file;
                this.preview = URL.createObjectURL(file);
            }
        },

        async handleSubmit() {
            this.isSaving = true;

            try {
                await this.saveOrUpdate(this.form);
                this.$toast?.success("Registro salvo com sucesso!");
                this.$router.push({ name: "DependentList" });
            }
            catch (error) {
                console.error("Erro ao salvar registro:", error);
                this.$toast?.error("Erro ao salvar registro.");
            }
            finally {
                this.isSaving = false;
            }
        },
    },

    async mounted() {        
        const id = this.$route.params.id;

        if (id) {
            this.isEditing = true

            await this.getRelationship(id)

            if (this.relationship) {
                this.form.id = this.relationship.id;
                this.form.photo = this.relationship.photo;
                if (this.relationship.photo)
                    this.preview = `${import.meta.env.VITE_BACKEND_FILES}/dependents/${this.relationship.photo}`;
            }
        }
    },
};
</script>
