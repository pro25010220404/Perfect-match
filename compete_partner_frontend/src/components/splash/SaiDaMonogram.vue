<template>
  <h1 class="saida-brand" :class="{ 'saida-brand--animate': animate }">
    <span
      v-for="(item, index) in letters"
      :key="index"
      class="saida-brand__char"
      :class="`saida-brand__char--${item.role}`"
      :style="{ '--i': index }"
    >{{ item.char }}</span>
  </h1>
</template>

<script setup>
defineProps({
  animate: { type: Boolean, default: false }
})

const letters = [
  { char: 'S', role: 'cap' },
  { char: 'a', role: 'low' },
  { char: 'i', role: 'low' },
  { char: 'D', role: 'cap' },
  { char: 'a', role: 'low' }
]
</script>

<style scoped>
.saida-brand {
  margin: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.06em;
  font-family: var(--font-display), 'Space Grotesk', system-ui, sans-serif;
  font-size: clamp(3.25rem, 12vw, 7rem);
  font-weight: 600;
  font-style: normal;
  letter-spacing: 0.02em;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
}

.saida-brand__char {
  display: inline-block;
  color: #fafafa;
  will-change: transform, opacity, filter;
}

.saida-brand__char--cap {
  font-weight: 700;
  font-size: 1.05em;
  letter-spacing: -0.02em;
}

.saida-brand__char--low {
  font-weight: 500;
  font-size: 0.88em;
  color: rgba(250, 250, 250, 0.88);
  transform: translateY(0.06em);
}

.saida-brand--animate .saida-brand__char {
  opacity: 0;
  animation: letter-fall 1s cubic-bezier(0.34, 1.25, 0.64, 1) calc(var(--i) * 0.09s) forwards;
}

@keyframes letter-fall {
  0% {
    opacity: 0;
    transform: translateY(-55vh) scale(0.75);
    filter: blur(6px);
  }
  50% {
    opacity: 1;
    filter: blur(0);
  }
  68% {
    transform: translateY(10px) scale(1.04);
  }
  82% {
    transform: translateY(-5px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(var(--rest-y, 0)) scale(1);
    filter: blur(0);
  }
}

.saida-brand--animate .saida-brand__char--low {
  --rest-y: 0.06em;
}

@media (prefers-reduced-motion: reduce) {
  .saida-brand--animate .saida-brand__char {
    animation: none;
    opacity: 1;
    transform: none;
    filter: none;
  }
}
</style>
