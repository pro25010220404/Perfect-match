<template>
  <div class="invitations-page animate-fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">我的邀请</h1>
        <p class="page-subtitle">查看和管理收到的团队邀请</p>
      </div>
      <div class="header-stats" v-if="pendingCount > 0">
        <div class="stat-badge pending">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {{ pendingCount }} 条待处理
        </div>
      </div>
    </div>

    <!-- 标签页切换 -->
    <div class="tabs-container">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <span class="tab-count" v-if="tab.count !== undefined">{{ tab.count }}</span>
      </button>
    </div>

    <!-- 邀请列表 -->
    <div class="invitation-list">
      <!-- 空状态 -->
      <div v-if="filteredInvitations.length === 0" class="empty-state">
        <div class="empty-icon-wrapper">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <path d="M22 7l-10 7L2 7"></path>
          </svg>
        </div>
        <h3 class="empty-title">{{ emptyState.title }}</h3>
        <p class="empty-desc">{{ emptyState.desc }}</p>
        <button
          v-if="activeTab === 'sent'"
          class="btn-primary-action"
          @click="$router.push('/teams')"
        >
          去发现团队
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <!-- 邀请卡片列表 -->
      <TransitionGroup name="list" tag="div" class="cards-grid">
        <div
          v-for="invite in filteredInvitations"
          :key="invite.id"
          class="invitation-card"
          :class="{ 'card-hover': invite.status === 'pending' }"
        >
          <!-- 卡片头部 -->
          <div class="card-header">
            <div class="header-left">
              <div class="team-icon" :style="{ background: invite.gradient }">
                <span class="team-emoji">{{ invite.teamEmoji }}</span>
              </div>
              <div class="team-info">
                <h3 class="team-name">{{ invite.teamName }}</h3>
                <p class="inviter-info">
                  邀请来自：
                  <span class="inviter-name">{{ invite.inviterName }}</span>
                  <span class="inviter-role" v-if="invite.inviterRole">({{ invite.inviterRole }})</span>
                </p>
              </div>
            </div>
            <span class="status-badge" :class="statusClass(invite.status)">
              {{ statusLabel(invite.status) }}
            </span>
          </div>

          <!-- 卡片主体 -->
          <div class="card-body">
            <!-- 关键信息行 -->
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">邀请时间</span>
                <span class="info-value">{{ invite.createdAt }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">邀请角色</span>
                <span class="info-value role-value">{{ invite.role }}</span>
              </div>
              <div class="info-item match-item">
                <span class="info-label">匹配度</span>
                <div class="match-score-display">
                  <div class="score-circle" :style="{ '--score': invite.matchScore + '%' }">
                    <svg viewBox="0 0 36 36" class="circular-chart">
                      <circle cx="18" cy="18" r="15.5" class="circle-bg"></circle>
                      <circle
                        cx="18" cy="18" r="15.5"
                        class="circle-progress"
                        :class="{ high: invite.matchScore >= 80, medium: invite.matchScore >= 60 && invite.matchScore < 80, low: invite.matchScore < 60 }"
                        :stroke-dasharray="`${invite.matchScore} ${100 - invite.matchScore}`"
                        stroke-dashoffset="25"
                      ></circle>
                    </svg>
                    <span class="score-text" :class="{ high: invite.matchScore >= 80, medium: invite.matchScore >= 60 && invite.matchScore < 80, low: invite.matchScore < 60 }">
                      {{ invite.matchScore }}%
                    </span>
                  </div>
                  <div class="star-rating">
                    <span
                      v-for="i in 5"
                      :key="i"
                      class="star"
                      :class="{ filled: i <= Math.round(invite.matchScore / 20) }"
                    >★</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 团队信息摘要 -->
            <div class="team-summary">
              <h4 class="summary-title">团队信息</h4>
              <ul class="summary-list">
                <li class="summary-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  目标：{{ invite.teamGoal }}
                </li>
                <li class="summary-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  当前成员：{{ invite.currentMembers }}/{{ invite.maxMembers }}
                </li>
                <li class="summary-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20V10"></path>
                    <path d="M18 20V4"></path>
                    <path d="M6 20v-4"></path>
                  </svg>
                  队长信誉：{{ invite.leaderRating }}分
                </li>
                <li class="summary-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  招募截止：{{ invite.deadline }}
                </li>
              </ul>
            </div>

            <!-- 查看详情按钮 -->
            <router-link :to="`/teams/${invite.teamId}`" class="btn-detail">
              查看团队详情
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </router-link>
          </div>

          <!-- 卡片底部操作区 -->
          <div class="card-footer" v-if="invite.status === 'pending' && activeTab !== 'sent'">
            <button class="action-btn reject-btn" @click="handleReject(invite)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              拒绝
            </button>
            <button class="action-btn accept-btn" @click="handleAccept(invite)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              接受邀请
            </button>
          </div>

          <!-- 已处理状态显示 -->
          <div class="card-footer processed-footer" v-if="invite.status !== 'pending' || activeTab === 'sent'">
            <div class="processed-status" :class="invite.status">
              <svg v-if="invite.status === 'accepted'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <svg v-else-if="invite.status === 'rejected'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{{ processedText(invite) }}</span>
            </div>
            <button
              v-if="invite.status === 'rejected' && activeTab !== 'sent'"
              class="btn-retry"
              @click="handleRetry(invite)"
            >
              重新考虑
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('pending')

const tabs = computed(() => [
  {
    key: 'pending',
    label: '待处理',
    count: pendingInvitations.value.length
  },
  {
    key: 'processed',
    label: '已处理'
  },
  {
    key: 'sent',
    label: '我发出的'
  }
])

const invitations = ref([
  {
    id: 1,
    teamId: 101,
    teamName: '无人车战队',
    teamEmoji: '\u{1F3CE}',
    teamGoal: '全国大学生智能汽车竞赛一等奖',
    currentMembers: 3,
    maxMembers: 6,
    leaderRating: 4.9,
    deadline: '2025-12-31',
    inviterName: '李明',
    inviterRole: '队长',
    role: '算法工程师',
    matchScore: 85,
    createdAt: '2025-05-07 10:30',
    status: 'pending',
    gradient: '#1e3a8a'
  },
  {
    id: 2,
    teamId: 102,
    teamName: 'AI创新挑战赛',
    teamEmoji: '\u{1F916}',
    teamGoal: '专注人工智能创新应用开发',
    currentMembers: 2,
    maxMembers: 5,
    leaderRating: 4.7,
    deadline: '2025-11-15',
    inviterName: '王芳',
    inviterRole: '队长',
    role: 'Python开发',
    matchScore: 72,
    createdAt: '2025-05-06 15:20',
    status: 'pending',
    gradient: '#166534'
  },
  {
    id: 3,
    teamId: 103,
    teamName: '数学建模竞赛队',
    teamEmoji: '\u{1F4CA}',
    teamGoal: '全国大学生数学建模竞赛国奖冲刺',
    currentMembers: 4,
    maxMembers: 4,
    leaderRating: 4.8,
    deadline: '2025-09-30',
    inviterName: '赵强',
    inviterRole: '队长',
    role: '论文写作',
    matchScore: 91,
    createdAt: '2025-04-28 09:00',
    status: 'accepted',
    gradient: '#9f1239'
  },
  {
    id: 4,
    teamId: 104,
    teamName: '机器人战队',
    teamEmoji: '\u{1F9BE}',
    teamGoal: 'RoboMaster机甲大师赛全国赛',
    currentMembers: 5,
    maxMembers: 8,
    leaderRating: 4.6,
    deadline: '2026-03-01',
    inviterName: '孙伟',
    inviterRole: '副队长',
    role: '机械设计',
    matchScore: 58,
    createdAt: '2025-04-20 14:00',
    status: 'rejected',
    gradient: '#854d0e'
  }
])

const sentInvitations = ref([
  {
    id: 101,
    teamId: 201,
    teamName: 'Web全栈开发组',
    teamEmoji: '\u{1F310}',
    teamGoal: '构建高性能竞赛报名系统',
    currentMembers: 2,
    maxMembers: 4,
    leaderRating: 4.5,
    deadline: '2025-08-15',
    inviterName: '我',
    inviterRole: '',
    role: '前端开发',
    matchScore: 88,
    createdAt: '2025-05-08 11:00',
    status: 'waiting',
    gradient: '#52525b'
  },
  {
    id: 102,
    teamId: 202,
    teamName: '数据科学竞赛队',
    teamEmoji: '\u{1F4C8}',
    teamGoal: 'Kaggle大数据分析挑战赛',
    currentMembers: 3,
    maxMembers: 5,
    leaderRating: 4.8,
    deadline: '2025-10-20',
    inviterName: '我',
    inviterRole: '',
    role: '数据分析',
    matchScore: 76,
    createdAt: '2025-05-03 16:45',
    status: 'waiting',
    gradient: '#0f766e'
  }
])

const pendingInvitations = computed(() =>
  invitations.value.filter(i => i.status === 'pending')
)

const processedInvitations = computed(() =>
  invitations.value.filter(i => i.status !== 'pending')
)

const pendingCount = computed(() => pendingInvitations.value.length)

const filteredInvitations = computed(() => {
  switch (activeTab.value) {
    case 'pending':
      return pendingInvitations.value
    case 'processed':
      return processedInvitations.value
    case 'sent':
      return sentInvitations.value
    default:
      return []
  }
})

const emptyState = computed(() => {
  const states = {
    pending: {
      title: '暂无待处理的邀请',
      desc: '太棒了！所有邀请都已处理完毕'
    },
    processed: {
      title: '暂无已处理的记录',
      desc: '当你接受或拒绝邀请后，记录会显示在这里'
    },
    sent: {
      title: '还没有发出过邀请',
      desc: '去发现适合你的团队，发出加入申请吧'
    }
  }
  return states[activeTab.value] || states.pending
})

function statusClass(status) {
  const map = {
    pending: 'status-pending',
    accepted: 'status-accepted',
    rejected: 'status-rejected',
    waiting: 'status-waiting'
  }
  return map[status] || 'status-pending'
}

function statusLabel(status) {
  const map = {
    pending: '待处理',
    accepted: '已接受',
    rejected: '已拒绝',
    waiting: '等待回复'
  }
  return map[status] || '待处理'
}

function processedText(invite) {
  if (invite.status === 'waiting') return `已发送 · 等待对方回复`
  if (invite.status === 'accepted') return `已于 ${invite.respondedAt || '2025-04-28'} 接受`
  if (invite.status === 'rejected') return `已于 ${invite.respondedAt || '2025-04-20'} 拒绝`
  return ''
}

function handleReject(invite) {
  invite.status = 'rejected'
  invite.respondedAt = new Date().toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-')
}

function handleAccept(invite) {
  invite.status = 'accepted'
  invite.respondedAt = new Date().toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-')
}

function handleRetry(invite) {
  invite.status = 'pending'
}
</script>

<style scoped>
.invitations-page {
  max-width: 900px;
  margin: 0 auto;
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.75rem 1.5rem;
  background: #fff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--gray-900);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.page-subtitle {
  color: var(--gray-500);
  font-size: 0.9375rem;
  margin-top: 0.375rem;
}

.stat-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-badge.pending {
  background: var(--warning-50);
  color: var(--warning-600);
  animation: pulse 2s infinite;
}

/* 标签页 */
.tabs-container {
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background: var(--gray-100);
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;
}

.tab-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--gray-500);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--gray-700);
  background: rgba(255, 255, 255, 0.6);
}

