import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'saida-user'

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useUserStore = defineStore('user', () => {
  const storedUser = loadStoredUser()
  const isLoggedIn = ref(!!storedUser)
  const user = ref(storedUser)

  function login(userData) {
    isLoggedIn.value = true
    user.value = userData
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    } catch {
      // 忽略存储失败（隐私模式等）
    }
  }

  function logout() {
    isLoggedIn.value = false
    user.value = null
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // 忽略
    }
  }

  return { isLoggedIn, user, login, logout }
})
