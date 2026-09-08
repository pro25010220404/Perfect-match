<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal-box">
          <div class="modal-header">
            <h3 class="modal-title">申请加入团队</h3>
            <button class="modal-close-btn" @click="close"><LineIcon name="x" :size="16" /></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label required">选择角色</label>
              <select v-model="form.selectedRole" class="form-select">
                <option value="" disabled>请选择申请角色</option>
                <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">申请留言</label>
              <textarea v-model="form.message" class="form-textarea" rows="4"
                        placeholder="介绍一下你自己，为什么想加入这个团队..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="close">取消</button>
            <button class="btn btn-primary" @click="submit" :disabled="!form.selectedRole">
              提交申请
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, watch } from 'vue'
import LineIcon from '../LineIcon.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  roles: { type: Array, default: () => [] },
  initialRole: { type: String, default: '' }
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  selectedRole: '',
  message: ''
})

// 打开弹窗时重置表单（可预选角色）
watch(() => props.visible, (val) => {
  if (val) {
    form.selectedRole = props.initialRole
    form.message = ''
  }
})

function close() {
  emit('close')
}

function submit() {
  if (!form.selectedRole) return
  emit('submit', { selectedRole: form.selectedRole, message: form.message })
}
</script>

<style scoped>
/* 按钮 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  font-family: var(--font-body);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-500);
  border: 1px solid var(--gray-200);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--gray-200);
  color: var(--gray-700);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--nav-blue-deep);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--nav-blue-deeper);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal-backdrop);
  padding: 1rem;
}

.modal-box {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--gray-200);
}

.modal-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-900);
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
  border: none;
  border-radius: 50%;
  color: var(--gray-500);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.modal-close-btn:hover {
  background: var(--gray-200);
  color: var(--gray-700);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-700);
}

.form-label.required::after {
  content: ' *';
  color: var(--danger-500);
}

.form-select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.9375rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  background: white;
  color: var(--gray-800);
  transition: all var(--transition-fast);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

.form-select:focus {
  outline: none;
  border-color: var(--nav-blue);
  box-shadow: 0 0 0 3px var(--nav-blue-100);
}

.form-textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.9375rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  background: white;
  color: var(--gray-800);
  resize: vertical;
  min-height: 96px;
  line-height: 1.55;
  transition: all var(--transition-fast);
  font-family: var(--font-body);
}

.form-textarea:focus {
  outline: none;
  border-color: var(--nav-blue);
  box-shadow: 0 0 0 3px var(--nav-blue-100);
}

.form-textarea::placeholder {
  color: var(--gray-400);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
}

/* 弹窗动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-active .modal-box,
.modal-fade-leave-active .modal-box {
  transition: transform 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-box {
  transform: scale(0.95) translateY(10px);
}

.modal-fade-leave-to .modal-box {
  transform: scale(0.95) translateY(10px);
}
</style>
