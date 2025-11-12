<template>
    <div class="dependent-save max-w-2xl mx-auto">
        <h2 class="text-2xl font-semibold mb-6">
            {{ isEditing ? "Editar Dependente" : "Novo Dependente" }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-1">Nome completo</label>
                <input v-model="form.name" type="text" class="input" placeholder="Digite o nome do dependente"
                    required />
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Data de nascimento</label>
                <input v-model="form.birth_date" type="date" class="input" required />
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Tipo de vínculo</label>
                <select v-model="form.relationship_type" class="input">
                    <option value="">Selecione...</option>
                    <option value="parent">Responsável</option>
                    <option value="guardian">Tutor legal</option>
                    <option value="other">Outro</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Observações</label>
                <textarea v-model="form.notes" class="input" placeholder="Observações gerais sobre o dependente"
                    rows="3"></textarea>
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Foto</label>
                <input type="file" accept="image/*" @change="handleFileUpload" class="input" />

                <div v-if="preview" class="mt-2">
                    <img :src="preview" alt="Pré-visualização" class="w-32 h-32 object-cover rounded-lg border" />
                </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
                <button type="button" class="btn-secondary" @click="$router.push({ name: 'DependentList' })">
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

export default {
    name: "DependentSave",

    mixins: [DependentMixin, AuthMixin],

    data() {
        return {
            form: {
                id: null,
                name: "",
                birth_date: "",
                notes: "",
                relationship_type: "",
                photo: null,
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
            let response = await this.getDependent(id)
            if (this.dependent) {
                this.form = this.dependent
                if (this.dependent.photo_url) this.preview = this.dependent.photo_url;
            }

        }
    },

    computed: {
        ...mapState('dependent', ['dependent'])
    },


    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.form.photo = file;
                this.preview = URL.createObjectURL(file);
            }
        },

        async handleSubmit() {
            this.isSaving = true;

            try {
                const formData = new FormData();

                if (this.isEditing) {
                    await this.updateDependent(this.form);
                } else {
                    await this.storeDependent(this.form);
                }

                this.$toast?.success("Dependente salvo com sucesso!");
                this.$router.push({ name: "DependentList" });
            } catch (error) {
                console.error("Erro ao salvar dependente:", error);
                this.$toast?.error("Erro ao salvar dependente.");
            } finally {
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
