<template>
  <div class="page-wrapper">
    <nav class="navbar">
      <div class="container navbar-inner">
        <div class="navbar-brand">
          <span class="navbar-brand__mark" aria-hidden="true">
            <img
              class="navbar-brand__logo"
              :src="saidaLogo"
              alt=""
              width="40"
              height="38"
            />
          </span>
          <span class="navbar-brand__text">赛搭</span>
        </div>

        <ul class="navbar-nav">
          <li v-for="item in navItems" :key="item.to">
            <router-link
              :to="item.to"
              class="navbar-nav__link"
              :class="{ active: isActive(item.to) }"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>

        <div class="navbar-tools">
          <form class="navbar-search" @submit.prevent="handleSearch">
            <input
              v-model="searchQuery"
              type="search"
              class="navbar-search__input"
              placeholder="搜索团队、竞赛…"
              aria-label="搜索"
            />
            <button type="submit" class="navbar-search__btn" aria-label="搜索">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          <button
            type="button"
            class="navbar-user"
            aria-label="个人中心"
            @click="$router.push('/profile')"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
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
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import saidaLogo from '../assets/images/saida-highfive-logo.png'

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')

const navItems = [
  { label: '首页', to: '/' },
  { label: '团队广场', to: '/teams' },
  { label: '智能推荐', to: '/recommendations' },
  { label: '创建团队', to: '/create-team' },
  { label: '个人中心', to: '/profile' }
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

function handleSearch() {
  const q = searchQuery.value.trim()
  if (q) {
    router.push({ path: '/teams', query: { q } })
  }
}
</script>

<style scoped>
.navbar {
  --nav-blue: #5eb3e4;
  --nav-blue-dark: #3d9fd4;
  --nav-blue-soft: #7ec5ef;

  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.navbar-inner {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  height: 72px;
}

.navbar-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  margin-left: -0.75rem;
}

.navbar-brand__mark {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.navbar-brand__logo {
  display: block;
  width: 40px;
  height: auto;
}

.navbar-brand__text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--nav-blue-deep);
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 2.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
}

.navbar-nav__link {
  font-size: 1rem;
  font-weight: 500;
  color: var(--nav-blue-deep);
  text-decoration: none;
  transition: color 0.15s ease, opacity 0.15s ease;
  white-space: nowrap;
}

.navbar-nav__link:hover {
  color: var(--nav-blue-deeper);
}

.navbar-nav__link.active {
  color: var(--nav-blue-deeper);
  font-weight: 600;
}

.navbar-tools {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-search {
  position: relative;
  display: flex;
  align-items: center;
  width: 220px;
}

.navbar-search__input {
  width: 100%;
  height: 40px;
  padding: 0 2.75rem 0 1rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--gray-700);
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 9999px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.navbar-search__input::placeholder {
  color: #c4c4c4;
}

.navbar-search__input:focus {
  border-color: var(--nav-blue-soft);
  box-shadow: 0 0 0 3px rgba(94, 179, 228, 0.15);
}

.navbar-search__btn {
  position: absolute;
  right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: #b8b8b8;
  cursor: pointer;
  border-radius: 50%;
  transition: color 0.15s ease;
}

.navbar-search__btn:hover {
  color: var(--nav-blue-deep);
}

.navbar-user {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--nav-blue-deep);
  cursor: pointer;
  border-radius: 50%;
  transition: color 0.15s ease, background 0.15s ease;
}

.navbar-user:hover {
  color: var(--nav-blue-deeper);
  background: rgba(94, 179, 228, 0.1);
}

.footer {
  background: #ffffff;
  border-top: 1px solid #f0f0f0;
  padding: 2rem 0;
  margin-top: auto;
}

.footer p {
  text-align: center;
  color: var(--gray-400);
  font-size: 0.875rem;
}

@media (max-width: 1024px) {
  .navbar-nav {
    gap: 1.5rem;
  }

  .navbar-nav__link {
    font-size: 0.9375rem;
  }

  .navbar-search {
    width: 180px;
  }
}

@media (max-width: 768px) {
  .navbar-inner {
    height: 60px;
    gap: 1rem;
  }

  .navbar-nav {
    display: none;
  }

  .navbar-search {
    width: 140px;
  }

  .navbar-search__input {
    height: 36px;
    font-size: 0.8125rem;
  }
}
</style>
