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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  box-shadow: var(--shadow-xs);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.navbar-brand:hover {
  opacity: 0.8;
  color: var(--gray-900);
}

.logo {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--accent-600) 100%);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.125rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.brand-text {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--accent-600) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
}

.navbar-nav a {
  padding: 0.625rem 1.125rem;
  color: var(--gray-500);
  font-weight: 500;
  font-size: 0.9375rem;
  border-radius: var(--radius-md);
  transition: color var(--transition-fast), background-color var(--transition-fast);
  position: relative;
}

.navbar-nav a:hover {
  color: var(--primary-600);
  background: var(--primary-50);
}

.navbar-nav a.active {
  color: var(--primary-600);
  background: var(--primary-50);
  font-weight: 600;
}

.navbar-nav a.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-600), var(--accent-600));
  border-radius: 2px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notification-btn {
  position: relative;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  color: var(--gray-600);
  transition: background-color var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
}

.notification-btn:hover {
  background: var(--gray-200);
  color: var(--gray-800);
  transform: scale(1.05);
}

.notification-btn .badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: linear-gradient(135deg, var(--danger-500), #DC2626);
  color: white;
  font-size: 0.6875rem;
  font-weight: 700;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.375rem 0.875rem 0.375rem 0.375rem;
  background: var(--gray-100);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
  border: 2px solid transparent;
}

.navbar-user:hover {
  background: var(--gray-200);
  border-color: var(--primary-200);
}

.logout-btn {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  color: var(--gray-500);
  transition: background-color var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
}

.logout-btn:hover {
  background: var(--danger-50);
  color: var(--danger-500);
  transform: scale(1.05);
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--accent-500) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}

.name {
  font-weight: 600;
  color: var(--gray-800);
  font-size: 0.9375rem;
}

.footer {
  background: white;
  border-top: 1px solid var(--gray-200);
  padding: 2rem 0;
  margin-top: auto;
}

.footer p {
  text-align: center;
  color: var(--gray-400);
  font-size: 0.875rem;
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
