<template>
  <div class="team-detail animate-fade-in">
    <div>
      <!-- 返回链接 -->
      <router-link to="/teams" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        返回团队列表
      </router-link>

      <!-- 团队信息头部 -->
      <div class="card section-card team-header-card">
        <div class="team-header-main">
          <div class="team-header-icon"><LineIcon :name="teamData.emoji" :size="40" /></div>
          <div class="team-header-info">
            <h2 class="team-header-name">{{ teamData.name }}</h2>
            <div class="team-header-meta">
              <span class="team-header-tag">队长：{{ teamData.leaderName }}</span>
              <span class="team-header-tag">评分：{{ teamData.rating }}</span>
              <span class="team-header-tag">成员：{{ teamData.currentMembers }}/{{ teamData.maxMembers }}</span>
            </div>
          </div>
          <span :class="['team-status-badge', teamData.statusClass]">{{ teamData.status }}</span>
        </div>
      </div>

      <!-- 团队描述 + 操作按钮 -->
      <div class="card section-card">
        <div class="card-header">
          <h3 class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--nav-blue-dark)" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            团队描述
          </h3>
        </div>
        <div class="card-body team-description">
          <p>{{ teamData.description.p1 }}</p>
          <p>{{ teamData.description.p2 }}</p>
          <p class="desc-highlight"><strong>我们提供：</strong><br>
            • 完善的硬件设备和实验环境<br>
            • 经验丰富的指导老师<br>
            • 定期的技术分享和培训<br>
            • 友好的团队氛围
          </p>

          <div class="action-buttons">
            <button class="btn btn-primary btn-lg" @click="openApplyModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              申请加入团队
            </button>
            <button class="btn btn-outline btn-lg" @click="handleShare">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              分享团队
            </button>
            <button :class="['btn', isFavorited ? 'btn-primary' : 'btn-ghost', 'btn-lg']" @click="toggleFavorite">
              <svg v-if="!isFavorited" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              收藏
            </button>
          </div>
        </div>
      </div>

      <!-- 双列布局：雷达图 + 团队成员 -->
      <div class="two-col-grid">
        <!-- 左侧：雷达图 -->
        <div class="card section-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--nav-blue-dark)" stroke-width="2">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
              </svg>
              团队能力雷达图
            </h3>
          </div>
          <div class="card-body">
            <div class="radar-chart-container">
              <canvas ref="radarCanvasRef"></canvas>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-dot dot-primary"></span>
                <span class="text-sm">当前能力</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot dot-success"></span>
                <span class="text-sm">目标需求</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：团队成员列表 -->
        <div class="card section-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--nav-blue-dark)" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              团队成员 ({{ teamData.currentMembers }}/{{ teamData.maxMembers }})
            </h3>
            <router-link to="/recommendations" class="btn btn-primary btn-sm"><LineIcon name="sparkles" :size="14" /> 匹配推荐</router-link>
          </div>
          <div class="card-body members-list">
            <div v-for="member in members" :key="member.id"
                 :class="['member-card', { 'member-pending': member.status === 'pending' }]">
              <div class="avatar member-avatar" :style="{ background: member.avatarBg }">
                {{ member.name[0] }}
              </div>
              <div class="member-info">
                <div class="member-name">
                  {{ member.name }}
                  <span :class="['role-badge', `role-${member.roleClass}`]">{{ member.roleLabel }}</span>
                </div>
                <div class="member-role-text">角色: {{ member.roleText }}</div>
                <div class="member-skills">
                  <span v-for="(skill, idx) in member.skills" :key="idx" class="skill-tag">{{ skill }}</span>
                </div>
              </div>
              <div v-if="member.status === 'pending'" class="pending-actions">
                <button class="btn btn-success btn-sm" @click="handleApprove(member)"><LineIcon name="check" :size="14" /> 通过</button>
                <button class="btn btn-danger btn-sm" @click="handleReject(member)"><LineIcon name="x" :size="14" /> 拒绝</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 招募需求卡片 -->
      <div class="card section-card recruitment-card">
        <div class="card-header">
          <h3 class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--nav-blue-dark)" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
            招募需求
          </h3>
          <span class="deadline-hint text-sm text-gray">招募截止: {{ teamData.deadline }} 23:59:59</span>
        </div>
        <div class="card-body">
          <div class="recruitment-grid">
            <div v-for="req in recruitmentReqs" :key="req.id" class="recruitment-item-card">
              <div class="recruitment-item-body">
                <h4 class="recruitment-role-name">{{ req.roleName }}</h4>
                <div class="recruitment-meta">
                  <span class="text-sm text-gray"><LineIcon name="user" :size="14" /> {{ req.current }}/{{ req.total }} 人</span>
                  <span :class="['badge-small', `badge-${req.badgeClass}`]">{{ req.badgeText }}</span>
                </div>
                <p class="recruitment-skill-require text-sm text-gray">技能要求: {{ req.skillsRequired }}</p>
                <div class="progress-bar-wrapper">
                  <div class="progress-bar-track">
                    <div class="progress-bar-fill" :class="`fill-${req.progressClass}`"
                         :style="{ width: `${(req.current / req.total) * 100}%` }"></div>
                  </div>
                </div>
              </div>
              <button v-if="!req.isFull" class="btn btn-primary btn-sm btn-block" @click="openApplyModalWithRole(req.roleName)">
                <LineIcon name="sparkles" :size="14" /> 匹配推荐
              </button>
              <button v-else class="btn btn-secondary btn-sm btn-block" disabled>已满员</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目文件列表 -->
      <div class="card section-card files-card">
        <div class="card-header">
          <h3 class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--nav-blue-dark)" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            项目文件
          </h3>
          <button class="btn btn-primary btn-sm" @click="handleUploadFile">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            上传文件
          </button>
        </div>
        <div class="card-body files-list">
          <div v-for="file in projectFiles" :key="file.id" class="file-card">
            <div class="file-icon" :style="{ background: file.iconBg, color: file.iconColor }">
              <LineIcon :name="file.icon" :size="24" />
            </div>
            <div class="file-info">
              <div class="file-name">{{ file.name }}</div>
              <div class="file-meta text-sm text-gray">
                大小: {{ file.size }} | 上传者: {{ file.uploader }} | {{ file.uploadTime }}
              </div>
            </div>
            <div class="file-actions">
              <button class="btn btn-outline btn-sm" @click="handleDownload(file)"><LineIcon name="download" :size="14" /> 下载</button>
              <button v-if="file.canPreview" class="btn btn-ghost btn-sm" @click="handlePreview(file)"><LineIcon name="eye" :size="14" /> 预览</button>
              <button class="btn btn-ghost btn-sm delete-btn" @click="handleDeleteFile(file)"><LineIcon name="trash" :size="14" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 申请加入弹窗 -->
    <ApplicationForm
      :visible="showApply"
      :roles="availableRoles"
      :initial-role="applyInitialRole"
      @close="closeApplyModal"
      @submit="submitApply"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import LineIcon from '../components/LineIcon.vue'
