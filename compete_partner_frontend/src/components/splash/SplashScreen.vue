<template>
  <div
    class="splash"
    :class="{
      'splash--opening': phase === 'opening',
      'splash--done': phase === 'done'
    }"
    role="presentation"
    @click="skipToOpen"
  >
    <div class="splash__panel splash__panel--top" />
    <div class="splash__panel splash__panel--bottom" />

    <div class="splash__stage" :class="{ 'splash__stage--out': phase === 'opening' || phase === 'done' }">
      <SaiDaMonogram :animate="phase === 'falling'" />
      <p class="splash__tagline">赛搭 · 竞赛组队</p>
      <div class="splash__glow" aria-hidden="true" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SaiDaMonogram from './SaiDaMonogram.vue'

const emit = defineEmits(['complete'])

const phase = ref('falling')

const OPEN_DURATION_MS = 1000
const DROP_ANIMATION_MS = 5 * 90 + 1000 + 100
const SETTLE_HOLD_MS = 750

let settleTimer = null
let openTimer = null
let doneTimer = null

function startOpen() {
  if (phase.value === 'opening' || phase.value === 'done') return
  phase.value = 'opening'

  doneTimer = setTimeout(() => {
    phase.value = 'done'
    emit('complete')
  }, OPEN_DURATION_MS)
}

function skipToOpen() {
  if (phase.value === 'falling') {
    clearTimeout(settleTimer)
    clearTimeout(openTimer)
    phase.value = 'settled'
    openTimer = setTimeout(startOpen, 180)
    return
  }
  if (phase.value === 'settled') {
    startOpen()
  }
}

onMounted(() => {
  settleTimer = setTimeout(() => {
    phase.value = 'settled'
    openTimer = setTimeout(startOpen, SETTLE_HOLD_MS)
  }, DROP_ANIMATION_MS)
})

onUnmounted(() => {
  clearTimeout(settleTimer)
  clearTimeout(openTimer)
  clearTimeout(doneTimer)
})
</script>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: auto;
  cursor: pointer;
  background: #0a0a0a;
}

.splash--done {
  pointer-events: none;
  visibility: hidden;
}

.splash__panel {
  position: absolute;
  left: 0;
  right: 0;
  height: 50%;
  background: #0a0a0a;
  z-index: 2;
  will-change: transform;
  transition: transform 1s cubic-bezier(0.76, 0, 0.24, 1);
}

.splash__panel--top {
  top: 0;
}

.splash__panel--bottom {
  bottom: 0;
}

.splash--opening .splash__panel--top {
  transform: translateY(-100%);
}

.splash--opening .splash__panel--bottom {
  transform: translateY(100%);
}

.splash__stage {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  transition: opacity 0.45s ease, transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}

.splash__stage--out {
  opacity: 0;
  transform: scale(1.04);
  pointer-events: none;
}

.splash__tagline {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.38);
  animation: tagline-in 0.8s ease 0.55s both;
}

.splash__stage--out .splash__tagline {
  animation: none;
}

@keyframes tagline-in {
  from {
    opacity: 0;
    transform: translateY(12px);
    letter-spacing: 0.5em;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    letter-spacing: 0.35em;
  }
}

.splash__glow {
  position: absolute;
  width: min(420px, 70vw);
  height: 120px;
  background: radial-gradient(
    ellipse 80% 100% at 50% 50%,
    rgba(255, 255, 255, 0.07) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: -1;
}

@media (prefers-reduced-motion: reduce) {
  .splash__panel {
    transition-duration: 0.01ms;
  }

  .splash__stage {
    transition-duration: 0.01ms;
  }

  .splash__tagline {
    animation: none;
    opacity: 1;
  }
}
</style>
