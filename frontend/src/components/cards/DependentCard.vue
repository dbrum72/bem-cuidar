<template>
    <div class="card dependent-card" role="group" aria-label="Dependent card">

        <!-- ação: botão no canto superior direito -->
        <div class="action-menu-wrapper">
            <button ref="menuBtn" class="action-btn" :aria-expanded="open.toString()"
                :aria-controls="'menu-' + dependent.id" aria-haspopup="true" @click="toggle"
                @keydown.down.prevent="focusFirstItem" @keydown.enter.prevent="toggle" @keydown.space.prevent="toggle">
                <i :class="['fa-solid', 'fa-ellipsis-vertical', 'action-menu-icon', { 'force-large': forceLargeIcon }]"
                    aria-hidden="true"></i>
                <span class="visually-hidden">Abrir menu de ações</span>
            </button>

            <!-- dropdown controlado por Vue (acessível) -->
            <transition name="menu-fade">
                <div v-if="open" :id="'menu-' + dependent.id" class="menu-panel" role="menu" ref="menuPanel"
                    @keydown.esc.prevent="close" @keydown.tab="onTab">
                    <ul class="menu-list" role="none">
                        <li role="none">
                            <router-link class="menu-item" :to="{ name: 'DependentShow', params: { id: dependent.id } }"
                                role="menuitem" @click="close">
                                <i class="fa-solid fa-eye me-2" aria-hidden="true"></i>
                                Visualizar
                            </router-link>
                        </li>

                        <li role="none">
                            <router-link class="menu-item" :to="{ name: 'DependentSave', params: { id: dependent.id } }"
                                role="menuitem" @click="close">
                                <i class="fa-solid fa-user-pen me-2" aria-hidden="true"></i>
                                Editar
                            </router-link>
                        </li>

                        <li role="none">
                            <router-link class="menu-item"
                                :to="{ name: 'RelationshipSave', params: { id: dependent.relationship_id } }"
                                role="menuitem" @click="close">
                                <i class="fa-solid fa-camera me-2" aria-hidden="true"></i>
                                Imagem
                            </router-link>
                        </li>

                        <li role="none">
                            <button type="button" class="menu-item danger border-0 w-100 text-start" role="menuitem"
                                @click="openRemoveModal">
                                <i class="fa-solid fa-trash-can me-2" aria-hidden="true"></i>
                                Excluir vínculo
                            </button>
                        </li>
                    </ul>
                </div>
            </transition>
        </div>

        <!-- FOTO -->
        <div class="photo-wrap" :title="dependent.name">
            <img :src="photoUrl" :alt="dependent.name" class="dependent-photo" loading="lazy" @error="onImgError" />
        </div>

        <!-- CONTEÚDO -->
        <div class="card-body text-center pb-3">
            <h5 class="card-title mb-1">{{ dependent.name }}</h5>
            <p class="card-text small text-muted mb-0">
                {{ formatDate(dependent.birth_date) }}
            </p>
        </div>

        <!-- Modal de confirmação -->
        <div class="modal fade" :id="`removeRelationshipModal-${dependent.id}`" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar exclusão</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        <p class="mb-0">
                            Tem certeza que deseja remover o vínculo de
                            <strong>{{ dependent.name }}</strong>?
                        </p>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            Cancelar
                        </button>

                        <button type="button" class="btn btn-outline-danger" @click="confirmRemoveRelationship">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { Modal } from "bootstrap";
import { mapActions } from "vuex";
import AbstractMixin from "@/mixins/AbstractMixin";

export default {
    name: "DependentCard",

    mixins: [AbstractMixin],

    props: {
        dependent: { type: Object, required: true },
        baseUrl: { type: String, required: true },
        forceLargeIcon: { type: Boolean, default: false },
    },

    data() {
        return {
            open: false,
            fallbackSet: false,
            modalInstance: null,
        };
    },

    computed: {
        photoUrl() {
            // retorna url completa ou fallback
            const p = this.dependent.photo;
            if (p && p !== "") return this.baseUrl + p;
            return "/public/img/default-dependent.png";
        },
    },

    mounted() {
        document.addEventListener("click", this.onOutsideClick);
        document.addEventListener("keydown", this.onGlobalKey);
    },

    beforeUnmount() {
        document.removeEventListener("click", this.onOutsideClick);
        document.removeEventListener("keydown", this.onGlobalKey);
    },
    
    methods: {
        ...mapActions("relationship", ["destroyRelationship"]),

        toggle() {
            this.open = !this.open;
            if (this.open) this.$nextTick(() => this.focusFirstItem());
        },

        close() {
            this.open = false;
            // devolve foco ao botão que abriu
            this.$nextTick(() => this.$refs.menuBtn && this.$refs.menuBtn.focus());
        },

        onOutsideClick(e) {
            const panel = this.$refs.menuPanel;
            const btn = this.$refs.menuBtn;
            if (!panel || !btn) return;
            if (panel.contains(e.target) || btn.contains(e.target)) return;
            if (this.open) this.close();
        },

        onGlobalKey(e) {
            // fechar com ESC em qualquer contexto (redundante com @keydown.esc no painel)
            if (e.key === "Escape" || e.key === "Esc") {
                if (this.open) this.close();
            }
        },

        focusFirstItem() {
            // foca o primeiro item do menu (se houver)
            this.$nextTick(() => {
                const panel = this.$refs.menuPanel;
                if (!panel) return;
                const first = panel.querySelector("[role='menuitem']");
                if (first) first.focus();
            });
        },

        onTab(e) {
            // se foco sai do painel, fechamos (comportamento mobile-friendly)
            const panel = this.$refs.menuPanel;
            if (!panel) return;
            // allow default tab handling but close after a tick if focus is outside
            this.$nextTick(() => {
                const active = document.activeElement;
                if (!panel.contains(active) && active !== this.$refs.menuBtn) {
                    this.close();
                }
            });
        },

        onImgError(e) {
            if (!this.fallbackSet) {
                e.target.src = "/public/img/default-dependent.png";
                this.fallbackSet = true;
            }
        },

        openRemoveModal() {
            this.close(); // fecha o menu antes
            const id = `removeRelationshipModal-${this.dependent.id}`;
            const el = document.getElementById(id);

            if (!this.modalInstance && el) {
                this.modalInstance = new Modal(el);
            }

            this.modalInstance?.show();
        },

        async confirmRemoveRelationship() {
            if (!this.dependent?.relationship_id) return;

            const success = await this.destroyRelationship(
                this.dependent.relationship_id
            );

            if (success) {
                this.modalInstance?.hide();
            }
        },
    },
};
</script>