import ApplicationForm from '../components/team/ApplicationForm.vue'
import { teams } from '../mock/teamMessage.js'
import { useToast } from '../composables/useToast'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const route = useRoute()
const { toast } = useToast()

const showApply = ref(false)
const isFavorited = ref(false)
const radarCanvasRef = ref(null)
let radarChartInstance = null

const applyInitialRole = ref('')

const STATUS_LABEL = {
  recruiting: '招募中',
  urgent: '急招中',
  full: '已满员',
  'in-progress': '进行中',
  completed: '已结束'
}

function findTeam(id) {
  const numId = Number(id)
  return teams.find((t) => t.id === numId) || teams[0]
}

function parseRoleCount(name) {
  const match = name.match(/^(.*?)\s+(\d+)\/(\d+)$/)
  if (match) {
    return { name: match[1].trim(), current: Number(match[2]), total: Number(match[3]) }
  }
  return { name, current: 0, total: 1 }
}

const ROLE_SKILLS = {
  算法: 'Python, 算法设计',
  嵌入式: 'C语言, 嵌入式开发',
  电控: 'C语言, 电路设计',
  机械: 'CAD, SolidWorks',
  视觉: 'OpenCV, 图像处理',
  前端: 'Vue/React, JavaScript',
  后端: 'Node.js, 数据库',
  Python: 'Python, 数据分析',
  建模: '数学建模, MATLAB',
  论文: '论文写作, LaTeX',
  数据: 'Python, 数据挖掘',
  产品: '需求分析, 产品设计',
  UI: 'Figma, UI设计',
  测试: '测试用例, 自动化',
  云平台: 'Docker, 云服务',
  逆向: '逆向工程, 汇编',
  安全: '渗透测试, 安全分析',
  密码: '密码学, 数学',
  Misc: '取证, 杂项',
  飞控: 'C++, 控制算法',
  图像: 'OpenCV, 图像处理',
  硬件: '电路设计, PCB',
  合约: 'Solidity, 区块链',
  DApp: '前端, Web3',
  Unity: 'C#, Unity',
  策划: '游戏策划, 数值设计',
  音效: '音频制作, 音效设计',
  NLP: 'Python, 自然语言处理'
}