.tab-btn.active {
  color: var(--primary-700);
  background: white;
  box-shadow: var(--shadow-sm);
  font-weight: 600;
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--primary-100);
  color: var(--primary-700);
}

.tab-btn.active .tab-count {
  background: var(--primary-600);
  color: white;
}

/* 邀请列表 */
.invitation-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cards-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* 邀请卡片 */
.invitation-card {
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  transition: all var(--transition-base);
}

.card-hover:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-200);
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
}

.team-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.team-emoji {
  font-size: 1.65rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
}

.team-info {
  min-width: 0;
}

.team-name {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-900);
  line-height: 1.3;
}

.inviter-info {
  font-size: 0.8125rem;
  color: var(--gray-500);
  margin-top: 0.2rem;
}

.inviter-name {
  color: var(--gray-700);
  font-weight: 500;
}

.inviter-role {
  color: var(--primary-600);
  font-weight: 500;
}

/* 状态徽章 */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-pending {
  background: var(--warning-50);
  color: var(--warning-600);
}

.status-accepted {
  background: var(--success-50);
  color: var(--success-600);
}

.status-rejected {
  background: var(--danger-50);
  color: var(--danger-600);
}

.status-waiting {
  background: var(--accent-50);
  color: var(--accent-600);
}

/* 卡片主体 */
.card-body {
  padding: 1.5rem;
}

