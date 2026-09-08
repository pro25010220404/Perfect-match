<template>
  <div class="teams-page animate-fade-in">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon"><LineIcon name="search" :size="26" /></span>
          团队广场
        </h1>
        <p class="page-subtitle">发现志同道合的队友，加入心仪的团队</p>
      </div>
      <router-link to="/create-team" class="btn-create-team">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        创建团队
      </router-link>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-section">
      <div class="filter-card">
        <div class="filter-row">
          <!-- 状态筛选 -->
          <div class="filter-group">
            <label class="filter-label">状态</label>
            <select v-model="filters.status" class="filter-select">
              <option value="">全部状态</option>
              <option value="recruiting">招募中</option>
              <option value="in-progress">进行中</option>
              <option value="completed">已结束</option>
            </select>
          </div>

          <!-- 竞赛类型筛选 -->
          <div class="filter-group">
            <label class="filter-label">竞赛类型</label>
            <select v-model="filters.competitionType" class="filter-select">
              <option value="">全部类型</option>
              <option value="ai">人工智能</option>
              <option value="robotics">机器人/机甲</option>
              <option value="math-modeling">数学建模</option>
              <option value="smart-car">智能汽车</option>
              <option value="software">软件开发</option>
              <option value="data-analysis">数据分析</option>
            </select>
          </div>

          <!-- 排序方式 -->
          <div class="filter-group">
            <label class="filter-label">排序</label>
            <select v-model="filters.sortBy" class="filter-select">
              <option value="latest">最新发布</option>
              <option value="members">成员最多</option>
              <option value="rating">信誉最高</option>
              <option value="deadline">即将截止</option>
            </select>
          </div>

          <!-- 搜索框 -->
          <div class="search-group">
            <label class="filter-label">搜索</label>
            <div class="search-input-wrapper">
              <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                v-model="filters.search"
                type="text"
                class="search-input"
                placeholder="搜索团队名称或描述..."
                @input="handleSearch"
              />
              <button v-if="filters.search" class="clear-btn" aria-label="清空搜索" @click="clearSearch">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- 重置按钮 -->
          <button class="btn-reset" @click="resetFilters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
            重置
          </button>
        </div>

        <!-- 结果统计 -->
        <div class="filter-stats">
          <span class="stats-text">
            共找到 <strong>{{ filteredTeams.length }}</strong> 个团队
          </span>
          <div class="view-toggle">
            <button
              :class="['toggle-btn', { active: viewMode === 'grid' }]"
              aria-label="网格视图"
              @click="viewMode = 'grid'"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              :class="['toggle-btn', { active: viewMode === 'list' }]"
              aria-label="列表视图"
              @click="viewMode = 'list'"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 团队列表 - 网格视图 -->
    <div v-if="viewMode === 'grid'" class="teams-grid">
      <TeamCard
        v-for="team in paginatedTeams"
        :key="team.id"
        :team="team"
        :keyword="filters.search"
        @view="(team) => $router.push(`/teams/${team.id}`)"
        @apply="handleApply"
      />
    </div>

    <!-- 团队列表 - 列表视图 -->
    <div v-else class="teams-list">
      <div
        v-for="team in paginatedTeams"
        :key="team.id"
        class="list-item"
        @click="$router.push(`/teams/${team.id}`)"
      >
        <!-- 列表项封面 -->
        <div class="list-cover">
          <div class="cover-emoji"><LineIcon :name="team.emoji" :size="36" /></div>
        </div>

        <!-- 列表项内容 -->
        <div class="list-content">
          <div class="list-header">
            <h3 class="list-title" v-html="highlightMatch(team.name, filters.search)"></h3>
            <span :class="['status-badge', team.statusClass]">{{ statusText(team.status) }}</span>
          </div>

          <p class="list-desc" v-html="highlightMatch(team.description, filters.search)"></p>

          <div class="list-meta">
            <span class="meta-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              队长: {{ team.leader }}
            </span>
            <span class="meta-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {{ team.rating }}
            </span>
            <span class="meta-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              成员: {{ team.members }}/{{ team.maxMembers }}
            </span>
            <span class="meta-tag deadline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              截止: {{ team.deadline }}
            </span>
          </div>

          <div class="list-roles">
            <span
              v-for="(role, index) in team.roles"
              :key="index"
              :class="['role-tag', role.filled ? 'filled' : role.urgent ? 'urgent' : '']"
            >
              {{ role.name }}
            </span>
          </div>
        </div>

        <!-- 列表项操作 -->
        <div class="list-actions">
          <router-link :to="`/teams/${team.id}`" class="btn-view-list" @click.stop>
            查看详情
          </router-link>
          <button class="btn-apply-list" @click.stop="handleApply(team)">
            申请加入
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredTeams.length === 0" class="empty-state">
      <div class="empty-icon"><LineIcon name="search" :size="48" :stroke-width="1.5" /></div>
      <h3 class="empty-title">没有找到匹配的团队</h3>
      <p class="empty-desc">试试调整筛选条件或搜索关键词</p>
      <button class="btn-reset-empty" @click="resetFilters">重置筛选条件</button>
    </div>

    <!-- 分页组件 -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        class="page-btn"
        aria-label="上一页"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <template v-for="page in displayPages" :key="page">
        <button
          v-if="page !== '...'"
          :class="['page-btn', 'page-num', { active: currentPage === page }]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <span v-else class="page-ellipsis">...</span>
      </template>

      <button
        class="page-btn"
        aria-label="下一页"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <ApplicationForm
      :visible="showApply"
      :roles="applyRoles"
      @close="closeApplyModal"
      @submit="submitApply"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import LineIcon from '../components/LineIcon.vue'