function skillForRole(roleName) {
  for (const [key, value] of Object.entries(ROLE_SKILLS)) {
    if (roleName.includes(key)) return value
  }
  return '相关专业技能'
}

const MEMBER_POOL = [
  { name: '王芳', bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', skills: ['C语言 5', '嵌入式 4'] },
  { name: '张伟', bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', skills: ['CAD 4', 'SolidWorks 3'] },
  { name: '李娜', bg: 'linear-gradient(135deg, #3D9FD4 0%, #2C8FC0 100%)', skills: ['Python 4', '数据分析 4'] },
  { name: '刘洋', bg: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', skills: ['前端 4', 'UI 3'] },
  { name: '陈晨', bg: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', skills: ['Java 4', '后端 4'] },
  { name: '赵敏', bg: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', skills: ['测试 3', '自动化 3'] }
]

const teamData = computed(() => {
  const t = findTeam(route.params.id)
  const goal = t.description.split('，')[0] || t.description
  return {
    name: t.name,
    emoji: t.emoji,
    goal,
    gradient: 'linear-gradient(135deg, #5EB3E4 0%, #2C8FC0 100%)',
    leaderName: t.leader,
    rating: t.rating,
    currentMembers: t.members,
    maxMembers: t.maxMembers,
    createdAt: '2025-01-15',
    deadline: t.deadline,
    status: STATUS_LABEL[t.status] || t.status,
    statusClass: t.statusClass || 'recruiting',
    description: {
      p1: `${t.description}。`,
      p2: `团队当前聚焦「${goal}」，欢迎志同道合的队友加入，一起备赛、共同进步。`
    }
  }
})

function buildMembers(team) {
  const list = [
    {
      id: 1,
      name: team.leader,
      avatarBg: 'linear-gradient(135deg, #5EB3E4 0%, #2C8FC0 100%)',
      roleLabel: '队长',
      roleClass: 'leader',
      roleText: '队长',
      status: 'confirmed',
      skills: ['Python 5', '算法 4']
    }
  ]
  const roles = team.roles.map((r) => parseRoleCount(r.name))
  let pendingAdded = false
  roles.forEach((role) => {
    for (let k = 0; k < role.current; k++) {
      const p = MEMBER_POOL[list.length % MEMBER_POOL.length]
      list.push({
        id: list.length + 1,
        name: p.name,
        avatarBg: p.bg,
        roleLabel: '已确认',
        roleClass: 'confirmed',
        roleText: role.name,
        status: 'confirmed',
        skills: p.skills
      })
    }
    if (!pendingAdded && role.current < role.total) {
      const p = MEMBER_POOL[list.length % MEMBER_POOL.length]
      list.push({
        id: list.length + 1,
        name: p.name,
        avatarBg: p.bg,
        roleLabel: '待确认',
        roleClass: 'pending',
        roleText: role.name,
        status: 'pending',
        skills: p.skills
      })
      pendingAdded = true
    }
  })
  return list
}

function buildRecruitment(team) {
  return team.roles.map((role, index) => {
    const { name, current, total } = parseRoleCount(role.name)
    const isFull = current >= total
    return {
      id: index + 1,
      roleName: name,
      current,
      total,
      badgeText: isFull ? '已满员' : '急招',
      badgeClass: isFull ? 'success' : 'danger',
      skillsRequired: skillForRole(name),
      progressClass: isFull ? 'success' : current === 0 ? 'danger' : 'warning',
      isFull
    }
  })
}

function buildFiles(team) {
  return [
    { id: 1, icon: 'file', iconBg: '#EFF7FC', iconColor: '#3D9FD4', name: '竞赛规则.pdf', size: '2.5 MB', uploader: team.leader, uploadTime: '2025-05-01 10:30', canPreview: false },
    { id: 2, icon: 'bar-chart-3', iconBg: '#FFF4EC', iconColor: '#F97316', name: '备赛计划.pptx', size: '8.3 MB', uploader: team.leader, uploadTime: '2025-05-03 14:20', canPreview: false },
    { id: 3, icon: 'code', iconBg: '#EFF7FC', iconColor: '#3D9FD4', name: 'main.py', size: '15 KB', uploader: team.leader, uploadTime: '2025-05-05 09:15', canPreview: true }
  ]
}

const members = ref(buildMembers(findTeam(route.params.id)))
const recruitmentReqs = ref(buildRecruitment(findTeam(route.params.id)))
const projectFiles = ref(buildFiles(findTeam(route.params.id)))

const availableRoles = computed(() => {
  return recruitmentReqs.value.filter(r => !r.isFull).map(r => r.roleName)
})

watch(
  () => route.params.id,
  () => {
    const t = findTeam(route.params.id)
    members.value = buildMembers(t)
    recruitmentReqs.value = buildRecruitment(t)
    projectFiles.value = buildFiles(t)
    isFavorited.value = false
    applyInitialRole.value = ''
    showApply.value = false
  }
)

function initRadarChart() {
  if (!radarCanvasRef.value) return

  const ctx = radarCanvasRef.value.getContext('2d')

  if (radarChartInstance) {
    radarChartInstance.destroy()
  }

  radarChartInstance = new ChartJS(ctx, {
    type: 'radar',
    data: {
      labels: ['Python', 'C++', '算法设计', '嵌入式', '机械设计', 'CAD'],
      datasets: [
        {
          label: '当前能力',
          data: [4.5, 4.0, 4.5, 4.0, 2.0, 0],
          backgroundColor: 'rgba(94, 179, 228, 0.15)',
          borderColor: 'rgba(94, 179, 228, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(94, 179, 228, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: '目标需求',
          data: [5, 4, 5, 5, 5, 5],
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: 'rgba(16, 185, 129, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 5,
          min: 0,
          ticks: {
            stepSize: 1,
            font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
            color: '#9CA3AF',
            backdropColor: 'transparent'
          },
          grid: { color: 'rgba(209, 213, 219, 0.5)' },
          angleLines: { color: 'rgba(209, 213, 219, 0.5)' },
          pointLabels: {
            font: { size: 12, weight: '500', family: "'Plus Jakarta Sans', sans-serif" },
            color: '#4B5563'
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1F2937',
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4
        }
      }
    }
  })
}

function openApplyModal() {
  applyInitialRole.value = ''
  showApply.value = true
}

function openApplyModalWithRole(role) {
  applyInitialRole.value = role
  showApply.value = true
}

function closeApplyModal() {
  showApply.value = false
}

function submitApply(payload) {
  toast(`已提交「${payload.selectedRole}」申请`, 'success')
  closeApplyModal()
}

function toggleFavorite() {
  isFavorited.value = !isFavorited.value
  toast(isFavorited.value ? '已收藏' : '已取消收藏')
}

async function handleShare() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    toast('团队链接已复制', 'success')
  } catch {
    toast('复制失败，请手动复制地址栏链接', 'error')
  }
}

function handleApprove(member) {
  member.status = 'confirmed'
  member.roleLabel = '已确认'
  member.roleClass = 'confirmed'
  toast(`已通过 ${member.name}`, 'success')
}

function handleReject(member) {
  members.value = members.value.filter((m) => m.id !== member.id)
  toast(`已拒绝 ${member.name}`)
}

function handleDownload(file) {
  toast(`开始下载 ${file.name}`)
}

function handlePreview(file) {
  toast(`预览 ${file.name}`)
}

function handleDeleteFile(file) {
  projectFiles.value = projectFiles.value.filter((f) => f.id !== file.id)
  toast('文件已删除')
}

function handleUploadFile() {
  projectFiles.value.push({
    id: Date.now(),
    icon: 'file',
    iconBg: '#EFF7FC',
    iconColor: '#3D9FD4',
    name: '新上传文件.txt',
    size: '1.0 KB',
    uploader: '我',
    uploadTime: '刚刚',
    canPreview: false
  })
  toast('文件已上传（模拟）', 'success')
}

onMounted(() => {
  nextTick(() => {
    initRadarChart()
  })
})

onUnmounted(() => {
  if (radarChartInstance) {
    radarChartInstance.destroy()
    radarChartInstance = null
  }
})
</script>

<style scoped>
.team-detail {
  max-width: 1280px;
  padding-bottom: 3rem;
}

/* 返回链接 */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-500);
  font-size: 0.9375rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
  transition: all var(--transition-fast);
}

.back-link:hover {
  color: var(--nav-blue-dark);
  gap: 0.75rem;
}

/* 团队信息头部 */
.team-header-card {
  border-bottom: 1px solid var(--line);
}

.team-header-main {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0 0 1.5rem;
}

.team-header-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #f5f5a5ff 0%, #a1e4f7ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink);
  flex-shrink: 0;
}

.team-header-info {
  flex: 1;
  min-width: 0;
}

.team-header-name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--gray-900);
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.team-header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.team-header-tag {
  padding: 0.25rem 0.75rem;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--gray-600);
}

