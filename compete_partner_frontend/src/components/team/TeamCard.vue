<template>
  <div class="team-card" @click="$emit('view', team)">
    <!-- 卡片封面 -->
    <div class="card-cover">
      <div class="card-emoji"><LineIcon :name="team.emoji" :size="40" /></div>
      <div :class="['status-badge', team.statusClass]">{{ statusText(team.status) }}</div>
      <div class="cover-overlay"></div>
    </div>

    <!-- 卡片内容 -->
    <div class="card-body">
      <h3 class="card-title" v-html="highlightMatch(team.name, keyword)"></h3>
      <p class="card-description" v-html="highlightMatch(team.description, keyword)"></p>

      <!-- 团队元信息 -->
      <div class="card-meta">
        <div class="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
          <span>{{ team.leader }}</span>
        </div>
        <div class="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>{{ team.rating }}</span>
        </div>
        <div class="meta-item members">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span>{{ team.members }}/{{ team.maxMembers }}</span>
        </div>
      </div>

      <!-- 角色标签 -->
      <div class="roles-container">
        <span
          v-for="(role, index) in team.roles.slice(0, 3)"
          :key="index"
          :class="['role-tag', role.filled ? 'filled' : role.urgent ? 'urgent' : '']"
        >
          {{ role.name }}
        </span>
        <span v-if="team.roles.length > 3" class="role-tag more">
          +{{ team.roles.length - 3 }}
        </span>
      </div>

      <!-- 卡片底部 -->
      <div class="card-footer">
        <div class="deadline-info">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>截止 {{ team.deadline }}</span>
        </div>
        <div class="card-actions">
          <button class="btn-view" @click.stop="$emit('view', team)">
            查看详情
          </button>
          <button class="btn-apply" @click.stop="$emit('apply', team)">
            申请加入
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LineIcon from '../LineIcon.vue'
import { highlightMatch } from '../../utils/highlight.js'

defineProps({
  team: { type: Object, required: true },
  keyword: { type: String, default: '' }
})

defineEmits(['view', 'apply'])

const statusText = (status) => {
  const map = {
    recruiting: '招募中',
    urgent: '急招中',
    'in-progress': '进行中',
    completed: '已结束',
    full: '已满员'
  }
  return map[status] || status
}
</script>

<style scoped>
.team-card {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--line-strong);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.team-card:hover {
  border-color: var(--nav-blue);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 卡片封面 */
.card-cover {
  background: linear-gradient(135deg, #f5f5a5ff 0%, #a1e4f7ff 100%);
  height: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-emoji {
  display: inline-flex;
  color: var(--ink);
  position: relative;
  z-index: 1;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.1));
  pointer-events: none;
}

.status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
  z-index: 2;
  letter-spacing: 0.02em;
}

.status-badge.recruiting {
  background: rgba(255, 255, 255, 0.95);
  color: var(--success-600);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.status-badge.urgent {
  background: rgba(255, 255, 255, 0.95);
  color: var(--danger-500);
  animation: pulse 2s infinite;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
}

.status-badge.in-progress {
  background: rgba(255, 255, 255, 0.95);
  color: var(--warning-600);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
}

.status-badge.completed {
  background: rgba(255, 255, 255, 0.95);
  color: var(--gray-500);
}

.status-badge.full {
  background: rgba(255, 255, 255, 0.95);
  color: var(--gray-500);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 卡片主体 */
.card-body {
  padding: 1.5rem;
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.card-description {
  color: var(--gray-500);
  font-size: 0.9375rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--gray-500);
  font-weight: 500;
}

.meta-item svg {
  color: var(--gray-400);
}

.meta-item.members {
  color: var(--nav-blue-dark);
  font-weight: 600;
}

.meta-item.members svg {
  color: var(--nav-blue);
}

/* 角色标签 */
.roles-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.role-tag {
  padding: 0.25rem 0.75rem;
  background: var(--nav-blue-50);
  color: var(--nav-blue-dark);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--nav-blue-100);
  transition: all var(--transition-fast);
}

.role-tag.filled {
  background: var(--success-50);
  color: var(--success-600);
  border-color: rgba(16, 185, 129, 0.2);
}

.role-tag.urgent {
  background: var(--danger-50);
  color: var(--danger-500);
  border-color: rgba(239, 68, 68, 0.2);
  animation: pulse 2s infinite;
}

.role-tag.more {
  background: var(--gray-100);
  color: var(--gray-600);
  border-color: var(--gray-200);
}

/* 卡片底部 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.25rem;
  border-top: 1px solid var(--gray-100);
  gap: 0.75rem;
}

.deadline-info {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--warning-600);
  font-weight: 500;
}

.deadline-info svg {
  color: var(--warning-500);
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view {
  padding: 0.5rem 0.875rem;
  background: var(--gray-50);
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-view:hover {
  background: var(--nav-blue-50);
  border-color: var(--nav-blue);
  color: var(--nav-blue-dark);
}

.btn-apply {
  padding: 0.5rem 0.875rem;
  background: var(--nav-blue-deep);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background var(--transition-fast);
  white-space: nowrap;
}

.btn-apply:hover {
  background: var(--nav-blue-deeper);
}

</style>
