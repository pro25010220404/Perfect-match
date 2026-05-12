<template>
  <div class="team-detail animate-fade-in">
    <div class="container">
      <!-- 返回链接 -->
      <a href="javascript:history.back()" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        返回团队列表
      </a>

      <!-- 团队头部信息卡片 -->
      <div class="team-header-card">
        <!-- 顶部横幅 -->
        <div class="team-banner" :style="{ background: teamData.gradient }">
          <span class="banner-emoji">{{ teamData.emoji }}</span>
        </div>

        <div class="team-header-body">
          <div class="header-top">
            <div class="title-area">
              <h1 class="team-title">🏆 {{ teamData.name }}</h1>
              <p class="team-goal">目标：{{ teamData.goal }}</p>
            </div>
            <span :class="['status-badge', `status-${teamData.statusClass}`]">
              {{ teamData.status }} {{ statusDot }}
            </span>
          </div>

          <div class="meta-row">
            <div class="meta-item">
              <div class="avatar-sm leader-avatar">{{ teamData.leaderName[0] }}</div>
              <span>队长: {{ teamData.leaderName }}</span>
            </div>
            <div class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>信誉: {{ teamData.rating }}</span>
            </div>
            <div class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
              <span>成员: {{ teamData.currentMembers }}/{{ teamData.maxMembers }}</span>
            </div>
            <div class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>创建于 {{ teamData.createdAt }}</span>
            </div>
            <div class="meta-item deadline-meta">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>截止: {{ teamData.deadline }}</span>
            </div>
          </div>

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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2">
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              团队成员 ({{ teamData.currentMembers }}/{{ teamData.maxMembers }})
            </h3>
            <router-link to="/recommendations" class="btn btn-primary btn-sm">🔍 匹配推荐</router-link>
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
                <button class="btn btn-success btn-sm" @click="handleApprove(member)">✓ 通过</button>
                <button class="btn btn-danger btn-sm" @click="handleReject(member)">✗ 拒绝</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 招募需求卡片 -->
      <div class="card section-card recruitment-card">
        <div class="card-header">
          <h3 class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2">
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
                  <span class="text-sm text-gray">👤 {{ req.current }}/{{ req.total }} 人</span>
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
                🔍 匹配推荐
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2">
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
              {{ file.icon }}
            </div>
            <div class="file-info">
              <div class="file-name">{{ file.name }}</div>
              <div class="file-meta text-sm text-gray">
                大小: {{ file.size }} | 上传者: {{ file.uploader }} | {{ file.uploadTime }}
              </div>
            </div>
            <div class="file-actions">
              <button class="btn btn-outline btn-sm" @click="handleDownload(file)">📥 下载</button>
              <button v-if="file.canPreview" class="btn btn-ghost btn-sm" @click="handlePreview(file)">👁️ 预览</button>
              <button class="btn btn-ghost btn-sm delete-btn" @click="handleDeleteFile(file)">🗑️</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 团队详细描述 -->
      <div class="card section-card desc-card">
        <div class="card-header">
          <h3 class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2">
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
        </div>
      </div>
    </div>

    <!-- 申请加入弹窗 -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showApply" class="modal-overlay" @click.self="closeApplyModal">
          <div class="modal-box">
            <div class="modal-header">
              <h3 class="modal-title">申请加入团队</h3>
              <button class="modal-close-btn" @click="closeApplyModal">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label required">选择角色</label>
                <select v-model="applyForm.selectedRole" class="form-select">
                  <option value="" disabled>请选择申请角色</option>
                  <option v-for="role in availableRoles" :key="role" :value="role">{{ role }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">申请留言</label>
                <textarea v-model="applyForm.message" class="form-textarea" rows="4"
                          placeholder="介绍一下你自己，为什么想加入这个团队..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeApplyModal">取消</button>
              <button class="btn btn-primary" @click="submitApply" :disabled="!applyForm.selectedRole">
                提交申请
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
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

const statusDot = '🟢'
const showApply = ref(false)
const isFavorited = ref(false)
const radarCanvasRef = ref(null)
let radarChartInstance = null

const applyForm = reactive({
  selectedRole: '',
  message: ''
})

const teamData = ref({
  name: '无人车战队',
  emoji: '🏎️',
  goal: '全国大学生智能汽车竞赛一等奖',
  gradient: '#27272a',
  leaderName: '李明',
  rating: '4.9',
  currentMembers: 3,
  maxMembers: 6,
  createdAt: '2025-01-15',
  deadline: '2025-12-31',
  status: '招募中',
  statusClass: 'recruiting',
  description: {
    p1: '我们是一支充满激情的团队，专注于无人驾驶技术的研究与开发。目标是参加全国大学生智能汽车竞赛，争取获得一等奖。',
    p2: '团队目前有算法、嵌入式、机械三个方向，我们需要志同道合的队友加入。无论你是算法高手、嵌入式达人还是机械设计专家，只要你有热情、有想法，欢迎加入我们！'
  }
})

const members = ref([
  {
    id: 1,
    name: '李明',
    avatarBg: '#1e3a8a',
    roleLabel: '队长',
    roleClass: 'leader',
    roleText: '队长 / 算法工程师',
    status: 'confirmed',
    skills: ['Python 5', 'C++ 4', '算法 5']
  },
  {
    id: 2,
    name: '王芳',
    avatarBg: '#166534',
    roleLabel: '已确认',
    roleClass: 'confirmed',
    roleText: '嵌入式开发',
    status: 'confirmed',
    skills: ['C语言 5', '嵌入式 4']
  },
  {
    id: 3,
    name: '张伟',
    avatarBg: '#854d0e',
    roleLabel: '⏳ 待确认',
    roleClass: 'pending',
    roleText: '机械设计',
    status: 'pending',
    skills: ['CAD 4', 'SolidWorks 3']
  }
])

const recruitmentReqs = ref([
  {
    id: 1,
    roleName: '算法工程师',
    current: 1,
    total: 2,
    badgeText: '急招',
    badgeClass: 'danger',
    skillsRequired: 'Python, 算法设计',
    progressClass: 'warning',
    isFull: false
  },
  {
    id: 2,
    roleName: '嵌入式开发',
    current: 1,
    total: 1,
    badgeText: '已满员',
    badgeClass: 'success',
    skillsRequired: 'C语言, 嵌入式开发',
    progressClass: 'success',
    isFull: true
  },
  {
    id: 3,
    roleName: '机械设计',
    current: 0,
    total: 1,
    badgeText: '急招',
    badgeClass: 'danger',
    skillsRequired: 'CAD, SolidWorks',
    progressClass: 'danger',
    isFull: false
  }
])

const projectFiles = ref([
  {
    id: 1,
    icon: '📄',
    iconBg: 'var(--primary-100)',
    iconColor: 'var(--primary-600)',
    name: '竞赛规则.pdf',
    size: '2.5 MB',
    uploader: '李明',
    uploadTime: '2025-05-01 10:30',
    canPreview: false
  },
  {
    id: 2,
    icon: '📊',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    name: '设计方案.pptx',
    size: '8.3 MB',
    uploader: '王芳',
    uploadTime: '2025-05-03 14:20',
    canPreview: false
  },
  {
    id: 3,
    icon: '💻',
    iconBg: '#D1FAE5',
    iconColor: '#059669',
    name: 'main.py',
    size: '15 KB',
    uploader: '李明',
    uploadTime: '2025-05-05 09:15',
    canPreview: true
  }
])

const availableRoles = computed(() => {
  return recruitmentReqs.value.filter(r => !r.isFull).map(r => r.roleName)
})

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
          backgroundColor: 'rgba(196, 30, 58, 0.15)',
          borderColor: 'rgba(196, 30, 58, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(196, 30, 58, 1)',
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
  showApply.value = true
}