.info-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px dashed var(--gray-200);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.info-label {
  font-size: 0.75rem;
  color: var(--gray-400);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.info-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--gray-800);
}

.role-value {
  color: var(--primary-700);
}

/* 匹配度展示 */
.match-item {
  min-width: 160px;
}

.match-score-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.score-circle {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.circular-chart {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circle-bg {
  fill: none;
  stroke: var(--gray-200);
  stroke-width: 3;
}

.circle-progress {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease;
}

.circle-progress.high {
  stroke: var(--success-500);
}

.circle-progress.medium {
  stroke: var(--primary-500);
}

.circle-progress.low {
  stroke: var(--warning-500);
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 800;
}

.score-text.high { color: var(--success-600); }
.score-text.medium { color: var(--primary-600); }
.score-text.low { color: var(--warning-600); }

.star-rating {
  display: flex;
  gap: 1px;
}

.star {
  font-size: 0.8rem;
  color: var(--gray-300);
  transition: color var(--transition-fast);
}

.star.filled {
  color: var(--warning-500);
}

/* 团队信息摘要 */
.team-summary {
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid var(--gray-100);
}

.summary-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 0.625rem;
}

.summary-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--gray-600);
}

.summary-item svg {
  color: var(--gray-400);
  flex-shrink: 0;
}

