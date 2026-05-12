<template>
  <div class="home-page animate-fade-in">
    <el-card class="welcome-card" shadow="never">
      <el-row justify="space-between" align="middle">
        <el-col :xs="24" :md="16">
          <el-text tag="h1" class="welcome-title">
            欢迎回来，
            <el-text type="primary" tag="span" class="accent-name">{{ userName }}</el-text>
          </el-text>
          <el-text type="info" class="welcome-subtitle">
            今天是寻找理想队友的好日子，看看有没有适合你的团队
          </el-text>
        </el-col>
        <el-col :xs="24" :md="8" class="welcome-actions">
          <el-button type="primary" @click="$router.push('/create-team')">
            <el-icon class="el-icon--left"><Plus /></el-icon>
            创建团队
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="16" class="stats-row">
      <el-col v-for="stat in stats" :key="stat.label" :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <el-space>
            <el-icon :size="24" :class="stat.iconClass">
              <component :is="stat.icon" />
            </el-icon>
            <div>
              <el-text type="info" size="small" class="stat-label">{{ stat.label }}</el-text>
              <el-text tag="div" class="stat-value">{{ stat.value }}</el-text>
            </div>
          </el-space>
        </el-card>
      </el-col>
    </el-row>

    <div class="section-block">
      <el-row justify="space-between" align="middle" class="section-header">
        <el-col :xs="24" :md="16">
          <el-text tag="h2" class="section-title">推荐团队</el-text>
          <el-text type="info" size="small" class="section-subtitle">根据你的技能和兴趣智能推荐</el-text>
        </el-col>
        <el-col :xs="24" :md="8" class="section-actions">
          <el-button text type="primary" @click="$router.push('/teams')">
            查看全部
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col
          v-for="team in recommendedTeams"
          :key="team.id"
          :xs="24"
          :sm="12"
          :lg="8"
        >
          <el-card class="team-card" shadow="hover" @click="$router.push(`/teams/${team.id}`)">
            <div class="card-cover" :style="{ background: team.gradient }">
              <span class="card-emoji">{{ team.emoji }}</span>
              <el-tag
                class="status-tag"
                :type="statusTagType(team.statusClass)"
                size="small"
                effect="dark"
              >
                {{ team.status }}
              </el-tag>
            </div>
            <div class="card-body">
              <el-text tag="div" class="card-title">{{ team.name }}</el-text>
              <el-text type="info" size="small" class="card-desc">{{ team.description }}</el-text>
              <el-space wrap :size="8" class="card-meta">
                <el-text type="info" size="small">
                  <el-icon><User /></el-icon>
                  {{ team.members }}/{{ team.maxMembers }}
                </el-text>
                <el-text type="info" size="small">
                  <el-icon><Star /></el-icon>
                  {{ team.rating }}
                </el-text>
                <el-text type="warning" size="small">
                  <el-icon><Clock /></el-icon>
                  {{ team.deadline }}
                </el-text>
              </el-space>
              <el-space wrap :size="6" class="roles-row">
                <el-tag v-for="role in team.roles" :key="role" size="small" effect="plain">
                  {{ role }}
                </el-tag>
              </el-space>
              <el-divider class="card-divider" />
              <el-row :gutter="8">
                <el-col :span="12">
                  <router-link :to="`/teams/${team.id}`" class="router-fill" @click.stop>
                    <el-button class="w-full">查看详情</el-button>
                  </router-link>
                </el-col>
                <el-col :span="12">
                  <el-button type="primary" class="w-full" @click.stop="showApplyModal(team)">
                    申请加入
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="16" class="quick-row">
      <el-col :xs="24" :md="8">
        <el-card shadow="hover" class="action-card" @click="$router.push('/recommendations')">
          <el-space>
            <el-avatar :size="44" class="tone-brand">
              <el-icon :size="22"><Search /></el-icon>
            </el-avatar>
            <div>
              <el-text tag="div" class="action-title">智能匹配</el-text>
              <el-text type="info" size="small">发现最适合你的队友</el-text>
            </div>
            <el-icon class="arrow"><ArrowRight /></el-icon>
          </el-space>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card shadow="hover" class="action-card" @click="$router.push('/invitations')">
          <el-space>
            <el-badge :value="2" class="badge-wrap">
              <el-avatar :size="44" class="tone-slate">
                <el-icon :size="22"><Bell /></el-icon>
              </el-avatar>
            </el-badge>
            <div>
              <el-text tag="div" class="action-title">我的邀请</el-text>
              <el-text type="info" size="small">查看待处理的团队邀请</el-text>
            </div>
          </el-space>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card shadow="hover" class="action-card" @click="$router.push('/profile')">
          <el-space>
            <el-avatar :size="44" class="tone-green">
              <el-icon :size="22"><User /></el-icon>
            </el-avatar>
            <div>
              <el-text tag="div" class="action-title">个人中心</el-text>
              <el-text type="info" size="small">管理你的技能和资料</el-text>
            </div>
            <el-icon class="arrow"><ArrowRight /></el-icon>
          </el-space>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Plus,
  ArrowRight,
  User,
  Star,
  Clock,
  Search,
  Bell,
  Trophy,
} from '@element-plus/icons-vue'

