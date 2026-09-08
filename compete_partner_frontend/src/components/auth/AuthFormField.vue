<template>
  <div class="auth-form-field">
    <label :for="inputId" class="auth-form-field__label">{{ label }}</label>
    <input
      :id="inputId"
      class="auth-form-field__input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  autocomplete: { type: String, default: undefined },
  id: { type: String, default: undefined }
})

defineEmits(['update:modelValue'])

const inputId = computed(() => props.id || `auth-field-${props.label.replace(/\s+/g, '-').toLowerCase()}`)
</script>

<style scoped>
.auth-form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
}

.auth-form-field__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--auth-text);
}

.auth-form-field__input {
  width: 100%;
  padding: 0.75rem 0.875rem;
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--auth-text);
  background: #fff;
  border: 1px solid var(--auth-border);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.auth-form-field__input::placeholder {
  color: var(--auth-text-muted);
}

.auth-form-field__input:focus {
  border-color: var(--gray-400);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.04);
}
</style>
