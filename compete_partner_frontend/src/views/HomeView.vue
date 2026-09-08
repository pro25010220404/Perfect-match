<template>
  <div class="home-page animate-fade-in">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          欢迎回来，<span class="gradient-text">{{ userName }}</span>
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
        <div class="stat-icon gold">
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
          <h2 class="section-title"><LineIcon name="flame" :size="20" /> 推荐团队</h2>
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
        <TeamCard
          v-for="team in recommendedTeams"
          :key="team.id"
          :team="team"
          @view="(team) => $router.push(`/teams/${team.id}`)"
          @apply="showApplyModal"
        />
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
        <div class="action-icon gradient-orange">
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

    <ApplicationForm
      :visible="showApply"
      :roles="applyRoles"
      @close="closeApplyModal"
      @submit="submitApply"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LineIcon from '../components/LineIcon.vue'
import TeamCard from '../components/team/TeamCard.vue'
import ApplicationForm from '../components/team/ApplicationForm.vue'
import { recommendedTeams } from '../mock/teamMessage.js'
import { useUserStore } from '../stores/user'
import { useToast } from '../composables/useToast'

const userStore = useUserStore()
const { toast } = useToast()

const userName = computed(() => userStore.user?.name || '用户')

const showApply = ref(false)
const applyTeam = ref(null)
const applyRoles = computed(() =>
  (applyTeam.value?.roles || []).map((r) => r.name.replace(/\s+\d+\/\d+$/, ''))
)

const showApplyModal = (team) => {
  applyTeam.value = team
  showApply.value = true
}

const closeApplyModal = () => {
  showApply.value = false
}

const submitApply = (payload) => {
  toast(`已提交「${payload.selectedRole}」申请`, 'success')
  closeApplyModal()
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
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 0.5rem 0 2rem;
  border-bottom: 1px solid var(--line);
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
  background: var(--ink);
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
  background: var(--nav-blue-deep);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: transform var(--transition-base), background var(--transition-base);
  white-space: nowrap;
}

.btn-create:hover {
  background: var(--nav-blue-deeper);
}

.stats-grid {
  display: flex;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  padding: 0.5rem 0;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0;
  position: relative;
}

.stat-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.blue { color: var(--nav-blue-deep); }
.stat-icon.green { color: var(--success-600); }
.stat-icon.gold { color: var(--warning-600); }
.stat-icon.orange { color: var(--accent-orange); }

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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-subtitle {
  color: var(--gray-500);
  font-size: 0.9375rem;
}

.view-all {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--nav-blue-dark);
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all var(--transition-fast);
}

.view-all:hover {
  text-decoration: underline;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  flex: 1;
  min-width: 240px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-base);
  position: relative;
}

.action-card:hover {
  background: var(--gray-50);
}

.action-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.gradient-blue { color: var(--nav-blue-deep); }
.gradient-orange { color: var(--accent-orange); }
.gradient-green { color: var(--success-600); }

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

.badge-count {
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background: var(--danger-500);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: var(--radius-full);
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
    gap: 1.5rem;
  }

  .teams-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    flex-direction: column;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
