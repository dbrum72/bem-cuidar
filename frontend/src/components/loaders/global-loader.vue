<template>
    <transition name="fade">
        <div v-if="active" class="loader-overlay">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "GlobalLoader",

    computed: {
        ...mapState("loader", ["active"]),
    },
};
</script>

<style scoped>
.loader-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 2000;

    display: flex;
    align-items: center;
    justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
