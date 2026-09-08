<template>
  <button
    class="auth-primary-btn"
    :type="type"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="auth-primary-btn__loading" aria-hidden="true"></span>
    <slot v-else />
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'submit' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})
</script>

<style scoped>
.auth-primary-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: inherit;
  color: #fff;
  background: var(--auth-btn-primary);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease, opacity 0.15s ease;
  margin-bottom: 1rem;
}

.auth-primary-btn__loading {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: auth-spin 0.6s linear infinite;
}

@keyframes auth-spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-primary-btn:hover:not(:disabled) {
  background: var(--auth-btn-primary-hover);
}

.auth-primary-btn:active:not(:disabled) {
  transform: scale(0.99);
}

.auth-primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
