<template>
  <div class="home-page animate-fade-in">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          欢迎回来，<span class="accent-name">{{ userName }}</span>
        </h1>
        <p class="welcome-subtitle">
          今天是寻找理想队友的好日子，看看有没有适合你的团队
        </p>
      </div>
      <button class="btn-create" @click="$router.push('/create-team')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        创建团队
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">我的团队</span>
          <span class="stat-value">3</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">参与竞赛</span>
          <span class="stat-value">8</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon slate">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">信誉评分</span>
          <span class="stat-value">4.8</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">待处理邀请</span>
          <span class="stat-value highlight">2</span>
        </div>
      </div>
    </div>

    <!-- 推荐团队 -->
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">推荐团队</h2>
          <p class="section-subtitle">根据你的技能和兴趣智能推荐</p>
        </div>
        <router-link to="/teams" class="view-all">
          查看全部
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </router-link>
      </div>

      <div class="teams-grid">
        <button class="team-card" @click="$router.push(`/teams/${team.id}`)" @keydown.enter="$router.push(`/teams/${team.id}`)" v-for="team in recommendedTeams" :key="team.id">
          <div class="card-cover" :style="{ background: team.gradient }">
            <div class="card-emoji">{{ team.emoji }}</div>
            <div class="card-status" :class="team.statusClass">{{ team.status }}</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ team.name }}</h3>
            <p class="card-desc">{{ team.description }}</p>

            <div class="card-meta">
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                {{ team.members }}/{{ team.maxMembers }}
              </span>
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                {{ team.rating }}
              </span>
              <span class="meta-item deadline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ team.deadline }}
              </span>
            </div>

            <div class="roles-tags">
              <span v-for="role in team.roles" :key="role" class="role-tag">{{ role }}</span>
            </div>

            <div class="card-footer">
              <router-link :to="`/teams/${team.id}`" class="btn-view">查看详情</router-link>
              <button class="btn-apply" @click.stop="showApplyModal(team)">申请加入</button>
            </div>
          </div>
        </button>
      </div>
    </section>

    <!-- 快速操作 -->
    <section class="quick-actions">
      <button class="action-card" @click="$router.push('/recommendations')" aria-label="前往智能匹配页面">
        <div class="action-icon tone-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <div class="action-content">
          <h4>智能匹配</h4>
          <p>发现最适合你的队友</p>
        </div>
        <svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <button class="action-card" @click="$router.push('/invitations')" aria-label="查看我的邀请">
        <div class="action-icon tone-slate">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <div class="action-content">
          <h4>我的邀请</h4>
          <p>查看待处理的团队邀请</p>
        </div>
        <span class="badge-count">2</span>
      </button>

      <button class="action-card" @click="$router.push('/profile')" aria-label="前往个人中心">
        <div class="action-icon tone-green">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="action-content">
          <h4>个人中心</h4>
          <p>管理你的技能和资料</p>
        </div>
        <svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const userName = ref('张三')

const recommendedTeams = ref([
  {
    id: 1,
    name: '无人车战队',
    emoji: '🏎️',
    description: '目标：全国大学生智能汽车竞赛一等奖',
    members: 3,
    maxMembers: 6,
    rating: '4.9',
    deadline: '截止 2025-12-31',
    status: '招募中',
    statusClass: 'recruiting',
    gradient: '#27272a',
    roles: ['算法工程师', '嵌入式开发', '机械设计']
  },
  {
    id: 2,
    name: 'AI创新挑战赛',
    emoji: '🤖',
    description: '专注人工智能创新应用开发，探索AI边界',
    members: 2,
    maxMembers: 5,
    rating: '4.7',
    deadline: '截止 2025-11-15',
    status: '急招',
    statusClass: 'urgent',
    gradient: '#3f3f46',
    roles: ['Python开发', '算法设计', '前端开发']
  },
  {
    id: 3,
    name: '数学建模竞赛队',
    emoji: '📊',
    description: '参加全国大学生数学建模竞赛，冲刺国奖',
    members: 4,
    maxMembers: 4,
    rating: '4.8',
    deadline: '截止 2025-09-30',
    status: '已满员',
    statusClass: 'full',
    gradient: '#1e3a5f',
    roles: ['编程手', '论文写作', '建模']
  }
])

