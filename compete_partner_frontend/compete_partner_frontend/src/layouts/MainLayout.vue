<template>
  <div class="page-wrapper">
    <nav class="navbar">
      <div class="container navbar-inner">
        <router-link to="/" class="navbar-brand">
          <div class="logo">赛</div>
          <span class="brand-text">赛搭</span>
        </router-link>

        <ul class="navbar-nav">
          <li>
            <router-link to="/" :class="{ active: isActive('/') }">首页</router-link>
          </li>
          <li>
            <router-link to="/teams" :class="{ active: isActive('/teams') }">团队广场</router-link>
          </li>
          <li>
            <router-link to="/recommendations" :class="{ active: isActive('/recommendations') }">智能推荐</router-link>
          </li>
          <li>
            <router-link to="/profile" :class="{ active: isActive('/profile') }">个人中心</router-link>
          </li>
        </ul>

        <div class="navbar-right">
          <button class="notification-btn" @click="$router.push('/invitations')" aria-label="查看通知">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
          </button>

          <div class="navbar-user" @click="$router.push('/profile')">
            <div class="avatar">{{ userInitial }}</div>
            <span class="name">{{ userName }}</span>
          </div>

          <button class="logout-btn" @click="handleLogout" aria-label="退出登录">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <div class="container">
        <router-view />
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>© 2026 赛搭 - 竞赛组队平台 | 让每一次组队都更简单</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userName = ref('张三')
const userInitial = computed(() => userName.value.charAt(0))
const unreadCount = ref(2)

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background: #fff;
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-900);
  text-decoration: none;
  letter-spacing: -0.02em;
  transition: opacity var(--transition-fast);
}

.navbar-brand:hover {
  opacity: 0.85;
  color: var(--gray-900);
}

.logo {
  width: 36px;
  height: 36px;
  background: var(--primary-600);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

.brand-text {
  color: var(--gray-900);
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  list-style: none;
}

.navbar-nav a {
  padding: 0.5rem 0.875rem;
  color: var(--gray-600);
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background-color var(--transition-fast);
  position: relative;
}

.navbar-nav a:hover {
  color: var(--gray-900);
  background: var(--gray-100);
}

.navbar-nav a.active {
  color: var(--primary-600);
  background: transparent;
  font-weight: 600;
}

.navbar-nav a.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1.25rem;
  height: 2px;
  background: var(--primary-600);
  border-radius: 1px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notification-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--gray-600);
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.notification-btn:hover {
  background: var(--gray-50);
  color: var(--gray-900);
  border-color: var(--gray-300);
}

.notification-btn .badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: var(--primary-600);
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.625rem 0.25rem 0.25rem;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  border: 1px solid transparent;
}

.navbar-user:hover {
  background: var(--gray-100);
}

.logout-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--gray-500);
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.logout-btn:hover {
  background: var(--danger-50);
  color: var(--danger-600);
  border-color: var(--gray-300);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--gray-800);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8125rem;
}

.name {
  font-weight: 600;
  color: var(--gray-800);
  font-size: 0.9375rem;
}

.footer {
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
  padding: 1.5rem 0;
  margin-top: auto;
}

.footer p {
  text-align: center;
  color: var(--gray-500);
  font-size: 0.8125rem;
}

@media (max-width: 768px) {
  .navbar-nav {
    display: none;
  }

  .name {
    display: none;
  }
}
</style>
