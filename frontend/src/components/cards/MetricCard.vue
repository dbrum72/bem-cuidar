<template>
  <div
    class="card metric-card h-100 border-0 shadow-sm"
    role="region"
    :aria-label="`Métrica ${title}`"
  >
    <div class="card-body d-flex align-items-center justify-content-between p-3">
      <div class="d-flex flex-column">
        <p class="text-uppercase small text-muted fw-semibold mb-1" v-if="title">{{ title }}</p>

        <!-- Valor principal -->
        <div class="d-flex align-items-baseline gap-2">
          <h4 class="fw-bold mb-0" v-if="showValue">{{ displayValue }}</h4>
          <small class="text-muted" v-if="subtitle">{{ subtitle }}</small>
        </div>
      </div>

      <!-- Ícone (usa FontAwesome) -->
      <div class="ms-3 d-flex align-items-center justify-content-center">
        <i :class="icon" class="metric-icon" aria-hidden="true"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number, null],
      default: null
    },
    // ícone em classe (ex: 'fa-solid fa-hashtag')
    icon: {
      type: String,
      default: 'fa-solid fa-circle-info'
    },
    // texto menor ao lado do valor (opcional)
    subtitle: {
      type: String,
      default: ''
    },
    // controla exibição do valor (útil para skeletons/loads)
    showValue: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    displayValue() {
      // Exibição consistente: '-' quando não houver valor
      if (this.value === null || this.value === undefined || this.value === '') {
        return '-';
      }

      // Se for número grande, formata com separador de milhares
      if (typeof this.value === 'number') {
        return this.value.toLocaleString();
      }

      return String(this.value);
    }
  }
};
</script>

<style scoped>
.metric-card {
  transition: transform 0.15s ease, box-shadow 0.18s ease;
  border-radius: 0.75rem;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(13, 110, 253, 0.08); /* suave, cor principal do bootstrap */
}

.metric-icon {
  font-size: 1.9rem;
  opacity: 0.18;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Pequeno ajuste para tamanhos muito pequenos */
@media (max-width: 420px) {
  .metric-icon { font-size: 1.6rem; width: 40px; height: 40px; }
  .metric-card .card-body { padding: 0.75rem; }
}
</style>
