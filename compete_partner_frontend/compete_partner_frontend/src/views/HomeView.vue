<template>
  <div class="home-page animate-fade-in">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          欢迎回来，<span class="gradient-text">{{ userName }}</span> 👋
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
        <div class="stat-icon purple">
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
          <h2 class="section-title">🔥 推荐团队</h2>
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
        <div class="action-icon gradient-blue">
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
        <div class="action-icon gradient-purple">
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
        <div class="action-icon gradient-green">
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
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
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
    gradient: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
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
  margin-bottom: 2.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(102, 126, 234, 0.15);
}

.welcome-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  color: var(--gray-900);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary-600), var(--accent-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, var(--primary-600), var(--accent-600));
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);
  white-space: nowrap;
}

.btn-create:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
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
  gap: 1.25rem;
  padding: 1.75rem;
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:nth-child(1)::before { background: linear-gradient(90deg, #3B82F6, #60A5FA); }
.stat-card:nth-child(2)::before { background: linear-gradient(90deg, #10B981, #34D399); }
.stat-card:nth-child(3)::before { background: linear-gradient(90deg, #8B5CF6, #A78BFA); }
.stat-card:nth-child(4)::before { background: linear-gradient(90deg, #F59E0B, #FBBF24); }

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-icon.blue { background: linear-gradient(135deg, #3B82F6, #2563EB); }
.stat-icon.green { background: linear-gradient(135deg, #10B981, #059669); }
.stat-icon.purple { background: linear-gradient(135deg, #8B5CF6, #7C3AED); }
.stat-icon.orange { background: linear-gradient(135deg, #F59E0B, #D97706); }

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
  font-size: 2rem;
  font-weight: 800;
  color: var(--gray-900);
  line-height: 1;
}

.stat-value.highlight {
  color: var(--danger-500);
  animation: pulse 2s infinite;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
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
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  cursor: pointer;
  transition: all var(--transition-base);
}

.team-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: transparent;
}

.card-cover {
  height: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-emoji {
  font-size: 4rem;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
  animation: float 3s ease-in-out infinite;
}

.card-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.card-status.recruiting { color: var(--success-600); }
.card-status.urgent { color: var(--danger-500); }
.card-status.full { color: var(--gray-500); }

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
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
  padding: 0.25rem 0.75rem;
  background: var(--primary-50);
  color: var(--primary-700);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--primary-100);
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
  background: linear-gradient(135deg, var(--primary-600), var(--accent-600));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-apply:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.action-card:hover {
  transform: translateX(6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-200);
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.gradient-blue { background: linear-gradient(135deg, #3B82F6, #2563EB); }
.gradient-purple { background: linear-gradient(135deg, #8B5CF6, #7C3AED); }
.gradient-green { background: linear-gradient(135deg, #10B981, #059669); }

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
  transform: translateX(4px);
  color: var(--primary-600);
}

.badge-count {
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background: linear-gradient(135deg, var(--danger-500), #DC2626);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  animation: pulse 2s infinite;
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
