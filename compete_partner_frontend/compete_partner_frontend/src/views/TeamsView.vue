<template>
  <div class="teams-page animate-fade-in">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">🔍</span>
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
              <button v-if="filters.search" class="clear-btn" @click="clearSearch">
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
      <div
        v-for="team in paginatedTeams"
        :key="team.id"
        class="team-card"
        @click="$router.push(`/teams/${team.id}`)"
      >
        <!-- 卡片封面 -->
        <div class="card-cover" :style="{ background: team.gradient }">
          <div class="card-emoji">{{ team.emoji }}</div>
          <div :class="['status-badge', team.statusClass]">{{ statusText(team.status) }}</div>
          <div class="cover-overlay"></div>
        </div>

        <!-- 卡片内容 -->
        <div class="card-body">
          <h3 class="card-title">{{ team.name }}</h3>
          <p class="card-description">{{ team.description }}</p>

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
              <button class="btn-view" @click.stop="$router.push(`/teams/${team.id}`)">
                查看详情
              </button>
              <button class="btn-apply" @click.stop="handleApply(team)">
                申请加入
              </button>
            </div>
          </div>
        </div>
      </div>
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
        <div class="list-cover" :style="{ background: team.gradient }">
          <div class="cover-emoji">{{ team.emoji }}</div>
        </div>

        <!-- 列表项内容 -->
        <div class="list-content">
          <div class="list-header">
            <h3 class="list-title">{{ team.name }}</h3>
            <span :class="['status-badge', team.statusClass]">{{ statusText(team.status) }}</span>
          </div>

          <p class="list-desc">{{ team.description }}</p>

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
      <div class="empty-icon">🔍</div>
      <h3 class="empty-title">没有找到匹配的团队</h3>
      <p class="empty-desc">试试调整筛选条件或搜索关键词</p>
      <button class="btn-reset-empty" @click="resetFilters">重置筛选条件</button>
    </div>

    <!-- 分页组件 -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        class="page-btn"
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
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const viewMode = ref('grid')
const currentPage = ref(1)
const itemsPerPage = ref(6)

const filters = ref({
  search: '',
  status: '',
  competitionType: '',
  sortBy: 'latest'
})