function openApplyModalWithRole(role) {
  applyForm.selectedRole = role
  showApply.value = true
}

function closeApplyModal() {
  showApply.value = false
  applyForm.selectedRole = ''
  applyForm.message = ''
}

function submitApply() {
  console.log('提交申请:', { ...applyForm })
  closeApplyModal()
}

function toggleFavorite() {
  isFavorited.value = !isFavorited.value
}

function handleShare() {
  console.log('分享团队')
}

function handleApprove(member) {
  console.log('通过:', member.name)
}

function handleReject(member) {
  console.log('拒绝:', member.name)
}

function handleDownload(file) {
  console.log('下载文件:', file.name)
}

function handlePreview(file) {
  console.log('预览文件:', file.name)
}

function handleDeleteFile(file) {
  console.log('删除文件:', file.name)
}

function handleUploadFile() {
  console.log('上传文件')
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

<script>
export default {
  inheritAttrs: false
}
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
  color: var(--primary-600);
  gap: 0.75rem;
}

/* 团队头部卡片 */
.team-header-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--gray-100);
  margin-bottom: 1.5rem;
  transition: box-shadow var(--transition-base);
}

.team-header-card:hover {
  box-shadow: var(--shadow-lg);
}

.team-banner {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.team-banner::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.08) 100%);
}

