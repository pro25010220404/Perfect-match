<template>
  <AuthPageLayout>
    <div class="library-login">
      <header class="library-login__brand">
        <button
          type="button"
          class="library-logo-btn"
          :class="{ 'library-logo-btn--paused': !logoSpinning }"
          :aria-label="logoSpinning ? '点击暂停图标旋转' : '点击开始图标旋转'"
          @click="logoSpinning = !logoSpinning"
        >
          <img
            class="library-logo"
            :src="saidaTeamLogo"
            alt=""
            width="120"
            height="120"
          />
        </button>
        <p class="library-login__tagline">Powered by 赛搭</p>
      </header>

      <main class="library-login__main">
        <h1 class="library-hero">
          <span class="library-hero__line">一站式竞赛组队平台</span>
          <span class="library-hero__line library-hero__line--accent">
            <span class="library-hero__book" aria-hidden="true">
              <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
                <rect x="2" y="2" width="24" height="32" rx="2" fill="#F97316"/>
                <path d="M6 8h16M6 12h16M6 16h12" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M14 2v32" stroke="#EA580C" stroke-width="1"/>
              </svg>
            </span>
            为创客而设
          </span>
        </h1>
        <p class="library-login__subtitle">
          {{ isRegister
            ? '创建账户，连接志同道合的队友，开启竞赛之旅'
            : '由参赛者甄选、为参赛者服务的竞赛组队与协作平台'
          }}
        </p>

        <div class="library-login__form">
          <form @submit.prevent="isRegister ? handleRegister() : handleLogin()">
            <AuthFormField
              v-if="isRegister"
              v-model="registerForm.name"
              label="姓名"
              type="text"
              placeholder="请输入姓名"
              required
              autocomplete="name"
            />

            <AuthFormField
              v-model="formEmail"
              label="邮箱"
              type="email"
              placeholder="you@example.com"
              required
              autocomplete="email"
            />

            <AuthFormField
              v-model="formPassword"
              label="密码"
              type="password"
              placeholder="••••••••"
              required
              :autocomplete="isRegister ? 'new-password' : 'current-password'"
            />

            <AuthFormField
              v-if="isRegister"
              v-model="registerForm.confirmPassword"
              label="确认密码"
              type="password"
              placeholder="••••••••"
              required
              autocomplete="new-password"
            />

            <p v-if="registerError" class="library-login__error">{{ registerError }}</p>

            <div class="library-login__submit">
              <AuthPrimaryButton type="submit" :loading="submitting">
                {{ isRegister ? '创建账户' : '登录' }}
              </AuthPrimaryButton>
            </div>
          </form>

          <AuthFooterLink
            :prefix="isRegister ? '已有账户？' : '还没有账户？'"
            :link-text="isRegister ? '登录' : '注册'"
            @click="toggleMode"
          />
        </div>
      </main>

      <div class="library-cards">
        <div class="library-cards__deck">
          <article class="library-card library-card--black" style="--i: 0" />
          <article class="library-card library-card--grey" style="--i: 1">
            <span class="library-card__ring" />
            <span class="library-card__small">The Creative Act:<br />A Way of Being</span>
          </article>
          <article class="library-card library-card--yellow" style="--i: 2">
            <span class="library-card__title">Designing<br />Brand Identity</span>
            <span class="library-card__dots" />
          </article>
          <article class="library-card library-card--white" style="--i: 3">
            <span class="library-card__how">How To</span>
          </article>
          <article class="library-card library-card--pink" style="--i: 4">
            <span class="library-card__waves" />
          </article>
          <article class="library-card library-card--green" style="--i: 5">
            <span class="library-card__lines" />
          </article>
        </div>
      </div>
    </div>
  </AuthPageLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

