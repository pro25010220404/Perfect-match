<template>
  <div class="auth-page auth-theme">
    <slot />
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: var(--auth-page-bg);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}
</style>