.banner-emoji {
  font-size: 6rem;
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.2));
  position: relative;
  z-index: 1;
  animation: floatEmoji 3s ease-in-out infinite;
}

@keyframes floatEmoji {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.team-header-body {
  padding: 2rem;
}

.header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.title-area {
  flex: 1;
}

.team-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--gray-900);
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 0.375rem;
}

.team-goal {
  font-size: 1rem;
  color: var(--gray-500);
  font-weight: 500;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1.125rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-recruiting {
  background: var(--success-50);
  color: var(--success-600);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-urgent {
  background: var(--danger-50);
  color: var(--danger-600);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.status-full {
  background: var(--gray-100);
  color: var(--gray-500);
  border: 1px solid var(--gray-200);
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--gray-100);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--gray-600);
  font-weight: 500;
}

.deadline-meta {
  color: var(--warning-600);
}

.leader-avatar {
  width: 28px;
  height: 28px;
  font-size: 0.75rem;
}

/* 操作按钮组 */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--radius-md);
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
  background: var(--primary-600);
  color: white;
  box-shadow: 0 4px 14px rgba(196, 30, 58, 0.25);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(196, 30, 58, 0.35);
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
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  overflow: hidden;
  transition: all var(--transition-base);
}

.section-card {
  margin-bottom: 1.5rem;
}

.section-card:hover {
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--gray-100);
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
  padding: 1.5rem;
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
  border-top: 1px solid var(--gray-100);
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
  background: var(--primary-600);
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
  padding: 1rem;
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
  transition: all var(--transition-fast);
}

.member-card:hover {
  background: white;
  border-color: var(--primary-100);
  box-shadow: var(--shadow-sm);
}

.member-pending {
  border-color: var(--warning-500);
  background: var(--warning-50);
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
  background: var(--primary-50);
  color: var(--primary-700);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--primary-100);
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
  border-color: var(--primary-200);
  box-shadow: var(--shadow-md);
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
  padding: 1rem 1.125rem;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.file-card:hover {
  border-color: var(--primary-200);
  background: white;
  box-shadow: var(--shadow-sm);
}

.file-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: 1.5rem;
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
  background: var(--primary-50);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--primary-500);
  line-height: 1.85;
}

.desc-highlight strong {
  color: var(--gray-900);
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal-backdrop);
  padding: 1rem;
}

.modal-box {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--gray-200);
}

.modal-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-900);
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
  border: none;
  border-radius: 50%;
  color: var(--gray-500);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.modal-close-btn:hover {
  background: var(--gray-200);
  color: var(--gray-700);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-700);
}

.form-label.required::after {
  content: ' *';
  color: var(--danger-500);
}

.form-select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.9375rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  background: white;
  color: var(--gray-800);
  transition: all var(--transition-fast);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

.form-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.form-textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.9375rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  background: white;
  color: var(--gray-800);
  resize: vertical;
  min-height: 96px;
  line-height: 1.55;
  transition: all var(--transition-fast);
  font-family: var(--font-body);
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.form-textarea::placeholder {
  color: var(--gray-400);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
}

/* 弹窗动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-active .modal-box,
.modal-fade-leave-active .modal-box {
  transition: transform 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-box {
  transform: scale(0.95) translateY(10px);
}

.modal-fade-leave-to .modal-box {
  transform: scale(0.95) translateY(10px);
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

  .team-header-body {
    padding: 1.5rem;
  }

  .team-banner {
    height: 160px;
  }

  .banner-emoji {
    font-size: 4rem;
  }

  .team-title {
    font-size: 1.35rem;
  }

  .header-top {
    flex-direction: column;
    gap: 0.75rem;
  }

  .meta-row {
    gap: 1rem;
    font-size: 0.8125rem;
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
  .team-header-body {
    padding: 1.25rem;
  }

  .team-banner {
    height: 130px;
  }

  .banner-emoji {
    font-size: 3.5rem;
  }

  .team-title {
    font-size: 1.2rem;
  }

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