import '../components/auth/auth-theme.css'
import AuthPageLayout from '../components/auth/AuthPageLayout.vue'
import AuthFormField from '../components/auth/AuthFormField.vue'
import AuthPrimaryButton from '../components/auth/AuthPrimaryButton.vue'
import AuthFooterLink from '../components/auth/AuthFooterLink.vue'
import saidaTeamLogo from '../assets/images/saida-team-logo.png'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const logoSpinning = ref(true)
const isRegister = ref(route.query.tab === 'register')
const submitting = ref(false)
const registerError = ref('')

watch(
  () => route.query.tab,
  (tab) => {
    isRegister.value = tab === 'register'
  }
)

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const formEmail = computed({
  get: () => (isRegister.value ? registerForm.value.email : loginForm.value.email),
  set: (v) => {
    if (isRegister.value) registerForm.value.email = v
    else loginForm.value.email = v
  }
})

const formPassword = computed({
  get: () => (isRegister.value ? registerForm.value.password : loginForm.value.password),
  set: (v) => {
    if (isRegister.value) registerForm.value.password = v
    else loginForm.value.password = v
  }
})

function toggleMode() {
  isRegister.value = !isRegister.value
  registerError.value = ''
  router.replace({
    query: isRegister.value ? { tab: 'register' } : {}
  })
}

async function handleLogin() {
  registerError.value = ''
  submitting.value = true
  try {
    userStore.login({
      name: loginForm.value.email.split('@')[0] || '用户',
      email: loginForm.value.email
    })
    router.push('/')
  } finally {
    submitting.value = false
  }
}

async function handleRegister() {
  if (!registerForm.value.email.trim()) {
    registerError.value = '请输入邮箱'
    return
  }
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerError.value = '两次输入的密码不一致'
    return
  }
  registerError.value = ''
  submitting.value = true
  try {
    userStore.login({
      name: registerForm.value.name.trim() || '用户',
      email: registerForm.value.email
    })
    router.push('/')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.library-login {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 2.5rem 1.5rem 0;
  overflow-x: hidden;
}

.library-login__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.library-logo-btn {
  display: block;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  line-height: 0;
  border-radius: 50%;
  transition: transform 0.15s ease;
}

.library-logo-btn:hover {
  transform: scale(1.04);
}

.library-logo-btn:active {
  transform: scale(0.98);
}

.library-logo {
  display: block;
  width: 120px;
  height: 120px;
  object-fit: contain;
  animation: library-logo-spin 10s linear infinite;
}

.library-logo-btn--paused .library-logo {
  animation-play-state: paused;
}

@keyframes library-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .library-logo {
    animation: none;
  }
}

.library-login__tagline {
  margin: 0;
  font-size: 0.6875rem;
  color: #a3a3a3;
  letter-spacing: 0.02em;
}

.library-login__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 2rem;
}

.library-hero {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.04em;
  color: var(--auth-text);
}

.library-hero__line {
  display: block;
}

.library-hero__line--accent {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.library-hero__book {
  display: inline-flex;
  vertical-align: middle;
  transform: translateY(2px);
}

.library-login__subtitle {
  margin: 0 0 2rem;
  max-width: 420px;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--auth-text-muted);
}

.library-login__form {
  width: 100%;
  max-width: 360px;
}

.library-login__submit {
  display: flex;
  justify-content: center;
  margin-top: 0.25rem;
}

.library-login__error {
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  color: var(--danger-500);
  text-align: center;
}

.library-login__submit :deep(.auth-primary-btn) {
  width: auto;
  min-width: 160px;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}

.library-login__form :deep(.auth-form-field) {
  margin-bottom: 0.75rem;
}

.library-login__form :deep(.auth-form-field__label) {
  font-size: 0.75rem;
  color: var(--auth-text-muted);
}

.library-login__form :deep(.auth-form-field__input) {
  text-align: center;
  background: #fafafa;
  border-color: #f0f0f0;
}

.library-login__form :deep(.auth-footer-link) {
  margin-bottom: 0;
}

