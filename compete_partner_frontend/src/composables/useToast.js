import { reactive } from 'vue'

const toasts = reactive([])
let id = 0

export function useToast() {
  function toast(message, type = 'info') {
    const item = { id: ++id, message, type }
    toasts.push(item)
    setTimeout(() => {
      const index = toasts.findIndex((t) => t.id === item.id)
      if (index !== -1) toasts.splice(index, 1)
    }, 2600)
  }

  return { toasts, toast }
}