<style scoped>
/* Container do card */
.dependent-card {
    position: relative;
    width: 100%;
    max-width: 260px;
    margin: 0 auto;
    border-radius: 12px;
    overflow: visible;
    -webkit-tap-highlight-color: transparent;
}

/* botão do menu (area de toque grande) */
.action-menu-wrapper {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 60;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 0;
    padding: 6px;
    /* base touch area */
    margin: 0;
    border-radius: 8px;
    min-width: 44px;
    min-height: 44px;
    /* garante área de toque 44x44 */
}

/* ícone */
.action-menu-icon {
    font-size: 1.25rem;
    line-height: 1;
    transition: transform .12s ease, background .12s ease;
    pointer-events: none;
    /* let button handle events */
}

.action-btn:active .action-menu-icon,
.action-btn:focus-visible .action-menu-icon {
    transform: translateY(-1px);
}

/* permitir força de ícone grande via prop */
.action-menu-icon.force-large {
    font-size: 1.8rem;
}

/* Foto */
.photo-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 22px;
    padding: 6px;
}

.dependent-photo {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 999px;
    border: 3px solid #f1f1f1;
    display: block;
}

/* Corpo do card */
.card-body {
    padding-top: 10px;
    padding-bottom: 12px;
}

.card-title {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.1;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* ------------------ Dropdown panel (controlled by Vue) ------------------ */
/* animação suave */
.menu-fade-enter-active,
.menu-fade-leave-active {
    transition: opacity .16s cubic-bezier(.2, .9, .2, 1), transform .16s cubic-bezier(.2, .9, .2, 1);
}

.menu-fade-enter-from,
.menu-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px) scale(.98);
}

.menu-fade-enter-to,
.menu-fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* Painel do menu*/
.menu-panel {
    position: absolute;
    top: calc(8px + 44px);
    /* desloca abaixo do botão para evitar sobreposição do touch */
    right: 8px;
    min-width: 160px;
    max-width: 92vw;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(10, 10, 10, 0.08);
    padding: 6px;
    z-index: 70;
    max-height: 56vh;
    /* evita que ocupe toda a tela no mobile */
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}

/* lista e itens */
.menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: .6rem;
    padding: 10px 12px;
    width: 100%;
    text-decoration: none;
    color: #111;
    background: transparent;
    border-radius: 8px;
    font-size: .95rem;
    line-height: 1;
}

/* aumenta área clicável (good for touch) */
.menu-item:focus,
.menu-item:hover {
    background: rgba(0, 0, 0, 0.04);
    outline: none;
}

/* destaque para ação de risco (excluir) */
.menu-item.danger {
    color: #b00020;
}

/* garante os ícones alinhados */
.menu-item i {
    width: 1.1rem;
    text-align: center;
}

/* ------------------ Responsividade Mobile ------------------ */
@media (max-width: 480px) {
    .dependent-card {
        max-width: 94%;
        margin-inline: auto;
    }

    .dependent-photo {
        width: 110px;
        height: 110px;
    }

    /* aumenta automaticamente o ícone para toque confortável */
    .action-menu-icon {
        font-size: 1.8rem;
    }

    .action-btn {
        min-width: 48px;
        min-height: 48px;
        padding: 8px;
    }

    .menu-panel {
        right: 6px;
        left: auto;
        top: calc(8px + 50px);
        min-width: 170px;
    }

    .menu-item {
        padding: 12px 14px;
        font-size: 1rem;
    }
}

/* small utility: screen-reader only */
.visually-hidden {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
}
</style>
