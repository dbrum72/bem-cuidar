<template>
    <HeaderBar />

    <div class="container mt-4">
        <h4 class="text-2xl font-semibold mb-6">
            {{ isEditing ? "Editar Dependente" : "Novo Dependente" }}
        </h4>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="row">
                <div class="col-sm-12 col-lg-8 mb-3">
                    <label class="form-label">Nome completo</label>
                    <input v-model="form.name" type="text" class="form-control"
                        placeholder="Digite o nome do dependente" required />
                </div>

                <div class="col-sm-12 col-lg-4 mb-3">
                    <label class="form-label">Data de nascimento</label>
                    <input v-model="form.birth_date" type="date" class="form-control" required />
                </div>
            </div>

            <div class="row">
                <div class="col-sm-12 col-lg-4 mb-3">
                    <label class="form-label">Documento (Nº)</label>
                    <input v-model="form.document_number" type="text" class="form-control" placeholder="Nº do documento"
                        required />
                </div>

                <div class="col-sm-12 col-lg-4 mb-3">
                    <label class="form-label">Documento (Tipo)</label>
                    <select v-model="form.document_type" class="form-select" aria-label="Default select example">
                        <option value="" selected disabled>selecione...</option>
                        <option value="RG">RG</option>
                        <option value="CPF">CPF</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>

                <div class="col-sm-12 col-lg-4 mb-3">
                    <label class="form-label">Tipo de vínculo</label>
                    <select v-model="form.relationship_type" class="form-select">
                        <option value="" selected disabled>selecione...</option>
                        <!-- Vínculo Legal -->
                        <option value="pai_mae">Pai / Mãe (poder familiar)</option>
                        <option value="tutor">Tutor</option>
                        <option value="curador">Curador</option>
                        <option value="responsavel_legal">Responsável legal</option>

                        <!-- Vínculo Familiar ou Afetivo -->
                        <option value="parente">Parente (cuidado informal)</option>
                        <option value="socioafetivo">Responsável socioafetivo</option>

                        <!-- Vínculo Contratual -->
                        <option value="cuidador_profissional">Cuidador profissional</option>
                        <option value="enfermeiro">Enfermeiro / Técnico de enfermagem</option>
                        <option value="instituicao_abrigo">Instituição de acolhimento / ILPI</option>

                        <!-- Vínculo Profissional ou de Serviço -->
                        <option value="profissional_saude">Profissional de saúde</option>
                        <option value="assistente_social">Assistente social</option>
                        <option value="professor_responsavel">Professor / Escola responsável</option>

                        <!-- Vínculo Administrativo -->
                        <option value="agente_publico">Agente público responsável</option>
                    </select>
                </div>
            </div>

            <div class="row">
                <div class="col-12 mb-3">
                    <label class="form-label">Observações</label>
                    <textarea v-model="form.notes" class="form-control"
                        placeholder="Observações gerais sobre o dependente" rows="3"></textarea>
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
import { mapState, mapActions } from 'vuex';
import HeaderBar from "@/components/bars/header-bar.vue";

export default {
    name: "DependentSave",

    components: { HeaderBar },

    data() {
        return {
            form: {
                id: null,
                name: "",
                birth_date: "",
                document_type: "",
                document_number: "",
                relationship_type: "",
                notes: "",
                status: "accepted", // tutor criador é aceito automaticamente
            },
            isSaving: false,
            isEditing: false,
        };
    },

    computed: {
        ...mapState('dependent', ['dependent'])
    },


    methods: {

        ...mapActions('dependent', ['addOrUpdate', 'getDependent']),

        async handleSubmit() {
            this.isSaving = true;

            try {
                await this.addOrUpdate(this.form);
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

    async mounted() {
        const id = this.$route.params.id;

        if (id) {
            this.isEditing = true

            await this.getDependent(id)

            if (this.dependent) {
                this.form.id = this.dependent.id;
                this.form.name = this.dependent.name;
                this.form.document_type = this.dependent.document_type;
                this.form.document_number = this.dependent.document_number;
                this.form.birth_date = this.dependent.birth_date;
                this.form.notes = this.dependent.notes;
                const tutorRel = this.dependent?.tutors?.[0]?.pivot?.relationship_type;
                this.form.relationship_type = tutorRel ?? "";
            }
        }
    },
};
</script>

<style scoped></style>
