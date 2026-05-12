<template>
  <div class="profile-page animate-fade-in">
    <!-- 个人信息头部区 -->
    <section class="profile-header">
      <div class="header-bg"></div>
      <div class="header-content">
        <div class="avatar-wrapper">
          <div class="avatar-xl">{{ userInitial }}</div>
          <span class="online-indicator"></span>
        </div>
        <div class="user-info">
          <h1 class="user-name">{{ userInfo.name }}</h1>
          <p class="user-meta">
            <span>@{{ userInfo.username }}</span>
            <span class="meta-divider">·</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>信誉分: {{ userInfo.reputation }}</span>
          </p>
          <p class="user-bio">{{ userInfo.bio }}</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" @click="showEditModal = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            编辑资料
          </button>
          <button class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            修改密码
          </button>
        </div>
      </div>
    </section>

    <!-- 双列布局：个人信息 + 技能 -->
    <div class="info-grid">
      <!-- 左侧：个人信息详情 -->
      <div class="card info-card">
        <div class="card-header">
          <h3 class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            个人信息
          </h3>
          <button class="btn btn-ghost btn-sm" @click="showEditModal = true">编辑</button>
        </div>
        <div class="card-body">
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                真实姓名
              </span>
              <span class="info-value">{{ userInfo.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M12 9v6"/>
                  <path d="M9 12h6"/>
                </svg>
                学号
              </span>
              <span class="info-value">{{ userInfo.studentId }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                邮箱
              </span>
              <span class="info-value">{{ userInfo.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                注册时间
              </span>
              <span class="info-value">{{ userInfo.registerDate }}</span>
            </div>
            <div class="info-item info-item-last">
              <span class="info-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="17" y1="10" x2="3" y2="10"/>
                  <line x1="21" y1="6" x2="3" y2="6"/>
                  <line x1="21" y1="14" x2="3" y2="14"/>
                  <line x1="17" y1="18" x2="3" y2="18"/>
                </svg>
                个人简介
              </span>
              <span class="info-value bio-text">{{ userInfo.bioShort }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：我的技能 -->
      <div class="card skills-card">
        <div class="card-header">
          <h3 class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-600)" stroke-width="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            我的技能 ({{ skills.length }})
          </h3>
          <button class="btn btn-primary btn-sm" @click="showSkillModal = true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            添加技能
          </button>
        </div>
        <div class="card-body">
          <div class="skills-list">
            <div v-for="(skill, index) in skills" :key="skill.name" class="skill-row">
              <div class="skill-info">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level-badge" :class="getLevelClass(skill.level)">{{ getLevelText(skill.level) }}</span>
              </div>
              <div class="skill-bar-wrapper">
                <div class="skill-bar-track">
                  <div
                    class="skill-bar-fill"
                    :style="{ width: (skill.level / 5 * 100) + '%', background: skill.gradient }"
                  ></div>
                </div>
                <span class="skill-level-num">{{ skill.level }}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的团队 -->
    <section class="teams-section card">
      <div class="card-header">
        <h3 class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          我的团队 ({{ myTeams.length }})
        </h3>
        <router-link to="/teams" class="btn btn-ghost btn-sm">
          浏览更多团队
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </router-link>
      </div>
      <div class="card-body">
        <div class="teams-grid">
          <div v-for="team in myTeams" :key="team.id" class="team-card-mini">
            <div class="team-cover" :style="{ background: team.gradient }">
              <span class="team-emoji">{{ team.emoji }}</span>
            </div>
            <div class="team-body">
              <div class="team-top">
                <h4 class="team-name">{{ team.name }}</h4>
                <span class="role-badge" :class="team.roleClass">{{ team.role }}</span>
              </div>
              <p class="team-role-desc">{{ team.roleDesc }}</p>
              <div class="team-bottom">
                <span class="status-badge" :class="team.statusClass">{{ team.status }}</span>
                <button class="btn-action" :class="team.status === '已结束' ? 'btn-secondary' : 'btn-primary'">
                  {{ team.status === '已结束' ? '查看详情' : '进入团队' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 收到的评价 -->
    <section class="reviews-section card">
      <div class="card-header">
        <h3 class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning-500)" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          收到的评价 ({{ reviews.length }}条)
        </h3>
        <span class="avg-score">平均合作分: <strong>{{ avgRating }} / 5</strong></span>
      </div>
      <div class="card-body">
        <div class="reviews-list">
          <div v-for="(review, index) in reviews" :key="index" class="review-item" :class="{ 'no-border': index === reviews.length - 1 }">
            <div class="reviewer-avatar" :style="{ background: review.avatarGradient }">{{ review.initial }}</div>
            <div class="review-content">
              <div class="review-header">
                <div class="reviewer-info">
                  <span class="reviewer-name">{{ review.name }}</span>
                  <span class="review-from">· 来自</span>
                  <a href="#" class="team-link">{{ review.teamName }}</a>
                </div>
                <span class="review-date">{{ review.date }}</span>
              </div>
              <div class="review-scores">
                <div class="score-item">
                  <span class="score-label">合作质量:</span>
                  <div class="stars">
                    <svg v-for="s in 5" :key="'q'+s" class="star" :class="{ filled: s <= review.qualityScore }" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                </div>
                <div class="score-item">
                  <span class="score-label">贡献程度:</span>
                  <div class="stars">
                    <svg v-for="s in 5" :key="'c'+s" class="star" :class="{ filled: s <= review.contributionScore }" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                </div>
              </div>
              <p class="review-text">"{{ review.comment }}"</p>
            </div>
          </div>
        </div>
        <div class="reviews-footer">
          <button class="btn btn-outline">查看更多评价</button>
        </div>
      </div>
    </section>

    <!-- 添加技能弹窗 -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showSkillModal" class="modal-overlay" @click.self="showSkillModal = false">
          <div class="modal">
            <div class="modal-header">
              <h3 class="modal-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                添加新技能
              </h3>
              <button class="modal-close" @click="showSkillModal = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label required">选择技能</label>
                <select v-model="newSkill.name" class="form-input form-select">
                  <option value="">请选择技能...</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="React">React</option>
                  <option value="Vue.js">Vue.js</option>
                  <option value="Node.js">Node.js</option>
                  <option value="深度学习">深度学习</option>
                  <option value="计算机视觉">计算机视觉</option>
                  <option value="自然语言处理">自然语言处理</option>
                  <option value="数据库">数据库</option>
                  <option value="Java">Java</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                  <option value="Flutter">Flutter</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">熟练度</label>
                <div class="proficiency-options">
                  <label v-for="lvl in 5" :key="lvl" class="prof-option" :class="{ active: newSkill.level === lvl }">
                    <input type="radio" :value="lvl" v-model="newSkill.level" hidden />
                    <span class="prof-dot"></span>
                    <span class="prof-text">{{ ['入门', '初级', '中级', '高级', '专家'][lvl - 1] }}</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="showSkillModal = false">取消</button>
              <button class="btn btn-primary" @click="handleAddSkill" :disabled="!newSkill.name || !newSkill.level">确认添加</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 编辑资料弹窗 -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
          <div class="modal modal-lg">
            <div class="modal-header">
              <h3 class="modal-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                编辑个人资料
              </h3>
              <button class="modal-close" @click="showEditModal = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">真实姓名</label>
                  <input v-model="editForm.name" type="text" class="form-input" placeholder="请输入真实姓名" />
                </div>
                <div class="form-group">
                  <label class="form-label required">学号</label>
                  <input v-model="editForm.studentId" type="text" class="form-input" placeholder="请输入学号" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label required">邮箱</label>
                <input v-model="editForm.email" type="email" class="form-input" placeholder="请输入邮箱地址" />
              </div>
              <div class="form-group">
                <label class="form-label required">用户名</label>
                <input v-model="editForm.username" type="text" class="form-input" placeholder="请输入用户名" />
              </div>
              <div class="form-group">
                <label class="form-label">个人简介</label>
                <textarea v-model="editForm.bio" class="form-input form-textarea" rows="4" placeholder="介绍一下你自己..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="showEditModal = false">取消</button>
              <button class="btn btn-primary" @click="handleSaveProfile">保存更改</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const userInfo = reactive({
  name: '张三',
  username: 'zhangsan',
  reputation: '4.8',
  bio: '热爱编程，专注于人工智能和算法研究，希望找到志同道合的队友一起参加竞赛！',
  bioShort: '热爱编程，专注于人工智能和算法研究',
  studentId: '20240001',
  email: 'zhangsan@univ.edu.cn',
  registerDate: '2024-09-01'
})

const userInitial = computed(() => userInfo.name.charAt(0))

const skills = ref([
  { name: 'Python', level: 4, gradient: 'var(--primary-600)' },
  { name: 'C++', level: 3, gradient: 'var(--accent-600)' },
  { name: '机器学习', level: 5, gradient: 'var(--success-600)' },
  { name: '算法设计', level: 4, gradient: 'var(--warning-600)' },
  { name: '数据分析', level: 3, gradient: '#0f766e' }
])

const myTeams = ref([
  {
    id: 1,
    name: '无人车战队',
    emoji: '🏎️',
    role: '队长',
    roleClass: 'role-leader',
    roleDesc: '角色: 队长 / 算法工程师',
    status: '进行中',
    statusClass: 'status-active',
    gradient: '#27272a'
  },
  {
    id: 2,
    name: 'AI创新赛',
    emoji: '🤖',
    role: '成员',
    roleClass: 'role-member',
    roleDesc: '角色: Python开发',
    status: '招募中',
    statusClass: 'status-recruiting',
    gradient: '#166534'
  },
  {
    id: 3,
    name: '数学建模',
    emoji: '📊',
    role: '成员',
    roleClass: 'role-member',
    roleDesc: '角色: 编程手',
    status: '已结束',
    statusClass: 'status-ended',
    gradient: '#52525b'
  }
])

const reviews = ref([
  {
    name: '李明',
    initial: '李',
    avatarGradient: 'var(--primary-600)',
    teamName: '无人车战队',
    date: '2025-04-15',
    qualityScore: 5,
    contributionScore: 5,
    comment: '非常靠谱的队友，技术能力强，沟通顺畅！在项目中承担了核心算法的开发工作，解决问题效率很高。'
  },
  {
    name: '王芳',
    initial: '王',
    avatarGradient: 'var(--success-600)',
    teamName: 'AI创新赛',
    date: '2025-03-20',
    qualityScore: 5,
    contributionScore: 4,
    comment: '团队协作意识很强，代码质量高，乐于分享知识。'
  },
  {
    name: '孙伟',
    initial: '孙',
    avatarGradient: 'var(--accent-600)',
    teamName: '数学建模',
    date: '2025-02-10',
    qualityScore: 4,
    contributionScore: 5,
    comment: '编程能力出色，在建模比赛中负责了所有代码实现，帮助团队获得了二等奖的好成绩！'
  }
])

const avgRating = computed(() => {
  const total = reviews.value.reduce((sum, r) => sum + (r.qualityScore + r.contributionScore) / 2, 0)
  return (total / reviews.value.length).toFixed(1)
})

const showSkillModal = ref(false)
const showEditModal = ref(false)

const newSkill = reactive({
  name: '',
  level: 3
})

const editForm = reactive({
  name: userInfo.name,
  studentId: userInfo.studentId,
  email: userInfo.email,
  username: userInfo.username,
  bio: userInfo.bio
})

const gradients = [
  'var(--primary-600)',
  'var(--accent-600)',
  'var(--success-600)',
  'var(--warning-600)',
  '#9f1239',
  'var(--danger-600)',
  '#0f766e'
]

function handleAddSkill() {
  if (!newSkill.name || !newSkill.level) return
  const gradientIndex = skills.value.length % gradients.length
  skills.value.push({
    name: newSkill.name,
    level: newSkill.level,
    gradient: gradients[gradientIndex]
  })
  newSkill.name = ''
  newSkill.level = 3
  showSkillModal.value = false
}

function handleSaveProfile() {
  Object.assign(userInfo, editForm)
  showEditModal.value = false
}

function getLevelText(level) {
  return ['', '入门', '初级', '中级', '高级', '专家'][level]
}

function getLevelClass(level) {
  return ['level-1', 'level-2', 'level-3', 'level-4', 'level-5'][level]
}
</script>

<style scoped>
.profile-page {
  max-width: 1280px;
}

/* ====== 头部区域 ====== */
.profile-header {
  position: relative;
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: var(--gray-100);
}

.header-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem 2.5rem 2rem;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar-xl {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.25rem;
  font-weight: 800;
  font-family: var(--font-display);
  box-shadow: 0 8px 24px rgba(196, 30, 58, 0.25);
  border: 4px solid white;
}

.online-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--success-500);
  border: 3px solid white;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--gray-900);
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 0.375rem;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-500);
  font-size: 0.9375rem;
  margin-bottom: 0.625rem;
}

.meta-divider {
  color: var(--gray-300);
}

.user-bio {
  color: var(--gray-600);
  font-size: 0.9375rem;
  line-height: 1.6;
  max-width: 520px;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

/* ====== 按钮 ====== */
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
  transition: all var(--transition-base);
  text-decoration: none;
  white-space: nowrap;
  font-family: inherit;
}

.btn-sm {
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
}

.btn-primary {
  background: var(--primary-600);
  color: white;
  box-shadow: 0 2px 8px rgba(196, 30, 58, 0.2);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(196, 30, 58, 0.35);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
}

.btn-secondary:hover {
  background: var(--gray-200);
  color: var(--gray-900);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--gray-300);
  color: var(--gray-700);
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

/* ====== 卡片通用 ====== */
.card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  overflow: hidden;
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
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-body {
  padding: 1.5rem;
}

/* ====== 双列信息网格 ====== */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* ====== 信息列表 ====== */
.info-list {
  display: flex;
  flex-direction: column;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--gray-100);
  gap: 1rem;
}

.info-item-last {
  border-bottom: none;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-500);
  font-size: 0.9375rem;
  font-weight: 500;
  flex-shrink: 0;
}

