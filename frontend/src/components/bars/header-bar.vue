<template>
  <header class="header-bar">
    <nav v-if="isAuthenticated" class="nav-bar">
      <router-link :to="{ name: 'DashboardView' }">Dashboard</router-link>
      <router-link :to="{ name: 'DependentList' }">Dependentes</router-link>
      <router-link :to="{ name: 'AppointmentList' }">Agendamentos</router-link>

      <button @click="performLogout()" class="logout-btn">Sair</button>
    </nav>

    <div v-else class="login-container">
      <router-link to="/login" class="login-btn">Login</router-link>
    </div>
  </header>
</template>

<script>
import AuthMixin from '@/mixins/AuthMixin'

export default {

  name: "HeaderBar",

  mixins: [AuthMixin],

  computed: {    
    isAuthenticated() {
      return !!this.getToken();
    }
  },

  methods: {
    performLogout() {
      this.logout();
    }
  }
}
</script>

<style scoped>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
}

.nav-bar {
  display: flex;
  gap: 20px;
  align-items: center;
}

.logout-btn,
.login-btn {
  background-color: #e74c3c;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  text-decoration: none;
}

.login-container {
  text-align: right;
}

.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
