<template>
  <div class="teams-page animate-fade-in">
    <el-card shadow="never" class="mb-3">
      <el-row justify="space-between" align="middle">
        <el-col :span="16">
          <el-text tag="h1" class="page-title">团队广场</el-text>
          <el-text type="info" size="small" class="page-sub">发现志同道合的队友，加入心仪的团队</el-text>
        </el-col>
        <el-col :span="8" class="tr">
          <el-button type="primary" @click="$router.push('/create-team')">
            <el-icon class="el-icon--left"><Plus /></el-icon>
            创建团队
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" class="mb-3">
      <el-form :inline="true" label-width="56px" class="filter-form">
        <el-form-item label="状态">
          <el-select v-model="filters.status" clearable placeholder="全部" style="width: 130px">
            <el-option label="全部状态" value="" />
            <el-option label="招募中" value="recruiting" />
            <el-option label="进行中" value="in-progress" />
            <el-option label="已结束" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="竞赛">
          <el-select v-model="filters.competitionType" clearable placeholder="全部" style="width: 150px">
            <el-option label="全部类型" value="" />
            <el-option label="人工智能" value="ai" />
            <el-option label="机器人/机甲" value="robotics" />
            <el-option label="数学建模" value="math-modeling" />
            <el-option label="智能汽车" value="smart-car" />
            <el-option label="软件开发" value="software" />
            <el-option label="数据分析" value="data-analysis" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="filters.sortBy" style="width: 130px">
            <el-option label="最新发布" value="latest" />
            <el-option label="成员最多" value="members" />
            <el-option label="信誉最高" value="rating" />
            <el-option label="即将截止" value="deadline" />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input
            v-model="filters.search"
            clearable
            placeholder="团队名称或描述"
            style="width: 220px"
            @input="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="resetFilters">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <el-row justify="space-between" align="middle" class="filter-foot">
        <el-text>共找到 <strong>{{ filteredTeams.length }}</strong> 个团队</el-text>
        <el-radio-group v-model="viewMode">
          <el-radio-button label="grid">网格</el-radio-button>
          <el-radio-button label="list">列表</el-radio-button>
        </el-radio-group>
      </el-row>
    </el-card>

    <template v-if="filteredTeams.length > 0">
      <el-row v-if="viewMode === 'grid'" :gutter="16">
        <el-col v-for="team in paginatedTeams" :key="team.id" :xs="24" :sm="12" :lg="8">
          <el-card class="team-card" shadow="hover" @click="$router.push(`/teams/${team.id}`)">
            <div class="card-cover" :style="{ background: team.gradient }">
              <span class="card-emoji">{{ team.emoji }}</span>
              <el-tag class="cover-tag" :type="badgeType(team.statusClass)" size="small" effect="dark">
                {{ statusText(team.status) }}
              </el-tag>
            </div>
            <div class="card-pad">
              <el-text tag="div" class="card-title">{{ team.name }}</el-text>
              <el-text type="info" size="small" class="card-desc">{{ team.description }}</el-text>
              <el-space wrap class="meta-row">
                <el-text type="info" size="small">队长 {{ team.leader }}</el-text>
                <el-text type="info" size="small">评分 {{ team.rating }}</el-text>
                <el-text type="info" size="small">成员 {{ team.members }}/{{ team.maxMembers }}</el-text>
              </el-space>
              <el-space wrap :size="6" class="roles-row">
                <el-tag
                  v-for="(role, index) in team.roles.slice(0, 4)"
                  :key="index"
                  :type="roleTagType(role)"
                  size="small"
                >
                  {{ role.name }}
                </el-tag>
                <el-tag v-if="team.roles.length > 4" size="small" type="info">+{{ team.roles.length - 4 }}</el-tag>
              </el-space>
              <el-divider class="my-div" />
              <el-row :gutter="8">
                <el-col :span="12">
                  <router-link :to="`/teams/${team.id}`" class="w100" @click.stop>
                    <el-button class="w100">查看详情</el-button>
                  </router-link>
                </el-col>
                <el-col :span="12">
                  <el-button type="primary" class="w100" @click.stop="handleApply(team)">申请加入</el-button>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <div v-else class="list-stack">
        <el-card
          v-for="team in paginatedTeams"
          :key="team.id"
          class="mb-3 list-card"
          shadow="hover"
          @click="$router.push(`/teams/${team.id}`)"
        >
          <el-row :gutter="12" align="middle">
            <el-col :span="4" :xs="24">
              <div class="list-cover" :style="{ background: team.gradient }">
                <span class="list-emoji">{{ team.emoji }}</span>
              </div>
            </el-col>
            <el-col :span="14" :xs="24">
              <el-space wrap>
                <el-text tag="strong">{{ team.name }}</el-text>
                <el-tag :type="badgeType(team.statusClass)" size="small">{{ statusText(team.status) }}</el-tag>
              </el-space>
              <el-text type="info" size="small" class="list-desc">{{ team.description }}</el-text>
              <el-space wrap :size="6">
                <el-tag v-for="(role, index) in team.roles" :key="index" size="small" :type="roleTagType(role)">
                  {{ role.name }}
                </el-tag>
              </el-space>
            </el-col>
            <el-col :span="6" :xs="24">
              <el-space direction="vertical" class="w100" :size="8">
                <router-link :to="`/teams/${team.id}`" class="w100" @click.stop>
                  <el-button class="w100">查看详情</el-button>
                </router-link>
                <el-button type="primary" class="w100" @click.stop="handleApply(team)">申请加入</el-button>
              </el-space>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <el-pagination
        v-if="totalPages > 1"
        v-model:current-page="currentPage"
        class="pager"
        background
        layout="prev, pager, next"
        :total="filteredTeams.length"
        :page-size="itemsPerPage"
      />
    </template>
    <el-empty v-else description="没有找到匹配的团队">
      <el-button type="primary" @click="resetFilters">重置筛选</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Plus, RefreshLeft } from '@element-plus/icons-vue'

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
    gradient: '#27272a',
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
    gradient: '#3f3f46',
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
    gradient: '#854d0e',
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
    gradient: '#52525b',
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
    gradient: '#9f1239',
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
    gradient: '#1e3a8a',
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
    gradient: '#0f766e',
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
    gradient: '#991b1b',
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
    gradient: '#0e7490',
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
    gradient: '#57534e',
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
    gradient: '#9a3412',
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
    gradient: '#166534',
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

