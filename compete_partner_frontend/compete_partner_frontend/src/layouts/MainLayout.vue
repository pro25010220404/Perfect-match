<template>
  <el-container class="layout-page">
    <el-header class="layout-header" height="60px">
      <div class="container header-inner">
        <router-link to="/" class="brand-link">
          <el-avatar :size="36" shape="square" class="brand-logo">赛</el-avatar>
          <span class="brand-text">赛搭</span>
        </router-link>

        <el-menu
          :key="activeMenu"
          mode="horizontal"
          :router="true"
          :ellipsis="false"
          :default-active="activeMenu"
          class="nav-menu"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/teams">团队广场</el-menu-item>
          <el-menu-item index="/recommendations">智能推荐</el-menu-item>
          <el-menu-item index="/profile">个人中心</el-menu-item>
        </el-menu>

        <div class="header-actions">
          <el-badge :value="unreadCount" :hidden="unreadCount <= 0" class="notify-badge">
            <el-button circle @click="router.push('/invitations')" aria-label="查看通知">
              <el-icon><Bell /></el-icon>
            </el-button>
          </el-badge>

          <el-button text bg class="user-btn" @click="router.push('/profile')">
            <el-avatar :size="32" class="user-avatar">{{ userInitial }}</el-avatar>
            <span class="user-name">{{ userName }}</span>
          </el-button>

          <el-tooltip content="退出登录" placement="bottom">
            <el-button circle @click="handleLogout" aria-label="退出登录">
              <el-icon><SwitchButton /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </el-header>

    <el-main class="layout-main">
      <div class="container">
        <router-view />
      </div>
    </el-main>

    <el-footer class="layout-footer" height="auto">
      <div class="container">
        <el-text type="info" size="small" class="footer-text">
          © 2026 赛搭 - 竞赛组队平台 | 让每一次组队都更简单
        </el-text>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Bell, SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userName = ref('张三')
const userInitial = computed(() => userName.value.charAt(0))
const unreadCount = ref(2)

const activeMenu = computed(() => {
  const p = route.path
  if (p === '/') return '/'
  if (p.startsWith('/teams')) return '/teams'
  if (p.startsWith('/recommendations')) return '/recommendations'
  if (p.startsWith('/profile')) return '/profile'
  return p
})

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout-page {
  min-height: 100vh;
}

.layout-header {
  padding: 0;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  color: var(--el-text-color-primary);
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}

.brand-link:hover {
  opacity: 0.88;
}

.brand-logo {
  background-color: var(--el-color-primary) !important;
  color: #fff;
  font-weight: 700;
}

.nav-menu {
  flex: 1;
  justify-content: center;
  border-bottom: none !important;
  min-width: 0;
}

.nav-menu :deep(.el-menu-item) {
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.notify-badge :deep(.el-badge__content) {
  border: none;
}

.user-btn {
  max-width: 160px;
}

.user-avatar {
  background-color: var(--el-fill-color-dark);
  color: #fff;
  font-weight: 600;
}

.user-name {
  margin-left: 0.5rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.layout-main {
  --el-main-padding: 1.75rem 0;
  flex: 1;
  background: var(--el-bg-color-page);
}

.layout-footer {
  padding: 1.25rem 0;
  border-top: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-blank);
}

.footer-text {
  display: block;
  text-align: center;
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .user-name {
    display: none;
  }
}
</style>
