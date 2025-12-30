<template>

    <div v-for="alert in alerts" :key="alert.id" class="alert d-flex align-items-center fade show"
        :class="`alert-${alert.type}`" role="alert">
        <i :class="alert.icon.name" :style="`font-size: 1.5rem; color: ${alert.icon.color};`"></i>&nbsp;&nbsp;
        <div>{{ alert.message }}</div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "GlobalAlerts",

    computed: {
        ...mapGetters("alerts", {
            alerts: "all"
        })
    },

    methods: {
        ...mapActions("alerts", ["remove"])
    },

    watch: {
        alerts: {
            handler(alerts) {
                alerts.forEach(alert => {
                    if (alert.timeout) {
                        setTimeout(() => {
                            this.remove(alert.id);
                        }, alert.timeout);
                    }
                });
            },
            deep: true
        }
    }
};
</script>

<style scoped>
.global-alerts {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1055;
    /* acima de modals 
    width: 100%;
    max-width: 420px;*/
}
</style>