const badgeType = (statusClass) => {
  if (statusClass === 'urgent') return 'danger'
  if (statusClass === 'in-progress') return 'warning'
  if (statusClass === 'completed') return 'info'
  return 'success'
}

const roleTagType = (role) => {
  if (role.filled) return 'info'
  if (role.urgent) return 'danger'
  return undefined
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
  max-width: 1200px;
  margin: 0 auto;
}

.mb-3 {
  margin-bottom: 1rem;
}

.page-title {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.page-sub {
  display: block;
}

.tr {
  text-align: right;
}

.filter-form {
  flex-wrap: wrap;
}

.filter-foot {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--el-border-color-lighter);
}

.team-card {
  cursor: pointer;
  margin-bottom: 1rem;
}

.team-card :deep(.el-card__body) {
  padding: 0;
}

.card-cover {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-emoji {
  font-size: 3rem;
}

.cover-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.card-pad {
  padding: 1rem 1rem 1.1rem;
}

.card-title {
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 0.35rem;
}

.card-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.5rem;
  line-height: 1.45;
}

.meta-row {
  margin-bottom: 0.5rem;
}

.roles-row {
  margin-bottom: 0.25rem;
}

.my-div {
  margin: 0.65rem 0;
}

.w100 {
  display: block;
  width: 100%;
  text-decoration: none;
}

.list-stack {
  margin-bottom: 1rem;
}

.list-card {
  cursor: pointer;
}

.list-cover {
  height: 88px;
  border-radius: var(--el-border-radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-emoji {
  font-size: 2.25rem;
}

.list-desc {
  display: block;
  margin: 0.35rem 0 0.5rem;
  line-height: 1.45;
}

.pager {
  margin-top: 1.25rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .tr {
    text-align: left;
    margin-top: 0.75rem;
  }
}
</style>