.team-status-badge {
  flex-shrink: 0;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 700;
}

.team-status-badge.recruiting {
  background: var(--success-50);
  color: var(--success-600);
}

.team-status-badge.urgent {
  background: var(--danger-50);
  color: var(--danger-500);
}

.team-status-badge.full {
  background: var(--gray-100);
  color: var(--gray-500);
}

.team-status-badge.in-progress {
  background: var(--warning-50);
  color: var(--warning-600);
}

/* 操作按钮组 */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1.75rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--line-strong);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  font-family: var(--font-body);
}

.btn-sm {
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
}

.btn-lg {
  padding: 0.875rem 1.75rem;
  font-size: 0.9375rem;
}

.btn-primary {
  background: var(--nav-blue-deep);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--nav-blue-deeper);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-500);
  border: 1px solid var(--gray-200);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--gray-200);
  color: var(--gray-700);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-outline:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}

.btn-ghost {
  background: transparent;
  color: var(--gray-500);
}

.btn-ghost:hover {
  background: var(--gray-100);
  color: var(--gray-700);
}

.btn-success {
  background: var(--success-500);
  color: white;
}

.btn-success:hover {
  background: var(--success-600);
}

.btn-danger {
  background: var(--danger-500);
  color: white;
}

.btn-danger:hover {
  background: var(--danger-600);
}