import TeamCard from '../components/team/TeamCard.vue'
import ApplicationForm from '../components/team/ApplicationForm.vue'
import { teams } from '../mock/teamMessage.js'
import { useToast } from '../composables/useToast'
import { highlightMatch } from '../utils/highlight.js'

const route = useRoute()
const { toast } = useToast()

const viewMode = ref('list')
const currentPage = ref(1)
const itemsPerPage = ref(6)

const filters = ref({
  search: route.query.q || '',
  status: '',
  competitionType: '',
  sortBy: 'latest'
})

const showApply = ref(false)
const applyTeam = ref(null)
const applyRoles = computed(() =>
  (applyTeam.value?.roles || []).map((r) => r.name.replace(/\s+\d+\/\d+$/, ''))
)

const teamsData = ref(teams)

const filteredTeams = computed(() => {
  let result = [...teamsData.value]

  if (filters.value.search) {
    const keyword = filters.value.search.toLowerCase()
    result = result.filter(
      team =>
        team.name.toLowerCase().includes(keyword) ||
        team.description.toLowerCase().includes(keyword) ||
        team.roles.some((r) => r.name.toLowerCase().includes(keyword))
    )
  }

  if (filters.value.status) {
    result = result.filter(team => team.status === filters.value.status)
  }

  if (filters.value.competitionType) {
    result = result.filter(team => team.competitionType === filters.value.competitionType)
  }

  switch (filters.value.sortBy) {
    case 'latest':
      break
    case 'members':
      result.sort((a, b) => b.members - a.members)
      break
    case 'rating':
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      break
    case 'deadline':
      result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      break
  }

  return result
})

const totalPages = computed(() =>
  Math.ceil(filteredTeams.value.length / itemsPerPage.value)
)

const paginatedTeams = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTeams.value.slice(start, end)
})

const displayPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

watch([() => filters.value.status, () => filters.value.competitionType, () => filters.value.sortBy], () => {
  currentPage.value = 1
})

watch(() => route.query.q, (q) => {
  filters.value.search = q || ''
  currentPage.value = 1
})

const handleSearch = () => {
  currentPage.value = 1
}

const clearSearch = () => {
  filters.value.search = ''
  currentPage.value = 1
}

const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    competitionType: '',
    sortBy: 'latest'
  }
  currentPage.value = 1
}

const handleApply = (team) => {
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

const statusText = (status) => {
  const map = {
    recruiting: '招募中',
    urgent: '急招中',
    'in-progress': '进行中',
    completed: '已结束'
  }
  return map[status] || status
}
</script>

<style scoped>
.teams-page {
  max-width: 1280px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 0.5rem 0 2rem;
  border-bottom: 1px solid var(--line);
}

.header-content {
  flex: 1;
}

.page-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  color: var(--gray-900);
  letter-spacing: -0.02em;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-icon {
  display: inline-flex;
  align-items: center;
  color: var(--nav-blue-deep);
}

.page-subtitle {
  color: var(--gray-500);
  font-size: 1rem;
  margin-top: 0.5rem;
  margin-left: 2.75rem;
}

.btn-create-team {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: var(--nav-blue-deep);
  color: white;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: background var(--transition-base);
  white-space: nowrap;
}

.btn-create-team:hover {
  background: var(--nav-blue-deeper);
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 2rem;
}

.filter-card {
  padding: 0 0 1.25rem;
  border-bottom: 1px solid var(--line);
}

.filter-row {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 160px;
}

.filter-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-select {
  padding: 0.625rem 2.25rem 0.625rem 0.875rem;
  font-size: 0.875rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 0.75rem center;
  appearance: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--gray-700);
  font-weight: 500;
}

.filter-select:hover {
  border-color: var(--nav-blue);
}

.filter-select:focus {
  outline: none;
  border-color: var(--nav-blue);
  box-shadow: 0 0 0 3px rgba(94, 179, 228, 0.15);
}

/* 搜索框 */
.search-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 250px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  color: var(--gray-400);
  pointer-events: none;
  transition: color var(--transition-fast);
}

