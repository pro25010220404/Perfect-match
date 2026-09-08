<template>
  <p class="auth-footer-link">
    {{ prefix }}
    <button type="button" class="auth-footer-link__action" @click="$emit('click')">
      {{ linkText }}
    </button>
  </p>
</template>

<script setup>
defineProps({
  prefix: { type: String, required: true },
  linkText: { type: String, required: true }
})

defineEmits(['click'])
</script>

<style scoped>
.auth-footer-link {
  text-align: center;
  font-size: 0.8125rem;
  color: var(--auth-text-muted);
  margin: 0 0 1.25rem;
}

.auth-footer-link__action {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: var(--auth-text);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.auth-footer-link__action:hover {
  opacity: 0.8;
}
</style>
