<template>
  <div class="alerts-list">
    <AlertMessage v-for="alert in alerts" :key="alert.id" :alert="alert"/>
  </div>  
</template>
      
<script>
import { mapState } from "vuex";
import AlertMessage from "@/components/alerts/alert-message.vue"

export default {

  name: "AlertList",

  components: { AlertMessage },

  computed: mapState(['alerts', ['alerts']]),  
}
</script>

<style>
.alerts-list {
    position: fixed;
    display: flex;
    flex-flow: column nowrap;
    gap: 20px;
    top: 120px;
    right: 0px;
    z-index: 1000;
}
</style>