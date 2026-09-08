<template>
  <div class="login-entry">
    <div class="login-entry__login" :class="{ 'login-entry__login--revealed': splashDone }">
      <LoginView />
    </div>
    <SplashScreen v-if="!splashDone" @complete="splashDone = true" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginView from './LoginView.vue'
import SplashScreen from '../components/splash/SplashScreen.vue'

const splashDone = ref(false)
</script>

<style scoped>
.login-entry {
  position: relative;
  min-height: 100vh;
}

.login-entry__login {
  min-height: 100vh;
  opacity: 0;
  transition: opacity 0.5s ease 0.35s;
}

.login-entry__login--revealed {
  opacity: 1;
}
</style>