.info-value {
  font-weight: 600;
  color: var(--gray-900);
  font-size: 0.9375rem;
  text-align: right;
}

.bio-text {
  max-width: 220px;
  text-align: right;
}

/* ====== 技能列表 ====== */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.skill-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-info {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.skill-name {
  font-weight: 600;
  color: var(--gray-800);
  font-size: 0.9375rem;
  min-width: 80px;
}

.skill-level-badge {
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.level-1 { background: #FEF2F2; color: #DC2626; }
.level-2 { background: #FFF7ED; color: #EA580C; }
.level-3 { background: #FFFBEB; color: #D97706; }
.level-4 { background: #ECFDF5; color: #059669; }
.level-5 { background: #EEF2FF; color: #4F46E5; }

.skill-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.skill-bar-track {
  flex: 1;
  height: 10px;
  background: var(--gray-100);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.skill-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.skill-level-num {
  min-width: 36px;
  font-size: 0.8125rem;
  color: var(--gray-500);
  font-weight: 600;
  text-align: right;
}

/* ====== 团队卡片网格 ====== */
.teams-section {
  margin-bottom: 2rem;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.team-card-mini {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--gray-100);
  transition: all var(--transition-base);
}

.team-card-mini:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.team-cover {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-emoji {
  font-size: 3rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
}

.team-body {
  padding: 1.125rem;
}

.team-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.375rem;
}

.team-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--gray-900);
}

.role-badge {
  padding: 0.175rem 0.625rem;
  border-radius: var(--radius-full);
  font-size: 0.6875rem;
  font-weight: 700;
}

.role-leader {
  background: #FEF3C7;
  color: #D97706;
}

.role-member {
  background: var(--gray-100);
  color: var(--gray-600);
}

.team-role-desc {
  font-size: 0.8125rem;
  color: var(--gray-500);
  margin-bottom: 0.875rem;
}

.team-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.875rem;
  border-top: 1px solid var(--gray-100);
}

.status-badge {
  padding: 0.2rem 0.625rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.status-active {
  background: var(--primary-50);
  color: var(--primary-700);
}

.status-recruiting {
  background: #ECFDF5;
  color: #059669;
}

.status-ended {
  background: var(--gray-100);
  color: var(--gray-500);
}

.btn-action {
  padding: 0.3rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.btn-action.btn-primary {
  background: var(--primary-600);
  color: white;
}

.btn-action.btn-primary:hover {
  box-shadow: 0 2px 8px rgba(196, 30, 58, 0.3);
}

.btn-action.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-600);
}

.btn-action.btn-secondary:hover {
  background: var(--gray-200);
}

/* ====== 评价列表 ====== */
.reviews-section {
  margin-bottom: 2rem;
}

.avg-score {
  font-size: 0.875rem;
  color: var(--gray-500);
}

.avg-score strong {
  color: var(--warning-600);
  font-family: var(--font-display);
}

.reviews-list {
  display: flex;
  flex-direction: column;
}

.review-item {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--gray-100);
}

.review-item.no-border {
  border-bottom: none;
}

.reviewer-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.review-content {
  flex: 1;
  min-width: 0;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.9375rem;
}

.reviewer-name {
  font-weight: 700;
  color: var(--gray-900);
}

.review-from {
  color: var(--gray-400);
  font-size: 0.8125rem;
}

.team-link {
  color: var(--primary-600);
  font-weight: 500;
  font-size: 0.875rem;
}

.team-link:hover {
  color: var(--primary-700);
  text-decoration: underline;
}

.review-date {
  font-size: 0.8125rem;
  color: var(--gray-400);
  flex-shrink: 0;
}

.review-scores {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 0.625rem;
  flex-wrap: wrap;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
}

.score-label {
  color: var(--gray-500);
}

.stars {
  display: flex;
  gap: 1px;
}

.star {
  color: var(--gray-300);
  transition: color var(--transition-fast);
}

.star.filled {
  color: var(--warning-500);
}

.review-text {
  color: var(--gray-600);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.reviews-footer {
  display: flex;
  justify-content: center;
  padding-top: 1.5rem;
  margin-top: 0.5rem;
}

/* ====== 弹窗 ====== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal-backdrop);
  padding: 1.5rem;
}

.modal {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-lg {
  max-width: 560px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--gray-100);
  flex-shrink: 0;
}

.modal-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  color: var(--gray-500);
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background: var(--gray-200);
  color: var(--gray-700);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-100);
  background: var(--gray-50);
  flex-shrink: 0;
}

/* ====== 表单 ====== */
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

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.9375rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  background: white;
  transition: all var(--transition-fast);
  font-family: inherit;
  color: var(--gray-900);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.1);
}

.form-input::placeholder {
  color: var(--gray-400);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

.form-textarea {
  resize: vertical;
  min-height: 88px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* ====== 熟练度选择 ====== */
.proficiency-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.prof-option {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: white;
}

.prof-option:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

.prof-option.active {
  border-color: var(--primary-500);
  background: var(--primary-50);
  color: var(--primary-700);
}

.prof-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gray-300);
  transition: background var(--transition-fast);
}

.prof-option.active .prof-dot {
  background: var(--primary-600);
}

.prof-text {
  font-size: 0.8125rem;
  font-weight: 500;
}

/* ====== 弹窗动画 ====== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-active .modal,
.modal-fade-leave-active .modal {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal,
.modal-fade-leave-to .modal {
  transform: scale(0.95) translateY(10px);
}

/* ====== 响应式设计 ====== */
@media (max-width: 1024px) {
  .teams-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.25rem;
    padding: 1.75rem 1.5rem 1.5rem;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
  }

  .user-bio {
    max-width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .teams-grid {
    grid-template-columns: 1fr;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .info-value {
    text-align: left;
  }

  .bio-text {
    max-width: 100%;
    text-align: left;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .review-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .review-date {
    align-self: flex-start;
  }

  .modal {
    max-width: 100%;
    margin: 1rem;
  }

  .profile-header {
    margin-bottom: 1.5rem;
  }

  .teams-section,
  .reviews-section {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .header-actions .btn {
    width: 100%;
  }

  .user-name {
    font-size: 1.375rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .proficiency-options {
    flex-direction: column;
  }

  .prof-option {
    width: 100%;
    justify-content: center;
  }
}
</style>