.btn-block {
  width: 100%;
}

/* 卡片通用样式 */
.card {
  background: transparent;
  border-radius: 0;
  border: none;
  overflow: visible;
}

.section-card {
  margin-bottom: 2.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  margin-bottom: 1.25rem;
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-body {
  padding: 0;
}

/* 双列布局 */
.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 0;
}

/* 雷达图容器 */
.radar-chart-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.radar-chart-container canvas {
  width: 100% !important;
  height: auto !important;
}

.chart-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line-strong);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot-primary {
  background: var(--nav-blue-dark);
}

.dot-success {
  background: var(--success-500);
}

/* 成员列表 */
.members-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--line);
  transition: background var(--transition-fast);
}

.member-card:hover {
  background: var(--nav-blue-50);
}

.member-pending {
  background: var(--warning-50);
  padding: 1rem;
}

.member-avatar {
  width: 44px;
  height: 44px;
  font-size: 1rem;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.6875rem;
  font-weight: 600;
}

.role-leader {
  background: #FEF3C7;
  color: #D97706;
}

.role-confirmed {
  background: var(--success-50);
  color: var(--success-600);
}

.role-pending {
  background: var(--warning-50);
  color: var(--warning-600);
}

.member-role-text {
  font-size: 0.8125rem;
  color: var(--gray-500);
  margin-top: 0.25rem;
}

