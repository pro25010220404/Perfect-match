<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- 左侧品牌展示 -->
      <div class="auth-banner">
        <div class="banner-content">
          <div class="logo-large">赛</div>
          <h1>赛搭</h1>
          <p class="tagline">竞赛组队平台</p>
          <p class="description">
            连接志同道合的队友，让每一次组队都更简单。<br/>
            智能匹配、高效协作，助你竞赛之路更精彩。
          </p>

          <div class="features">
            <div class="feature-item">
              <div class="feature-icon">🎯</div>
              <div>
                <h4>智能匹配</h4>
                <p>基于技能和兴趣的精准推荐</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">👥</div>
              <div>
                <h4>高效协作</h4>
                <p>一站式团队管理和沟通</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🏆</div>
              <div>
                <h4>成就系统</h4>
                <p>记录每一次成长与突破</p>
              </div>
            </div>
          </div>

          <div class="illustration">
            <div class="floating-shapes">
              <div class="shape shape-1"></div>
              <div class="shape shape-2"></div>
              <div class="shape shape-3"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧表单 -->
      <div class="auth-form-container">
        <div class="form-header">
          <router-link to="/" class="logo-link">
            <div class="logo-small">赛</div>
            <span>赛搭</span>
          </router-link>
        </div>

        <div class="tabs">
          <button
            type="button"
            :class="['tab', { active: activeTab === 'login' }]"
            @click="switchTab('login')"
          >
            登录
          </button>
          <button
            type="button"
            :class="['tab', { active: activeTab === 'register' }]"
            @click="switchTab('register')"
          >
            注册
          </button>
        </div>

        <!-- 登录表单 -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form animate-fade-in">
          <div class="form-group">
            <label class="form-label">邮箱地址</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <input
                v-model="loginForm.email"
                type="email"
                placeholder="请输入邮箱地址"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">密码</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                required
              />
              <button type="button" class="toggle-password" :aria-label="showPassword ? '隐藏密码' : '显示密码'" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-wrapper">
              <input type="checkbox" v-model="loginForm.remember" />
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>

          <button type="submit" class="btn-primary btn-block">
            登录
          </button>

          <div class="divider">
            <span>或使用以下方式登录</span>
          </div>

          <div class="social-login">
            <button type="button" class="social-btn wechat" aria-label="使用微信登录">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.945 2.453 3.766 4.227 6.456 4.227.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zM14.033 13.3c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
              </svg>
            </button>
            <button type="button" class="social-btn qq" aria-label="使用QQ登录">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.003 2c-2.265 0-6.29 1.354-6.29 7.298 0 2.992 1.092 4.953 2.33 6.146-.108.773-.54 2.735-.62 2.959-.098.277.107.287.167.25.138-.057 2.133-1.393 2.753-1.893.508.086 1.04.137 1.66.137 2.265 0 6.29-1.354 6.29-7.298C18.293 3.354 14.268 2 12.003 2zm-.674 5.46h-1.496v4.641H9.31V7.46H7.82V6.134h3.51v2.326zm1.496 0V6.134h1.523l1.43 2.394V6.134h1.496v4.641h-1.496l-1.457-2.394v2.394h-1.496z"/>
              </svg>
            </button>
            <button type="button" class="social-btn github" aria-label="使用GitHub登录">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>
          </div>
        </form>

        <!-- 注册表单 -->
        <form v-else @submit.prevent="handleRegister" class="auth-form animate-fade-in">
          <div class="form-group">
            <label class="form-label">真实姓名</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                v-model="registerForm.name"
                type="text"
                placeholder="请输入真实姓名"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">学号</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <input
                  v-model="registerForm.studentId"
                  type="text"
                  placeholder="请输入学号"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">邮箱地址</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <input
                  v-model="registerForm.email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  required
                  autocomplete="email"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">验证码</label>
            <div class="verification-row">
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  v-model="registerForm.verificationCode"
                  type="text"
                  placeholder="请输入验证码"
                  required
                  maxlength="6"
                  inputmode="numeric"
                  autocomplete="one-time-code"
                />
              </div>
              <button
                type="button"
                class="send-code-btn"
                :class="{ disabled: countdown > 0 }"
                @click="sendVerificationCode"
                :disabled="countdown > 0 || !registerForm.email"
              >
                {{ countdown > 0 ? `${countdown}秒` : '发送验证码' }}
              </button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">密码</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  v-model="registerForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="设置密码"
                  required
                  minlength="6"
                />
                <button type="button" class="toggle-password" :aria-label="showPassword ? '隐藏密码' : '显示密码'" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">确认密码</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="确认密码"
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" class="btn-primary btn-block">
            创建账户
          </button>

          <p class="terms-text">
            注册即表示您同意我们的
            <a href="#">服务条款</a>
            和
            <a href="#">隐私政策</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('login')
const showPassword = ref(false)

const loginForm = ref({
  email: '',
  password: '',
  remember: false
})

const registerForm = ref({
  name: '',
  studentId: '',
  email: '',
  verificationCode: '',
  password: '',
  confirmPassword: ''
})