/* 详情按钮 */
.btn-detail {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--primary-600);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  border: 1px solid var(--primary-200);
  background: var(--primary-50);
}

.btn-detail:hover {
  background: var(--primary-100);
  color: var(--primary-700);
  border-color: var(--primary-300);
  gap: 0.5625rem;
}

.btn-detail svg {
  transition: transform var(--transition-fast);
}

.btn-detail:hover svg {
  transform: translateX(2px);
}

/* 卡片底部 */
.card-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
}

.action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6875rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.reject-btn {
  background: white;
  color: var(--danger-600);
  border: 1px solid var(--danger-200);
}

.reject-btn:hover {
  background: var(--danger-50);
  border-color: var(--danger-400);
  transform: scale(1.02);
}

.accept-btn {
  background: linear-gradient(135deg, var(--success-500), var(--success-600));
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

.accept-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35);
}

.accept-btn:active {
  transform: scale(0.98);
}

/* 已处理状态 */
.processed-footer {
  justify-content: space-between;
  align-items: center;
}

.processed-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
}

.processed-status.accepted {
  background: var(--success-50);
  color: var(--success-600);
}

.processed-status.rejected {
  background: var(--danger-50);
  color: var(--danger-600);
}

.processed-status.waiting {
  background: var(--accent-50);
  color: var(--accent-600);
}

.btn-retry {
  padding: 0.4375rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--primary-600);
  background: white;
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-retry:hover {
  background: var(--primary-50);
  border-color: var(--primary-400);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: var(--radius-xl);
  border: 2px dashed var(--gray-200);
}

.empty-icon-wrapper {
  width: 96px;
  height: 96px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-50);
  border-radius: 50%;
  color: var(--gray-300);
}

.empty-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 0.5rem;
}

.empty-desc {
  color: var(--gray-500);
  font-size: 0.9375rem;
  margin-bottom: 1.5rem;
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
}

.btn-primary-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-600);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 4px 12px rgba(196, 30, 58, 0.25);
}

.btn-primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(196, 30, 58, 0.35);
}

/* 列表过渡动画 */
.list-enter-active {
  animation: slideInUp 0.4s ease-out;
}

.list-leave-active {
  animation: slideOutDown 0.3s ease-in forwards;
}

@keyframes slideOutDown {
  to {
    opacity: 0;
    transform: translateX(-30px) scale(0.95);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.375rem;
  }

  .tabs-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tab-btn {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  .card-header {
    flex-wrap: wrap;
    padding: 1rem 1.25rem;
  }

  .team-icon {
    width: 44px;
    height: 44px;
  }

  .team-emoji {
    font-size: 1.35rem;
  }

  .team-name {
    font-size: 1rem;
  }

  .info-row {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .match-item {
    grid-column: 1 / -1;
    min-width: unset;
  }

  .card-body {
    padding: 1.25rem;
  }

  .card-footer {
    flex-direction: column;
    padding: 1rem 1.25rem;
  }

  .action-btn {
    padding: 0.75rem;
  }

  .processed-footer {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }

  .processed-status {
    justify-content: center;
  }

  .btn-retry {
    text-align: center;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 1.25rem;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .tabs-container {
    border-radius: var(--radius-md);
  }

  .tab-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }

  .tab-label {
    display: none;
  }

  .tab-btn.active .tab-label {
    display: inline;
  }

  .info-row {
    grid-template-columns: 1fr;
  }

  .match-score-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .summary-list {
    gap: 0.375rem;
  }

  .summary-item {
    font-size: 0.75rem;
  }

  .empty-state {
    padding: 3rem 1.25rem;
  }

  .empty-icon-wrapper {
    width: 72px;
    height: 72px;
  }
}
</style>