/* Bottom book cards */
.library-cards {
  position: relative;
  width: 100%;
  height: clamp(280px, 40vh, 380px);
  margin-top: auto;
  overflow: visible;
  pointer-events: none;
}

.library-cards__deck {
  position: absolute;
  left: 50%;
  bottom: -8px;
  transform: translateX(-50%) scale(1.08);
  transform-origin: center bottom;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0;
  width: max-content;
  max-width: 100vw;
  padding: 0 1.5rem;
  filter: drop-shadow(0 12px 40px rgba(0, 0, 0, 0.1));
  pointer-events: auto;
}

.library-card {
  --card-rotate: calc(-14deg + var(--i) * 6deg);
  --card-lift: calc(var(--i) * -6px);
  flex-shrink: 0;
  width: 180px;
  height: 248px;
  border-radius: 8px;
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.14);
  transform: rotate(var(--card-rotate)) translateY(var(--card-lift));
  margin-left: calc(var(--i) * -40px);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  cursor: default;
  pointer-events: auto;
  transition:
    transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1),
    box-shadow 0.35s ease,
    z-index 0s;
}

.library-card:hover {
  transform: rotate(var(--card-rotate)) translateY(calc(var(--card-lift) - 28px)) scale(1.06);
  z-index: 30;
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.22);
}

.library-card:active {
  transform: rotate(var(--card-rotate)) translateY(calc(var(--card-lift) - 18px)) scale(1.03);
  transition-duration: 0.15s;
}

.library-card:first-child {
  margin-left: 0;
}

.library-card--black {
  background: #0a0a0a;
  color: #fff;
  z-index: 1;
}

.library-card--grey {
  background: #e7e5e4;
  color: #1c1917;
  z-index: 2;
}

.library-card--yellow {
  background: #facc15;
  color: #0a0a0a;
  z-index: 3;
}

.library-card--white {
  background: #fff;
  color: #0a0a0a;
  border: 1px solid #e5e5e5;
  z-index: 4;
}

.library-card--pink {
  background: #ec4899;
  z-index: 5;
}

.library-card--green {
  background: #22c55e;
  z-index: 6;
}

.library-card__ring {
  width: 56px;
  height: 56px;
  border: 2px solid #0a0a0a;
  border-radius: 50%;
  margin-bottom: 0.75rem;
}

.library-card__small {
  font-size: 0.5625rem;
  line-height: 1.35;
  font-weight: 500;
}

.library-card__title {
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.library-card__dots {
  position: absolute;
  right: 8px;
  bottom: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: radial-gradient(circle, #0a0a0a 1px, transparent 1px);
  background-size: 4px 4px;
  opacity: 0.4;
}

.library-card__how {
  font-size: 2.75rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 0.95;
  margin-top: 0.5rem;
}

.library-card__waves {
  position: absolute;
  inset: 0;
  background: repeating-radial-gradient(
    ellipse 80% 50% at 50% 120%,
    transparent 0,
    transparent 8px,
    rgba(255, 255, 255, 0.35) 8px,
    rgba(255, 255, 255, 0.35) 10px
  );
}

.library-card__lines {
  position: absolute;
  inset: 1rem;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.5) 45%,
    transparent 50%
  );
}

@media (hover: none) {
  .library-card:hover,
  .library-card:active {
    transform: rotate(var(--card-rotate)) translateY(var(--card-lift));
    box-shadow: 0 10px 36px rgba(0, 0, 0, 0.14);
    z-index: auto;
  }
}

@media (max-width: 640px) {
  .library-cards__deck {
    transform: translateX(-50%) scale(0.72);
  }

  .library-card {
    width: 160px;
    height: 220px;
    margin-left: calc(var(--i) * -32px);
  }

  .library-card__how {
    font-size: 2rem;
  }

  .library-cards {
    height: clamp(220px, 34vh, 300px);
    overflow: hidden;
  }
}
</style>