const countdown = ref(0)
let timer = null

const sendVerificationCode = () => {
  if (!registerForm.value.email) {
    alert('请先输入邮箱地址！')
    return
  }
  
  if (countdown.value > 0) {
    return
  }
  
  console.log('Sending verification code to:', registerForm.value.email)
  countdown.value = 60
  
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

const handleLogin = () => {
  console.log('Login:', loginForm.value)
  userStore.login({
    name: '张三',
    email: loginForm.value.email
  })
  router.push('/')
}

const handleRegister = () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('两次输入的密码不一致！')
    return
  }
  console.log('Register:', registerForm.value)
  
  userStore.login({
    name: registerForm.value.name,
    email: registerForm.value.email
  })
  router.push('/')
}

const switchTab = (tab) => {
  console.log('Switch to:', tab)
  activeTab.value = tab
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.auth-page::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  animation: moveBackground 20s linear infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes moveBackground {
  0% { transform: translate(0, 0); }
  100% { transform: translate(30px, 30px); }
}

.auth-container {
  display: flex;
  max-width: 1000px;
  width: 100%;
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

.auth-banner {
  flex: 1;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--accent-600) 100%);
  padding: 2.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 380px;
}

.logo-large {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.banner-content h1 {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.375rem;
  letter-spacing: -0.02em;
}

.tagline {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1.25rem;
  font-weight: 500;
}

.description {
  opacity: 0.85;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 0.875rem;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  gap: 0.875rem;
  align-items: flex-start;
}

.feature-icon {
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  width: 42px;
  height: 42px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.feature-item h4 {
  font-weight: 600;
  margin-bottom: 0.125rem;
  font-size: 0.9375rem;
}

.feature-item p {
  font-size: 0.8125rem;
  opacity: 0.85;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
  animation: floatShape 8s ease-in-out infinite;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
  animation: floatShape 10s ease-in-out infinite reverse;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 20%;
  animation: floatShape 6s ease-in-out infinite;
}

@keyframes floatShape {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

.auth-form-container {
  flex: 1;
  padding: 2rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  max-width: 480px;
  overflow-y: auto;
}

.form-header {
  margin-bottom: 1.5rem;
}

.logo-link {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--gray-900);
  text-decoration: none;
}

.logo-small {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--accent-600) 100%);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  background: var(--gray-100);
  padding: 0.3125rem;
  border-radius: var(--radius-lg);
}

.tab {
  flex: 1;
  padding: 0.6875rem;
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: center;
  color: var(--gray-500);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
  user-select: none;
}

.tab:hover {
  color: var(--gray-700);
  background: rgba(255, 255, 255, 0.5);
}

.tab:active {
  transform: scale(0.98);
}

.tab.active {
  background: white;
  color: var(--gray-900);
  box-shadow: var(--shadow-sm);
  font-weight: 600;
}

.verification-row {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.verification-row .input-wrapper {
  flex: 1;
}

.send-code-btn {
  padding: 0.875rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, var(--primary-600), var(--accent-600));
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  min-width: 120px;
}

.send-code-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.send-code-btn:active:not(.disabled) {
  transform: scale(0.98);
}

.send-code-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--gray-700);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.875rem;
  color: var(--gray-400);
  pointer-events: none;
  transition: color var(--transition-fast);
}

.input-wrapper input {
  width: 100%;
  padding: 0.6875rem 0.875rem 0.6875rem 2.75rem;
  font-size: 0.875rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: white;
  transition: all var(--transition-fast);
  outline: none;
}

.input-wrapper input:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.input-wrapper input:focus + .input-icon,
.input-wrapper input:focus ~ .input-icon {
  color: var(--primary-500);
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.toggle-password:hover {
  color: var(--gray-600);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--gray-600);
}

.checkbox-wrapper input[type="checkbox"] {
  width: 14px;
  height: 14px;
  accent-color: var(--primary-600);
}

.forgot-link {
  font-size: 0.8125rem;
  color: var(--primary-600);
  font-weight: 500;
}

.btn-primary {
  padding: 0.75rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary-600), var(--accent-600));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
}

.btn-block {
  width: 100%;
}

.divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--gray-400);
  font-size: 0.75rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--gray-200);
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.social-btn {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  background: white;
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
  color: var(--gray-600);
}

.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-300);
}

.social-btn.wechat:hover {
  color: #07C160;
  border-color: #07C160;
}

.social-btn.qq:hover {
  color: #12B7F5;
  border-color: #12B7F5;
}

.social-btn.github:hover {
  color: #333;
  border-color: #333;
}

.terms-text {
  text-align: center;
  font-size: 0.8125rem;
  color: var(--gray-500);
}

.terms-text a {
  color: var(--primary-600);
  font-weight: 500;
}

@media (max-width: 768px) {
  .auth-banner {
    display: none;
  }

  .auth-form-container {
    max-width: 100%;
    padding: 2rem 1.5rem;
  }

  .auth-page {
    padding: 1rem;
  }
}
</style>
