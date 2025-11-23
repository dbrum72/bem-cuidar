<template>
    <HeaderBar />

    <div class="container mt-4">
        <h4 class="text-2xl font-semibold mb-6">
            {{ isEditing ? "Editar Relacionamento" : "Novo Relacionamento" }}
        </h4>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="row">
                <div class="col-12 mb-3">
                    <label class="text-sm font-medium">Tipo de vínculo</label>
                    <select v-model="form.relationship_type" class="input">
                        <option value="">Selecione...</option>
                        <option value="parent">Responsável</option>
                        <option value="guardian">Tutor legal</option>
                        <option value="other">Outro</option>
                    </select>
                </div>
            </div>

            <div class="row">
                <div class="col-12 mb-3">
                    <label class="text-sm font-medium mb-1">Foto</label>
                    <input type="file" accept="image/*" @change="onFileChange" class="input" />

                    <div v-if="preview" class="mt-2">
                        <img :src="preview" alt="Pré-visualização" class="w-32 h-32 object-cover rounded-lg border" />
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-end my-3">
                <button type="button" class="btn-secondary me-3" @click="$router.push({ name: 'DependentList' })">
                    Cancelar
                </button>

                <button type="submit" class="btn-primary" :disabled="isSaving">
                    {{ isSaving ? "Salvando..." : isEditing ? "Atualizar" : "Salvar" }}
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import DependentMixin from "@/mixins/DependentMixin";
import AuthMixin from "@/mixins/AuthMixin";
import HeaderBar from "@/components/bars/header-bar.vue";

export default {
    name: "DependentSave",

    components: { HeaderBar },

    mixins: [DependentMixin, AuthMixin],

    data() {
        return {
            form: {
                id: null,
                name: "",
                birth_date: "",
                photo: null,
                notes: "",
                relationship_type: "",
                created_by: null,
                status: "accepted", // tutor criador é aceito automaticamente
            },
            preview: null,
            isSaving: false,
            isEditing: false,
        };
    },

    async mounted() {
        const id = this.$route.params.id;

        if (id) {
            this.isEditing = true

            await this.getDependent(id)

            if (this.dependent) {
                this.form.id = this.dependent.id;
                this.form.name = this.dependent.name;
                this.form.birth_date = this.dependent.birth_date;
                this.form.photo = this.dependent.photo;
                this.form.notes = this.dependent.notes;
                this.form.relationship_type = this.dependent.tutors[0].pivot.relationship_type;
                if (this.dependent.photo)
                    this.preview = `${import.meta.env.VITE_BACKEND_FILES}/dependents/${this.dependent.photo}`;
            }
        }
    },

    computed: {
        ...mapState('dependent', ['dependent'])
    },


    methods: {
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
                await this.storeOrUpdate(this.form);
                this.$toast?.success("Dependente salvo com sucesso!");
                this.$router.push({ name: "DependentList" });
            }
            catch (error) {
                console.error("Erro ao salvar dependente:", error);
                this.$toast?.error("Erro ao salvar dependente.");
            }
            finally {
                this.isSaving = false;
            }
        },
    },
};
</script>

<style scoped>
.input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    outline: none;
    transition: all 0.2s;
}

.input:focus {
    border-color: #3b82f6;
}

.btn-primary {
    background-color: #2563eb;
    color: white;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s;
}

.btn-primary:hover {
    background-color: #1e40af;
}

.btn-secondary {
    background-color: #e5e7eb;
    color: #374151;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
}
</style>