const teamsData = ref([
  {
    id: 1,
    name: '无人车战队',
    emoji: '🏎️',
    description: '目标：全国大学生智能汽车竞赛一等奖，专注于智能驾驶技术研发与算法优化',
    leader: '李明',
    rating: '4.9',
    members: 3,
    maxMembers: 6,
    deadline: '2025-12-31',
    status: 'recruiting',
    statusClass: 'recruiting',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    competitionType: 'smart-car',
    roles: [
      { name: '算法工程师 1/2', urgent: true },
      { name: '嵌入式开发 1/1', filled: true },
      { name: '机械设计 0/1', urgent: true }
    ]
  },
  {
    id: 2,
    name: 'AI创新挑战赛团队',
    emoji: '🤖',
    description: '专注人工智能创新应用开发，参加中国大学生人工智能创新大赛',
    leader: '王芳',
    rating: '4.7',
    members: 2,
    maxMembers: 5,
    deadline: '2025-11-15',
    status: 'recruiting',
    statusClass: 'recruiting',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    competitionType: 'ai',
    roles: [
      { name: 'Python开发 1/2' },
      { name: '前端开发 0/2', urgent: true },
      { name: '产品经理 0/1' }
    ]
  },
  {
    id: 3,
    name: 'RoboMaster机甲战队',
    emoji: '🦾',
    description: 'RoboMaster机甲大师赛备赛团队，需要机械、电控、算法多方向人才',
    leader: '赵强',
    rating: '4.8',
    members: 4,
    maxMembers: 8,
    deadline: '2025-12-15',
    status: 'recruiting',
    statusClass: 'recruiting',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    competitionType: 'robotics',
    roles: [
      { name: '机械设计 2/3' },
      { name: '电控工程师 2/2', filled: true },
      { name: '视觉算法 1/2' }
    ]
  },
  {
    id: 4,
    name: '数学建模竞赛队',
    emoji: '📊',
    description: '全国大学生数学建模竞赛，寻找建模、编程、写作人才冲刺国奖',
    leader: '孙伟',
    rating: '4.6',
    members: 1,
    maxMembers: 3,
    deadline: '2025-09-01',
    status: 'urgent',
    statusClass: 'urgent',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    competitionType: 'math-modeling',
    roles: [
      { name: '建模手 0/1', urgent: true },
      { name: '编程手 0/1', urgent: true },
      { name: '论文写作 0/1', urgent: true }
    ]
  },
  {
    id: 5,
    name: '大数据分析竞赛组',
    emoji: '📈',
    description: '参加全国高校大数据挑战赛，需要数据挖掘、可视化方向人才',
    leader: '周静',
    rating: '4.5',
    members: 2,
    maxMembers: 4,
    deadline: '2025-10-20',
    status: 'recruiting',
    statusClass: 'recruiting',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
    competitionType: 'data-analysis',
    roles: [
      { name: '数据挖掘 1/2' },
      { name: 'Python开发 1/1', filled: true },
      { name: '数据可视化 0/1' }
    ]
  },
  {
    id: 6,
    name: '全栈开发竞赛团队',
    emoji: '💻',
    description: '参加软件设计大赛，打造创新Web应用，寻找前后端全栈人才',
    leader: '吴昊',
    rating: '4.8',
    members: 3,
    maxMembers: 5,
    deadline: '2025-11-30',
    status: 'recruiting',
    statusClass: 'recruiting',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    competitionType: 'software',
    roles: [
      { name: '前端开发 1/2' },
      { name: '后端开发 1/2' },
      { name: 'UI设计师 0/1' },
      { name: '测试工程师 0/1' }
    ]
  },
  {
    id: 7,
    name: '物联网创新团队',
    emoji: '🌐',
    description: '聚焦IoT应用开发，参加全国物联网设计竞赛，实现智慧场景解决方案',
    leader: '郑琳',
    rating: '4.4',
    members: 2,
    maxMembers: 4,
    deadline: '2025-11-10',
    status: 'in-progress',
    statusClass: 'in-progress',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    competitionType: 'software',
    roles: [
      { name: '嵌入式开发 1/2' },
      { name: '云平台开发 0/1', urgent: true }
    ]
  },
  {
    id: 8,
    name: '网络安全CTF战队',
    emoji: '🛡️',
    description: '备战各大CTF安全竞赛，涵盖逆向、密码学、Web安全等多个方向',
    leader: '陈杰',
    rating: '4.9',
    members: 5,
    maxMembers: 6,
    deadline: '2025-12-25',
    status: 'recruiting',
    statusClass: 'recruiting',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    competitionType: 'software',
    roles: [
      { name: '逆向工程 2/2', filled: true },
      { name: 'Web安全 1/2' },
      { name: '密码学 1/1', filled: true },
      { name: 'Misc杂项 0/1', urgent: true }
    ]
  },
  {
    id: 9,
    name: '无人机研发小组',
    emoji: '🚁',
    description: '参与无人机应用创新大赛，专注飞行控制算法与图像识别技术',
    leader: '黄磊',
    rating: '4.7',
    members: 3,
    maxMembers: 5,
    deadline: '2025-11-05',
    status: 'recruiting',
    statusClass: 'recruiting',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    competitionType: 'robotics',
    roles: [
      { name: '飞控算法 1/2' },
      { name: '图像处理 0/2', urgent: true },
      { name: '硬件电路 1/1', filled: true }
    ]
  },
  {
    id: 10,
    name: '区块链应用开发组',
    emoji: '⛓️',
    description: '探索区块链技术应用，参加区块链创新大赛，构建去中心化解决方案',
    leader: '林峰',
    rating: '4.6',
    members: 2,
    maxMembers: 4,
    deadline: '2025-12-10',
    status: 'recruiting',
    statusClass: 'recruiting',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
    competitionType: 'software',
    roles: [
      { name: '智能合约 1/2' },
      { name: '前端DApp 0/1', urgent: true },
      { name: '后端服务 0/1' }
    ]
  },
  {
    id: 11,
    name: '游戏开发工作室',
    emoji: '🎮',
    description: '参加独立游戏开发大赛，打造原创游戏作品，需要美术、程序、策划人才',
    leader: '许婷',
    rating: '4.5',
    members: 3,
    maxMembers: 6,
    deadline: '2025-11-20',
    status: 'recruiting',
    statusClass: 'recruiting',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    competitionType: 'software',
    roles: [
      { name: 'Unity开发 1/2' },
      { name: '游戏UI设计 0/1', urgent: true },
      { name: '游戏策划 1/1', filled: true },
      { name: '音效设计 0/1' }
    ]
  },
  {
    id: 12,
    name: '自然语言处理研究组',
    emoji: '💬',
    description: '专注于NLP技术研究与应用，参加AI自然语言处理相关竞赛',
    leader: '马超',
    rating: '4.8',
    members: 2,
    maxMembers: 4,
    deadline: '2025-12-05',
    status: 'recruiting',
    statusClass: 'recruiting',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    competitionType: 'ai',
    roles: [
      { name: 'NLP算法 1/2' },
      { name: 'Python开发 0/1', urgent: true },
      { name: '数据处理 1/1', filled: true }
    ]
  }
])

