<template>
  <div class="matching-overlay">
    <div class="matching-overlay__status">
      <span class="status__dot"></span>
      <span>{{ statusText }}</span>
    </div>

    <div class="matching-overlay__list">
      <div
        v-for="(c, i) in displayCandidates"
        :key="c.id"
        class="candidate-row"
        :class="{ 'candidate-row--done': computedCount > i }"
      >
        <span class="candidate-row__avatar">{{ c.avatar || (c.name ? c.name.charAt(0) : '?') }}</span>
        <div class="candidate-row__body">
          <div class="candidate-row__top">
            <span class="candidate-row__name">{{ c.name }}</span>
            <span class="candidate-row__score">{{ scores[i] }}<i>%</i></span>
          </div>
          <div class="candidate-row__bar">
            <div class="candidate-row__bar-fill" :style="{ width: fillWidths[i] + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <p class="matching-overlay__hint">多维匹配 · 技能互补度 · 竞赛经验 · 协作风格</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  candidates: { type: Array, default: () => [] }
})

const emit = defineEmits(['done'])

const displayCandidates = computed(() => props.candidates.slice(0, 5))
const statusText = ref('正在读取你的技能画像…')
const scores = ref([])
const fillWidths = ref([])
const computedCount = ref(0)

let timers = []

function clearTimers() {
  timers.forEach((t) => {
    clearInterval(t)
    clearTimeout(t)
  })
  timers = []
}

function run() {
  clearTimers()
  const list = displayCandidates.value
  scores.value = list.map(() => 0)
  fillWidths.value = list.map(() => 0)
  computedCount.value = 0
  statusText.value = '正在读取你的技能画像…'

  const initialDelay = 500 // 开场停顿：先“读取画像”，营造准备感
  const stagger = 400      // 候选人逐个进入计算
  const rollDuration = 1700 // 单个候选人的匹配计算时长（含抖动+收敛）
  const totalEnd = initialDelay + (list.length - 1) * stagger + rollDuration

  list.forEach((c, i) => {
    const startTimer = setTimeout(() => {
      const target = c.matchScore || 0
      const start = Date.now()
      const interval = setInterval(() => {
        const p = Math.min((Date.now() - start) / rollDuration, 1)
        // easeOutCubic：越接近目标越慢，模拟“逐渐锁定”
        const eased = 1 - Math.pow(1 - p, 3)
        // 抖动幅度随进度衰减：前期“东碰西碰”，后期稳稳落定
        const jitter = (Math.random() * 2 - 1) * 26 * (1 - p)
        scores.value[i] = Math.max(0, Math.min(100, Math.round(target * eased + jitter)))
        // 进度条平滑填充，只让数字跳动，避免进度条闪得杂乱
        fillWidths.value[i] = Math.round(target * eased)
        if (p >= 1) {
          scores.value[i] = target
          fillWidths.value[i] = target
          clearInterval(interval)
          computedCount.value = i + 1
        }
      }, 16)
      timers.push(interval)
    }, initialDelay + i * stagger)
    timers.push(startTimer)
  })

  const statuses = [
    { at: initialDelay + 300, text: '正在解析技能标签…' },
    { at: initialDelay + stagger, text: '正在计算匹配度…' },
    { at: initialDelay + stagger * 3 + rollDuration * 0.5, text: '正在评估互补程度…' },
    { at: Math.max(totalEnd - 450, 0), text: '正在智能排序…' }
  ]
  statuses.forEach((s) => {
    timers.push(setTimeout(() => { statusText.value = s.text }, s.at))
  })

  timers.push(setTimeout(() => emit('done'), totalEnd + 600))
}

onMounted(run)
onUnmounted(clearTimers)
</script>

<style scoped>
.matching-overlay {
  max-width: 640px;
  margin: 0 auto 2.5rem;
  padding: 2.5rem 1.5rem;
}

/* 状态行 */
.matching-overlay__status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 2rem;
}

.status__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--nav-blue-deep);
  animation: status-pulse 1s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* 候选人列表 */
.matching-overlay__list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.candidate-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  opacity: 0.5;
  transition: opacity 0.35s ease;
}

.candidate-row--done {
  opacity: 1;
}

.candidate-row__avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-500);
  background: var(--gray-100);
  transition: background 0.3s ease, color 0.3s ease;
}

.candidate-row--done .candidate-row__avatar {
  background: linear-gradient(135deg, #5eb3e4, #2c8fc0);
  color: #fff;
}

.candidate-row__body {
  flex: 1;
  min-width: 0;
}

.candidate-row__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.375rem;
}

.candidate-row__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-700);
}

.candidate-row__score {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--nav-blue-deep);
  font-variant-numeric: tabular-nums;
}

.candidate-row__score i {
  font-style: normal;
  font-size: 0.75rem;
  margin-left: 1px;
}

.candidate-row__bar {
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--gray-100);
  overflow: hidden;
}

.candidate-row__bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  background: linear-gradient(90deg, var(--nav-blue-soft), var(--nav-blue-deep));
  transition: width 0.05s linear;
}

.matching-overlay__hint {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--gray-400);
}
</style>