const userName = ref('张三')

const stats = computed(() => [
  { label: '我的团队', value: 3, icon: User, iconClass: 'icon-muted' },
  { label: '参与竞赛', value: 8, icon: Trophy, iconClass: 'icon-muted' },
  { label: '信誉评分', value: '4.8', icon: Star, iconClass: 'icon-muted' },
  { label: '待处理邀请', value: 2, icon: Bell, iconClass: 'text-primary' },
])

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
    roles: ['算法工程师', '嵌入式开发', '机械设计'],
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
    roles: ['Python开发', '算法设计', '前端开发'],
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
    roles: ['编程手', '论文写作', '建模'],
  },
])

function statusTagType(statusClass) {
  if (statusClass === 'urgent') return 'danger'
  if (statusClass === 'full') return 'info'
  return 'success'
}

const showApplyModal = (team) => {
  console.log('Apply to:', team.name)
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  margin-bottom: 1.25rem;
}

.welcome-title {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.accent-name {
  font-weight: 600;
}

.welcome-subtitle {
  display: block;
}

.welcome-actions {
  text-align: right;
  margin-top: 0.75rem;
}

@media (min-width: 768px) {
  .welcome-actions {
    margin-top: 0;
  }
}

.stats-row {
  margin-bottom: 1.5rem;
}

.stat-card :deep(.el-card__body) {
  padding: 1rem 1.25rem;
}

.stat-label {
  display: block;
}

.stat-value {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
}

.section-actions {
  text-align: right;
  margin-top: 0.5rem;
}

@media (min-width: 768px) {
  .section-actions {
    margin-top: 0;
  }
}

.card-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.5rem;
  min-height: 2.4rem;
  line-height: 1.45;
  color: var(--el-text-color-secondary);
}

.icon-muted {
  color: var(--el-text-color-secondary);
}

.text-primary {
  color: var(--el-color-primary);
}

.section-block {
  margin-bottom: 1.5rem;
}

.section-header {
  margin-bottom: 1rem;
}

.section-title {
  display: block;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.section-subtitle {
  display: block;
}

.team-card {
  cursor: pointer;
  margin-bottom: 0;
}

.team-card :deep(.el-card__body) {
  padding: 0;
}

.card-cover {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-emoji {
  font-size: 2.5rem;
}

.status-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.card-body {
  padding: 1rem 1rem 1.1rem;
}

.card-title {
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 0.35rem;
}

.card-meta {
  margin-bottom: 0.25rem;
}

.roles-row {
  margin-bottom: 0.35rem;
}

.card-divider {
  margin: 0.75rem 0;
}

.router-fill {
  display: block;
  width: 100%;
  text-decoration: none;
}

.w-full {
  width: 100%;
}

.quick-row {
  margin-bottom: 1rem;
}

.action-card {
  cursor: pointer;
  margin-bottom: 1rem;
}

.action-card :deep(.el-card__body) {
  padding: 1rem 1.25rem;
}

.action-title {
  font-weight: 600;
}

.arrow {
  margin-left: auto;
  color: var(--el-text-color-secondary);
}

.tone-brand {
  background: var(--el-color-primary) !important;
  color: #fff;
}

.tone-slate {
  background: var(--el-color-info) !important;
  color: #fff;
}

.tone-green {
  background: var(--el-color-success) !important;
  color: #fff;
}

.badge-wrap :deep(.el-badge__content) {
  border: none;
}
</style>