.member-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5625rem;
  background: var(--nav-blue-50);
  color: var(--nav-blue-dark);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--nav-blue-100);
}

.pending-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* 招募需求 */
.recruitment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.recruitment-item-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.recruitment-item-card:hover {
  border-color: var(--nav-blue-100);
}

.recruitment-item-body {
  padding: 1.25rem;
}

.recruitment-role-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--gray-900);
  margin-bottom: 0.625rem;
}

.recruitment-meta {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.75rem;
}

.badge-small {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.6875rem;
  font-weight: 600;
}

.badge-danger {
  background: var(--danger-50);
  color: var(--danger-600);
}

.badge-success {
  background: var(--success-50);
  color: var(--success-600);
}

.recruitment-skill-require {
  margin-bottom: 0.875rem;
  line-height: 1.4;
}

.progress-bar-wrapper {
  margin-bottom: 1rem;
}

.progress-bar-track {
  height: 8px;
  background: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fill-warning {
  background: linear-gradient(90deg, var(--warning-500), #FBBF24);
}

.fill-success {
  background: linear-gradient(90deg, var(--success-500), #34D399);
}

.fill-danger {
  background: linear-gradient(90deg, var(--danger-500), #F87171);
}

/* 文件列表 */
.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.file-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--line);
  transition: background var(--transition-fast);
}

.file-card:hover {
  background: var(--nav-blue-50);
}

.file-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-weight: 600;
  color: var(--gray-900);
  font-size: 0.9375rem;
  margin-bottom: 0.1875rem;
}

.file-meta {
  line-height: 1.4;
}

.file-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.delete-btn:hover {
  color: var(--danger-500);
}

/* 团队描述 */
.team-description p {
  line-height: 1.85;
  color: var(--gray-700);
  font-size: 0.9375rem;
}

.team-description p + p {
  margin-top: 1rem;
}

.desc-highlight {
  margin-top: 1.25rem !important;
  padding: 1.25rem;
  background: var(--nav-blue-50);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--nav-blue);
  line-height: 1.85;
}

.desc-highlight strong {
  color: var(--gray-900);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .recruitment-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .recruitment-grid > *:last-child:nth-child(odd) {
    grid-column: span 2;
    max-width: 50%;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .two-col-grid {
    grid-template-columns: 1fr;
  }

  .recruitment-grid {
    grid-template-columns: 1fr;
  }

  .recruitment-grid > *:last-child:nth-child(odd) {
    grid-column: span 1;
    max-width: 100%;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .btn {
    width: 100%;
    justify-content: center;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .file-card {
    flex-wrap: wrap;
  }

  .file-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 0.5rem;
    padding-left: calc(48px + 1rem + 1rem);
  }

  .member-card {
    flex-wrap: wrap;
  }

  .pending-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 0.5rem;
    padding-left: calc(44px + 1rem + 1rem);
  }
}

@media (max-width: 480px) {
  .card-body {
    padding: 1.125rem;
  }

  .card-header {
    padding: 1rem 1.125rem;
  }

  .file-actions {
    padding-left: 0;
  }

  .pending-actions {
    padding-left: 0;
  }
}
</style>
