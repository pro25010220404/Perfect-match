<template>
  <div class="auth-page">
    <el-card class="auth-card" shadow="hover">
      <el-row>
        <el-col :md="11" :sm="0" :xs="0" class="banner-col">
          <div class="auth-banner">
            <el-avatar :size="56" shape="square" class="logo-large">赛</el-avatar>
            <el-text tag="h1" class="banner-title">赛搭</el-text>
            <el-text class="tagline">竞赛组队平台</el-text>
            <el-text type="info" class="description">
              连接志同道合的队友，让每一次组队更简单。智能匹配、高效协作，助你竞赛之路更精彩。
            </el-text>
            <el-space direction="vertical" :size="16" fill class="features">
              <el-card v-for="(f, i) in featureList" :key="i" shadow="never" class="feature-card">
                <el-space>
                  <span class="feature-emoji">{{ f.icon }}</span>
                  <div>
                    <el-text tag="div" class="feature-title">{{ f.title }}</el-text>
                    <el-text type="info" size="small">{{ f.desc }}</el-text>
                  </div>
                </el-space>
              </el-card>
            </el-space>
          </div>
        </el-col>
        <el-col :md="13" :sm="24" :xs="24" class="form-col">
          <div class="form-inner">
            <router-link to="/" class="logo-link">
              <el-avatar :size="32" shape="square" class="logo-small">赛</el-avatar>
              <el-text tag="span" class="logo-text">赛搭</el-text>
            </router-link>

            <el-tabs v-model="activeTabName" class="auth-tabs">
              <el-tab-pane label="登录" name="login">
                <el-form
                  :model="loginForm"
                  label-position="top"
                  class="auth-form"
                  @submit.prevent="handleLogin"
                >
                  <el-form-item label="邮箱地址">
                    <el-input
                      v-model="loginForm.email"
                      type="email"
                      placeholder="请输入邮箱地址"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input
                      v-model="loginForm.password"
                      type="password"
                      placeholder="请输入密码"
                      show-password
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-row justify="space-between" align="middle">
                      <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
                      <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </el-row>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" native-type="submit" class="w-full">登录</el-button>
                  </el-form-item>
                  <el-divider>或使用以下方式登录</el-divider>
                  <el-form-item>
                    <el-space wrap>
                      <el-button circle aria-label="使用微信登录">
                        <el-icon><ChatDotRound /></el-icon>
                      </el-button>
                      <el-button circle aria-label="使用QQ登录">
                        <el-icon><Service /></el-icon>
                      </el-button>
                      <el-button circle aria-label="使用GitHub登录">
                        <el-icon><Link /></el-icon>
                      </el-button>
                    </el-space>
                  </el-form-item>
                </el-form>
              </el-tab-pane>

              <el-tab-pane label="注册" name="register">
                <el-form :model="registerForm" label-position="top" class="auth-form" @submit.prevent="handleRegister">
                  <el-form-item label="真实姓名">
                    <el-input v-model="registerForm.name" placeholder="请输入真实姓名" clearable />
                  </el-form-item>
                  <el-row :gutter="12">
                    <el-col :span="12">
                      <el-form-item label="学号">
                        <el-input v-model="registerForm.studentId" placeholder="学号" clearable />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="邮箱地址">
                        <el-input
                          v-model="registerForm.email"
                          type="email"
                          placeholder="邮箱"
                          clearable
                          autocomplete="email"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="验证码">
                    <el-input
                      v-model="registerForm.verificationCode"
                      placeholder="请输入验证码"
                      maxlength="6"
                      inputmode="numeric"
                      autocomplete="one-time-code"
                    >
                      <template #append>
                        <el-button
                          :disabled="countdown > 0 || !registerForm.email"
                          @click="sendVerificationCode"
                        >
                          {{ countdown > 0 ? `${countdown}秒` : '发送验证码' }}
                        </el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-row :gutter="12">
                    <el-col :span="12">
                      <el-form-item label="密码">
                        <el-input
                          v-model="registerForm.password"
                          type="password"
                          placeholder="至少 6 位"
                          show-password
                          minlength="6"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="确认密码">
                        <el-input
                          v-model="registerForm.confirmPassword"
                          type="password"
                          placeholder="再次输入"
                          show-password
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item>
                    <el-button type="primary" native-type="submit" class="w-full">创建账户</el-button>
                  </el-form-item>
                  <el-text type="info" size="small" class="terms">
                    注册即表示您同意我们的
                    <el-link type="primary" :underline="false">服务条款</el-link>
                    和
                    <el-link type="primary" :underline="false">隐私政策</el-link>
                  </el-text>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ChatDotRound, Service, Link } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const activeTabName = ref('login')

const featureList = [
  { icon: '🎯', title: '智能匹配', desc: '基于技能和兴趣的精准推荐' },
  { icon: '👥', title: '高效协作', desc: '一站式团队管理和沟通' },
  { icon: '🏆', title: '成就系统', desc: '记录每一次成长与突破' },
]

const loginForm = ref({
  email: '',
  password: '',
  remember: false,
})

const registerForm = ref({
  name: '',
  studentId: '',
  email: '',
  verificationCode: '',
  password: '',
  confirmPassword: '',
})

const countdown = ref(0)
let timer = null

const sendVerificationCode = () => {
  if (!registerForm.value.email) {
    ElMessage.warning('请先输入邮箱地址')
    return
  }
  if (countdown.value > 0) return
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
  userStore.login({
    name: '张三',
    email: loginForm.value.email,
  })
  router.push('/')
}

const handleRegister = () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  userStore.login({
    name: registerForm.value.name,
    email: registerForm.value.email,
  })
  router.push('/')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: var(--el-bg-color-page);
}

.auth-card {
  max-width: 960px;
  width: 100%;
  border-radius: var(--el-border-radius-base);
}

.banner-col {
  border-right: 1px solid var(--el-border-color-lighter);
}

@media (max-width: 992px) {
  .banner-col {
    display: none;
  }
}

.auth-banner {
  padding: 1.5rem 1.25rem;
  min-height: 420px;
  background: var(--el-fill-color-dark);
  color: var(--el-color-white);
  border-radius: var(--el-border-radius-base) 0 0 var(--el-border-radius-base);
}

.logo-large {
  background-color: var(--el-color-primary) !important;
  color: #fff;
  font-weight: 700;
  margin-bottom: 1rem;
}

.banner-title {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff !important;
  margin-bottom: 0.25rem;
}

.tagline {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.75rem;
}

.description {
  display: block;
  margin-bottom: 1.25rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75) !important;
}

.feature-card {
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.feature-card :deep(.el-card__body) {
  padding: 12px 14px;
}

.feature-emoji {
  font-size: 1.25rem;
}

.feature-title {
  font-weight: 600;
  color: #fff !important;
}

.form-inner {
  padding: 1.25rem 1.5rem 1.5rem;
}

.logo-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  margin-bottom: 1rem;
}

.logo-small {
  background-color: var(--el-color-primary) !important;
  color: #fff;
  font-weight: 700;
}

.logo-text {
  font-size: 1.125rem;
  font-weight: 700;
}

.auth-tabs {
  margin-top: 0.25rem;
}

.w-full {
  width: 100%;
}

.terms {
  display: block;
  text-align: center;
  line-height: 1.6;
}
</style>
