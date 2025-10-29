<template>
  <div>
    <h3>Notificações</h3>
    <div v-for="n in notifications" :key="n.id" :class="{'read': n.read_at}">
      <p>{{ n.message }}</p>
      <button v-if="!n.read_at" @click="markRead(n.id)">Marcar como lida</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('notifications', ['notifications'])
  },
  methods: {
    markRead(id) {
      this.$store.dispatch('notifications/markRead', id);
    }
  },
  created() {
    this.$store.dispatch('notifications/fetchNotifications');
  }
}
</script>

<style scoped>
.read {
  background-color: #e0e0e0;
}
div {
  margin-bottom: 8px;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  margin-top: 4px;
}
</style>