const showApplyModal = (team) => {
  console.log('Apply to:', team.name)
}
</script>

<style scoped>
.home-page {
  max-width: 1280px;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.75rem 1.5rem;
  background: #fff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
}

.welcome-title {
  font-family: var(--font-display);
  font-size: 1.625rem;
  font-weight: 600;
  color: var(--gray-900);
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.accent-name {
  color: var(--primary-600);
  font-weight: 600;
}

.welcome-subtitle {
  color: var(--gray-500);
  font-size: 1rem;
  margin-top: 0.5rem;
}

.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: var(--primary-600);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast);
  white-space: nowrap;
}

.btn-create:hover {
  background: var(--primary-700);
  box-shadow: var(--shadow-md);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.375rem;
  background: #fff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.stat-card:hover {
  border-color: var(--gray-300);
  box-shadow: var(--shadow-sm);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.stat-icon.blue { background: var(--accent-700); }
.stat-icon.green { background: var(--success-600); }
.stat-icon.slate { background: #52525b; }
.stat-icon.orange { background: var(--warning-600); }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--gray-500);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  line-height: 1;
}

.stat-value.highlight {
  color: var(--primary-600);
}

.section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
  letter-spacing: -0.01em;
}

.section-subtitle {
  color: var(--gray-500);
  font-size: 0.9375rem;
}

.view-all {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--primary-600);
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all var(--transition-fast);
}

.view-all:hover {
  gap: 0.625rem;
  color: var(--primary-700);
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.team-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--gray-200);
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.team-card:hover {
  border-color: var(--gray-300);
  box-shadow: var(--shadow-md);
}

.card-cover {
  height: 120px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-emoji {
  font-size: 2.75rem;
  opacity: 0.95;
}

.card-status {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-sm);
  font-size: 0.6875rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.card-status.recruiting { color: var(--success-600); }
.card-status.urgent { color: var(--danger-500); }
.card-status.full { color: var(--gray-500); }

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.375rem;
}

.card-desc {
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
  font-size: 0.8125rem;
  color: var(--gray-500);
  flex-wrap: wrap;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.meta-item.deadline {
  color: var(--warning-600);
  font-weight: 500;
}

.roles-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.role-tag {
  padding: 0.1875rem 0.5rem;
  background: var(--gray-100);
  color: var(--gray-700);
  border-radius: var(--radius-sm);
  font-size: 0.6875rem;
  font-weight: 500;
  border: 1px solid var(--gray-200);
}

.card-footer {
  display: flex;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--gray-100);
}

.btn-view {
  flex: 1;
  padding: 0.625rem 1rem;
  text-align: center;
  background: var(--gray-50);
  color: var(--gray-700);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.btn-view:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}

.btn-apply {
  flex: 1;
  padding: 0.625rem 1rem;
  background: var(--primary-600);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.btn-apply:hover {
  background: var(--primary-700);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.375rem;
  background: #fff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  position: relative;
}

.action-card:hover {
  border-color: var(--gray-300);
  box-shadow: var(--shadow-sm);
}

.action-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.tone-brand { background: var(--primary-600); }
.tone-slate { background: var(--accent-600); }
.tone-green { background: var(--success-600); }

.action-content h4 {
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.action-content p {
  color: var(--gray-500);
  font-size: 0.875rem;
}

.arrow-icon {
  color: var(--gray-400);
  margin-left: auto;
  transition: transform var(--transition-fast);
}

.action-card:hover .arrow-icon {
  transform: translateX(3px);
  color: var(--primary-600);
}

.badge-count {
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: var(--primary-600);
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .btn-create {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .teams-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