.search-input {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 2.5rem;
  font-size: 0.875rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: white;
  transition: all var(--transition-fast);
  color: var(--gray-700);
}

.search-input::placeholder {
  color: var(--gray-400);
}

.search-input:hover {
  border-color: var(--nav-blue);
}

.search-input:focus {
  outline: none;
  border-color: var(--nav-blue);
  box-shadow: 0 0 0 3px rgba(94, 179, 228, 0.15);
}

.search-input:focus ~ .search-icon {
  color: var(--nav-blue);
}

.clear-btn {
  position: absolute;
  right: 0.5rem;
  background: var(--gray-100);
  border: none;
  border-radius: var(--radius-full);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gray-500);
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  background: var(--nav-blue-50);
  color: var(--nav-blue-dark);
}

/* 重置按钮 */
.btn-reset {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  background: var(--gray-100);
  color: var(--gray-600);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  align-self: flex-end;
}

.btn-reset:hover {
  background: var(--nav-blue-50);
  border-color: var(--nav-blue);
  color: var(--nav-blue-dark);
}

/* 筛选统计 */
.filter-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-100);
}

.stats-text {
  font-size: 0.875rem;
  color: var(--gray-500);
}

.stats-text strong {
  color: var(--nav-blue-dark);
  font-weight: 700;
}

.view-toggle {
  display: flex;
  gap: 0.375rem;
  background: var(--gray-100);
  padding: 0.25rem;
  border-radius: var(--radius-md);
}

.toggle-btn {
  padding: 0.375rem 0.625rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--gray-400);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  background: var(--nav-blue-50);
  color: var(--nav-blue-dark);
}

.toggle-btn.active {
  background: white;
  color: var(--nav-blue-dark);
  box-shadow: var(--shadow-xs);
}

/* 团队网格 */
.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 角色标签 */
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

/* 列表视图 */
.teams-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.list-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  transition: background var(--transition-base);
}

.list-item:hover {
  background: var(--nav-blue-50);
}

.list-cover {
  background: linear-gradient(135deg, #f5f5a5ff 0%, #a1e4f7ff 100%);
  width: 180px;
  height: 130px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.cover-emoji {
  display: inline-flex;
  color: var(--ink);
}

.list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-900);
}

.list-desc {
  color: var(--gray-500);
  font-size: 0.9375rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--gray-500);
  font-weight: 500;
}

.meta-tag svg {
  color: var(--gray-400);
}

.meta-tag.deadline {
  color: var(--warning-600);
}

.meta-tag.deadline svg {
  color: var(--warning-500);
}

.list-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.list-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
  flex-shrink: 0;
}

.btn-view-list {
  padding: 0.625rem 1.25rem;
  background: var(--gray-50);
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  text-align: center;
  text-decoration: none;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-view-list:hover {
  background: var(--nav-blue-50);
  border-color: var(--nav-blue);
  color: var(--nav-blue-dark);
}

.btn-apply-list {
  padding: 0.625rem 1.25rem;
  background: var(--nav-blue-deep);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background var(--transition-fast);
  white-space: nowrap;
}

.btn-apply-list:hover {
  background: var(--nav-blue-deeper);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--line-strong);
  margin-bottom: 2rem;
}

.empty-icon {
  color: var(--gray-300);
  margin-bottom: 1rem;
}

.empty-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.empty-desc {
  color: var(--gray-500);
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.btn-reset-empty {
  padding: 0.75rem 1.5rem;
  background: var(--nav-blue-deep);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: background var(--transition-base);
}

.btn-reset-empty:hover {
  background: var(--nav-blue-deeper);
}

/* 分页 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
  margin-bottom: 2rem;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: white;
  color: var(--gray-700);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-btn:hover:not(:disabled) {
  background: var(--nav-blue-50);
  border-color: var(--nav-blue);
  color: var(--nav-blue-dark);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-num {
  min-width: 40px;
}

.page-num.active {
  background: var(--nav-blue-deep);
  border-color: transparent;
  color: white;
}

.page-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--gray-400);
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .teams-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  .list-item {
    flex-direction: column;
  }

  .list-cover {
    width: 100%;
    height: 140px;
  }

  .list-actions {
    flex-direction: row;
    width: 100%;
  }

  .btn-view-list,
  .btn-apply-list {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    margin-left: 0;
  }

  .btn-create-team {
    width: 100%;
    justify-content: center;
  }

  .filter-row {
    flex-direction: column;
  }

  .filter-group,
  .search-group {
    width: 100%;
    min-width: auto;
  }

  .filter-stats {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .view-toggle {
    align-self: flex-end;
  }

  .teams-grid {
    grid-template-columns: 1fr;
  }

  .list-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.25rem;
  }

  .filter-card {
    padding: 1rem;
  }

  .list-item {
    padding: 1rem;
  }
}
</style>