const filteredTeams = computed(() => {
  let result = [...teamsData.value]

  if (filters.value.search) {
    const keyword = filters.value.search.toLowerCase()
    result = result.filter(
      team =>
        team.name.toLowerCase().includes(keyword) ||
        team.description.toLowerCase().includes(keyword)
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
  console.log('申请加入:', team.name)
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
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(102, 126, 234, 0.15);
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
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
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
  background: linear-gradient(135deg, var(--primary-600), var(--accent-600));
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: all var(--transition-base);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);
  white-space: nowrap;
}

.btn-create-team:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
  color: white;
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 2rem;
}

.filter-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  padding: 1.5rem;
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
  border-color: var(--gray-300);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  border-color: var(--gray-300);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input:focus ~ .search-icon {
  color: var(--primary-500);
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
  background: var(--gray-200);
  color: var(--gray-700);
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
  background: var(--gray-200);
  border-color: var(--gray-300);
  color: var(--gray-700);
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
  color: var(--primary-600);
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
  color: var(--gray-600);
}

.toggle-btn.active {
  background: white;
  color: var(--primary-600);
  box-shadow: var(--shadow-xs);
}

/* 团队网格 */
.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.team-card {
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: transparent;
}

.team-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0;
  transition: opacity var(--transition-fast);
  z-index: 1;
}

.team-card:hover::before {
  opacity: 1;
}

.team-card:nth-child(6n+1)::before { background: linear-gradient(90deg, #667eea, #764ba2); }
.team-card:nth-child(6n+2)::before { background: linear-gradient(90deg, #11998e, #38ef7d); }
.team-card:nth-child(6n+3)::before { background: linear-gradient(90deg, #F59E0B, #D97706); }
.team-card:nth-child(6n+4)::before { background: linear-gradient(90deg, #8B5CF6, #7C3AED); }
.team-card:nth-child(6n+5)::before { background: linear-gradient(90deg, #EC4899, #BE185D); }
.team-card:nth-child(6n+6)::before { background: linear-gradient(90deg, #3B82F6, #2563EB); }

/* 卡片封面 */
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
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
  animation: float 3s ease-in-out infinite;
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
  color: var(--primary-600);
  font-weight: 600;
}

.meta-item.members svg {
  color: var(--primary-500);
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
  background: var(--primary-50);
  color: var(--primary-700);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--primary-100);
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
  background: var(--gray-100);
  border-color: var(--gray-300);
  color: var(--gray-900);
}

.btn-apply {
  padding: 0.5rem 0.875rem;
  background: linear-gradient(135deg, var(--primary-600), var(--accent-600));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-apply:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
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
  padding: 1.5rem;
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  cursor: pointer;
  transition: all var(--transition-base);
}

.list-item:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-200);
  transform: translateX(4px);
}

.list-cover {
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
  font-size: 3.5rem;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
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
  background: var(--gray-100);
  border-color: var(--gray-300);
  color: var(--gray-900);
}

.btn-apply-list {
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, var(--primary-600), var(--accent-600));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-apply-list:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  margin-bottom: 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
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
  background: linear-gradient(135deg, var(--primary-600), var(--accent-600));
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-reset-empty:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
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
  background: var(--gray-50);
  border-color: var(--primary-300);
  color: var(--primary-600);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-num {
  min-width: 40px;
}

.page-num.active {
  background: linear-gradient(135deg, var(--primary-600), var(--accent-600));
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
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

  .card-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .card-actions {
    width: 100%;
  }

  .btn-view,
  .btn-apply {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.25rem;
  }

  .filter-card {
    padding: 1rem;
  }

  .card-body {
    padding: 1.25rem;
  }

  .list-item {
    padding: 1rem;
  }
}
</style>
