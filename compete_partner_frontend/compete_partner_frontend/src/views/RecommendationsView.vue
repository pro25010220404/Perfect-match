<template>
  <div class="recommendations-page animate-fade-in">
    <!-- 页面标题区 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          智能队友推荐
        </h1>
        <p class="page-subtitle">基于技能互补、竞赛经验与协作风格的AI匹配算法，为你精准推荐最佳搭档</p>
      </div>
    </div>

    <!-- 算法流程说明 -->
    <div class="algorithm-flow">
      <div class="flow-step" v-for="(step, index) in algorithmSteps" :key="index">
        <div class="step-icon" :style="{ background: step.gradient }">
          <span>{{ step.icon }}</span>
        </div>
        <div class="step-info">
          <h4 class="step-title">{{ step.title }}</h4>
          <p class="step-desc">{{ step.desc }}</p>
        </div>
        <div v-if="index < algorithmSteps.length - 1" class="flow-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </div>

    <!-- 用户技能概览卡片 -->
    <section class="skill-overview-section">
      <div class="section-header">
        <div>
          <h2 class="section-title">📊 我的技能画像</h2>
          <p class="section-subtitle">系统基于以下技能数据为你匹配队友</p>
        </div>
        <router-link to="/profile" class="btn-edit-profile">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          编辑技能
        </router-link>
      </div>

      <div class="skill-overview-card">
        <div class="user-profile-side">
          <div class="avatar-wrapper">
            <div class="avatar-ring"></div>
            <div class="avatar">张</div>
          </div>
          <div class="user-basic">
            <h3 class="user-name">张三</h3>
            <p class="user-school">清华大学 · 计算机科学与技术</p>
            <div class="user-stats">
              <div class="stat-mini">
                <span class="stat-num">8</span>
                <span class="stat-label">参与竞赛</span>
              </div>
              <div class="stat-mini">
                <span class="stat-num">4.8</span>
                <span class="stat-label">信誉评分</span>
              </div>
              <div class="stat-mini">
                <span class="stat-num">6</span>
                <span class="stat-label">掌握技能</span>
              </div>
            </div>
          </div>
        </div>

        <div class="skills-display">
          <div v-for="skill in mySkills" :key="skill.name" class="skill-bar-item">
            <div class="skill-bar-header">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-level-badge" :class="'level-' + skill.level">{{ levelText(skill.level) }}</span>
            </div>
            <div class="skill-bar-track">
              <div
                class="skill-bar-fill"
                :style="{ width: skill.level * 20 + '%', background: getSkillColor(skill.level) }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 筛选栏 -->
    <div class="filter-section">
      <div class="filter-card">
        <div class="filter-row">
          <div class="filter-group">
            <label class="filter-label">匹配度</label>
            <select v-model="filters.matchLevel" class="filter-select">
              <option value="">全部</option>
              <option value="high">高匹配 (≥80%)</option>
              <option value="medium">中等 (60-79%)</option>
              <option value="low">潜力 (&lt;60%)</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">技能方向</label>
            <select v-model="filters.skillType" class="filter-select">
              <option value="">全部方向</option>
              <option value="algorithm">算法/编程</option>
              <option value="frontend">前端开发</option>
              <option value="backend">后端开发</option>
              <option value="design">设计/UI</option>
              <option value="hardware">硬件/嵌入式</option>
              <option value="data">数据分析</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">排序方式</label>
            <select v-model="filters.sortBy" class="filter-select">
              <option value="matchDesc">匹配度从高到低</option>
              <option value="matchAsc">匹配度从低到高</option>
              <option value="rating">信誉评分最高</option>
            </select>
          </div>

          <button class="btn-reset" @click="resetFilters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
            重置筛选
          </button>
        </div>

        <div class="filter-stats">
          <span class="stats-text">
            为你找到 <strong>{{ filteredRecommendations.length }}</strong> 位推荐队友
          </span>
        </div>
      </div>
    </div>

    <!-- 推荐队友列表 -->
    <div class="recommendations-grid">
      <div
        v-for="person in filteredRecommendations"
        :key="person.id"
        class="recommendation-card"
        :class="{ 'expanded': expandedCard === person.id }"
      >
        <!-- 卡片顶部：头像 + 匹配度 -->
        <div class="card-top">
          <div class="card-avatar-area">
            <div class="avatar-container" :style="{ borderColor: matchColor(person.matchScore).border }">
              <span class="avatar-char">{{ person.avatar }}</span>
              <span v-if="person.online" class="online-dot"></span>
            </div>
            <div class="person-identity">
              <h3 class="person-name">{{ person.name }}</h3>
              <p class="person-school">{{ person.school }} · {{ person.major }}</p>
            </div>
          </div>

          <!-- 圆形匹配度 -->
          <div class="match-circle-wrapper">
            <svg class="match-circle" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" class="circle-bg" />
              <circle
                cx="50"
                cy="50"
                r="42"
                class="circle-progress"
                :stroke="matchColor(person.matchScore).color"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference - (person.matchScore / 100) * circumference"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div class="match-value" :style="{ color: matchColor(person.matchScore).color }">
              {{ person.matchScore }}<small>%</small>
            </div>
            <span class="match-label">匹配度</span>
          </div>
        </div>

        <!-- 技能对比区域 -->
        <div class="skill-comparison">
          <h4 class="comparison-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20V10"></path>
              <path d="M18 20V4"></path>
              <path d="M6 20v-4"></path>
            </svg>
            技能互补分析
          </h4>
          <div class="skill-bars">
            <div v-for="comp in person.skillComparison" :key="comp.skill" class="skill-compare-row">
              <span class="compare-skill-name">{{ comp.skill }}</span>
              <div class="compare-bars">
                <div class="bar-pair">
                  <div class="bar mine" :style="{ width: comp.mineLevel * 20 + '%' }">
                    <span class="bar-tooltip">我: {{ levelText(comp.mineLevel) }}</span>
                  </div>
                  <div class="bar theirs" :style="{ width: comp.theirLevel * 20 + '%', background: getCompareBarColor(comp.theirLevel, comp.mineLevel) }">
                    <span class="bar-tooltip">{{ person.name }}: {{ levelText(comp.theirLevel) }}</span>
                  </div>
                </div>
              </div>
              <span class="compare-diff" :class="getDiffClass(comp.theirLevel, comp.mineLevel)">
                {{ comp.theirLevel > comp.mineLevel ? '+' + ((comp.theirLevel - comp.mineLevel) * 20) + '%' : '' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 优势标签 -->
        <div class="advantage-tags">
          <span v-for="tag in person.tags" :key="tag.text" class="adv-tag" :class="tag.type">
            {{ tag.icon }} {{ tag.text }}
          </span>
        </div>

        <!-- 元信息 -->
        <div class="card-meta">
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            {{ person.rating }}
          </span>
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            {{ person.competitions }}次参赛
          </span>
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {{ person.successRate }}%协作成功率
          </span>
        </div>

        <!-- 操作按钮 -->
        <div class="card-actions">
          <button class="btn-invite" @click="handleInvite(person)" :disabled="person.invited">
            <svg v-if="!person.invited" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {{ person.invited ? '已邀请' : '邀请加入团队' }}
          </button>
          <button class="btn-detail" @click="toggleExpand(person.id)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            查看详情
          </button>
        </div>

        <!-- 展开详情 -->
        <transition name="expand">
          <div v-if="expandedCard === person.id" class="expand-detail">
            <div class="detail-grid">
              <div class="detail-block">
                <h5 class="detail-heading">🏆 竞赛经历</h5>
                <ul class="detail-list">
                  <li v-for="(exp, i) in person.experiences" :key="i">{{ exp }}</li>
                </ul>
              </div>
              <div class="detail-block">
                <h5 class="detail-heading">💡 协作风格</h5>
                <p class="detail-text">{{ person.workStyle }}</p>
              </div>
              <div class="detail-block full-width">
                <h5 class="detail-heading">🎯 推荐理由</h5>
                <p class="reason-text">{{ person.reason }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredRecommendations.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3 class="empty-title">没有找到匹配的推荐</h3>
      <p class="empty-desc">试试调整筛选条件，发现更多潜在队友</p>
      <button class="btn-reset-empty" @click="resetFilters">重置筛选条件</button>
    </div>

    <!-- 匹配算法说明区域 -->
    <section class="algorithm-explain-section">
      <div class="explain-card">
        <div class="explain-header">
          <h2 class="explain-title">⚙️ 匹配算法工作原理</h2>
          <p class="explain-subtitle">了解我们的智能推荐引擎如何为你找到最佳队友</p>
        </div>

        <div class="algorithm-factors">
          <div class="factor-card" v-for="(factor, index) in algorithmFactors" :key="index">
            <div class="factor-icon-wrap" :style="{ background: factor.bgGradient }">
              <span class="factor-icon">{{ factor.icon }}</span>
            </div>
            <div class="factor-body">
              <h4 class="factor-name">{{ factor.name }}</h4>
              <p class="factor-desc">{{ factor.desc }}</p>
              <div class="factor-weight">
                <span class="weight-label">权重占比</span>
                <div class="weight-bar-track">
                  <div class="weight-bar-fill" :style="{ width: factor.weight + '%', background: factor.color }"></div>
                </div>
                <span class="weight-value" :style="{ color: factor.color }">{{ factor.weight }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="formula-box">
          <div class="formula-label">综合匹配分计算公式</div>
          <div class="formula-content">
            <code>Match = 0.35 × 技能互补度 + 0.25 × 经验契合度 + 0.20 × 协作风格匹配 + 0.20 × 目标一致性</code>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const circumference = 2 * Math.PI * 42
const expandedCard = ref(null)

const algorithmSteps = [
  { icon: '📋', title: '技能采集', desc: '分析你的技能树与熟练度', gradient: '#3f3f46' },
  { icon: '🔍', title: '特征提取', desc: '挖掘竞赛偏好与协作模式', gradient: '#0f766e' },
  { icon: '🧮', title: '多维匹配', desc: '交叉比对候选人能力矩阵', gradient: '#854d0e' },
  { icon: '📊', title: '智能排序', desc: '输出最优推荐列表', gradient: '#9f1239' }
]

const mySkills = ref([
  { name: 'Python', level: 5 },
  { name: '算法设计', level: 4 },
  { name: '机器学习', level: 3 },
  { name: 'Java', level: 3 },
  { name: '数据库', level: 3 },
  { name: 'Linux运维', level: 2 }
])

const recommendations = ref([
  {
    id: 1,
    name: '李明',
    avatar: '李',
    school: '北京大学',
    major: '人工智能',
    matchScore: 95,
    rating: '4.9',
    competitions: 12,
    successRate: 96,
    online: true,
    invited: false,
    tags: [
      { text: '算法专家', type: 'expert', icon: '🏆' },
      { text: 'ACM金牌', type: 'award', icon: '🥇' },
      { text: '全栈能力', type: 'skill', icon: '💻' }
    ],
    skillComparison: [
      { skill: 'Python', mineLevel: 5, theirLevel: 5 },
      { skill: '算法设计', mineLevel: 4, theirLevel: 5 },
      { skill: '前端开发', mineLevel: 1, theirLevel: 4 },
      { skill: 'C/C++', mineLevel: 2, theirLevel: 5 },
      { skill: '机器学习', mineLevel: 3, theirLevel: 4 }
    ],
    experiences: ['2024 ACM-ICPC 区域赛 金牌', '2023 蓝桥杯 全国一等奖', '2023 数学建模 国赛二等奖'],
    workStyle: '注重代码质量，善于技术方案设计，喜欢深度讨论后再动手实现。有丰富的带队经验。',
    reason: '你的算法和Python能力与他高度互补，他在前端和C++方向的强项正好弥补你的短板，是理想的全栈搭档。'
  },
  {
    id: 2,
    name: '王芳',
    avatar: '王',
    school: '浙江大学',
    major: '软件工程',
    matchScore: 88,
    rating: '4.7',
    competitions: 9,
    successRate: 92,
    online: true,
    invited: false,
    tags: [
      { text: '前端高手', type: 'expert', icon: '🎨' },
      { text: 'UI/UX达人', type: 'skill', icon: '✨' },
      { text: '敏捷开发', type: 'method', icon: '⚡' }
    ],
    skillComparison: [
      { skill: 'Python', mineLevel: 5, theirLevel: 3 },
      { skill: '前端开发', mineLevel: 1, theirLevel: 5 },
      { skill: 'Vue/React', mineLevel: 1, theirLevel: 5 },
      { skill: 'UI设计', mineLevel: 1, theirLevel: 4 },
      { skill: 'Node.js', mineLevel: 2, theirLevel: 4 }
    ],
    experiences: ['2024 中国大学生软件设计大赛 一等奖', '2023 "互联网+"大赛 省级金奖', '2022 前端创新挑战赛 优胜奖'],
    workStyle: '追求极致用户体验，擅长快速原型迭代。沟通高效，能很好地将需求转化为可交互界面。',
    reason: '你在后端/算法方面实力强劲，而她在前端开发和UI设计方面出类拔萃，形成完美的前后端分工组合。'
  },
  {
    id: 3,
    name: '赵强',
    avatar: '赵',
    school: '上海交通大学',
    major: '电子工程',
    matchScore: 82,
    rating: '4.8',
    competitions: 15,
    successRate: 88,
    online: false,
    invited: false,
    tags: [
      { text: '嵌入式专家', type: 'expert', icon: '🔧' },
      { text: 'RoboMaster老将', type: 'award', icon: '🤖' },
      { text: '硬件驱动', type: 'skill', icon: '⚙️' }
    ],
    skillComparison: [
      { skill: 'Python', mineLevel: 5, theirLevel: 3 },
      { skill: '嵌入式C', mineLevel: 1, theirLevel: 5 },
      { skill: 'PCB设计', mineLevel: 0, theirLevel: 4 },
      { skill: 'FPGA', mineLevel: 0, theirLevel: 3 },
      { skill: 'ROS', mineLevel: 2, theirLevel: 4 }
    ],
    experiences: ['2024 RoboMaster 机甲大师赛 全国八强（队长）', '2023 全国电子设计竞赛 一等奖', '2022 智能车竞赛 国家二等奖'],
    workStyle: '实战经验丰富，擅长硬件选型和系统集成。做事严谨，对细节要求高，适合需要软硬件结合的项目。',
    reason: '你的软件算法能力+他的硬件嵌入式专长=软硬结合的完美组合，特别适合智能车/机器人类竞赛项目。'
  },
  {
    id: 4,
    name: '陈思雨',
    avatar: '陈',
    school: '复旦大学',
    major: '数据科学',
    matchScore: 76,
    rating: '4.6',
    competitions: 7,
    successRate: 94,
    online: true,
    invited: false,
    tags: [
      { text: '数据可视化', type: 'skill', icon: '📈' },
      { text: '论文写作强', type: 'skill', icon: '✍️' },
      { text: '细心负责', type: 'trait', icon: '💯' }
    ],
    skillComparison: [
      { skill: 'Python', mineLevel: 5, theirLevel: 4 },
      { skill: '数据挖掘', mineLevel: 2, theirLevel: 5 },
      { skill: 'Tableau', mineLevel: 1, theirLevel: 4 },
      { skill: '论文写作', mineLevel: 2, theirLevel: 5 },
      { skill: '统计学', mineLevel: 2, theirLevel: 4 }
    ],
    experiences: ['2024 全国大数据挑战赛 二等奖', '2023 数学建模美赛 Finalist', '2023 数据分析可视化大赛 优秀奖'],
    workStyle: '逻辑清晰，善于将复杂数据转化为直观图表。文档撰写能力强，能高质量完成论文和报告部分。',
    reason: '在数据分析和建模竞赛中，你的算法实现能力配合她的数据处理与论文写作能力，可以覆盖完整竞赛流程。'
  },
  {
    id: 5,
    name: '刘浩然',
    avatar: '刘',
    school: '中国科学技术大学',
    major: '计算机科学',
    matchScore: 71,
    rating: '4.5',
    competitions: 5,
    successRate: 85,
    online: true,
    invited: false,
    tags: [
      { text: 'DevOps能手', type: 'skill', icon: '🚀' },
      { text: '云原生', type: 'skill', icon: '☁️' },
      { text: '新人潜力股', type: 'trait', icon: '🌟' }
    ],
    skillComparison: [
      { skill: 'Python', mineLevel: 5, theirLevel: 3 },
      { skill: 'Docker/K8s', mineLevel: 1, theirLevel: 4 },
      { skill: 'CI/CD', mineLevel: 1, theirLevel: 4 },
      { skill: '云服务部署', mineLevel: 1, theirLevel: 3 },
      { skill: 'Go语言', mineLevel: 1, theirLevel: 3 }
    ],
    experiences: ['2024 云原生应用创新大赛 三等奖', '2023 校级黑客马拉松 冠军'],
    workStyle: '热衷于新技术探索，对DevOps和云原生领域有深入研究。学习能力强，乐于尝试新工具和新框架。',
    reason: '虽然竞赛经验相对较少，但在DevOps和云服务方面的专业能力可以为你的项目提供坚实的部署运维保障。'
  }
])

const filters = ref({
  matchLevel: '',
  skillType: '',
  sortBy: 'matchDesc'
})

const filteredRecommendations = computed(() => {
  let result = [...recommendations.value]

  if (filters.value.matchLevel) {
    result = result.filter(p => {
      if (filters.value.matchLevel === 'high') return p.matchScore >= 80
      if (filters.value.matchLevel === 'medium') return p.matchScore >= 60 && p.matchScore < 80
      if (filters.value.matchLevel === 'low') return p.matchScore < 60
      return true
    })
  }

  if (filters.value.skillType) {
    const typeMap = {
      algorithm: ['算法设计', 'C/C++', '机器学习'],
      frontend: ['前端开发', 'Vue/React', 'UI设计'],
      backend: ['Node.js', 'Go语言', 'Java'],
      design: ['UI设计', 'Tableau', '论文写作'],
      hardware: ['嵌入式C', 'PCB设计', 'FPGA', 'ROS'],
      data: ['数据挖掘', '统计学', 'Docker/K8s']
    }
    const keywords = typeMap[filters.value.skillType] || []
    result = result.filter(p =>
      p.tags.some(t => keywords.some(k => t.text.includes(k))) ||
      p.skillComparison.some(s => keywords.includes(s.skill))
    )
  }

  switch (filters.value.sortBy) {
    case 'matchDesc':
      result.sort((a, b) => b.matchScore - a.matchScore)
      break
    case 'matchAsc':
      result.sort((a, b) => a.matchScore - b.matchScore)
      break
    case 'rating':
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      break
  }

  return result
})

const algorithmFactors = [
  {
    icon: '🔗',
    name: '技能互补度',
    desc: '分析双方技能树的互补性，优先推荐能填补你技能空白的候选人',
    weight: 35,
    color: '#2563EB',
    bgGradient: 'var(--gray-100)'
  },
  {
    icon: '🏅',
    name: '经验契合度',
    desc: '基于历史竞赛成绩、参赛次数和获奖记录评估候选人的实战经验',
    weight: 25,
    color: '#059669',
    bgGradient: 'var(--gray-100)'
  },
  {
    icon: '🤝',
    name: '协作风格匹配',
    desc: '通过历史协作数据、评价反馈和工作习惯判断双方的协作兼容性',
    weight: 20,
    color: '#8B5CF6',
    bgGradient: 'var(--gray-100)'
  },
  {
    icon: '🎯',
    name: '目标一致性',
    desc: '根据双方关注的竞赛类型、目标赛事和时间安排进行匹配度加权',
    weight: 20,
    color: '#F59E0B',
    bgGradient: 'var(--gray-100)'
  }
]

function matchColor(score) {
  if (score >= 80) return { color: '#10B981', border: 'rgba(16,185,129,0.3)' }
  if (score >= 60) return { color: '#3B82F6', border: 'rgba(59,130,246,0.3)' }
  return { color: '#F59E0B', border: 'rgba(245,158,11,0.3)' }
}

function getSkillColor(level) {
  const colors = ['var(--gray-500)', 'var(--warning-600)', 'var(--primary-600)', 'var(--accent-600)', 'var(--success-600)']
  return colors[level - 1] || colors[0]
}

function getCompareBarColor(theirLevel, mineLevel) {
  if (theirLevel > mineLevel) return 'var(--success-600)'
  if (theirLevel === mineLevel) return 'var(--primary-600)'
  return 'var(--gray-400)'
}

function getDiffClass(theirLevel, mineLevel) {
  if (theirLevel > mineLevel) return 'positive'
  if (theirLevel === mineLevel) return 'neutral'
  return 'negative'
}

function levelText(level) {
  const texts = ['', '入门', '初级', '中级', '高级', '精通']
  return texts[level] || '未知'
}

function resetFilters() {
  filters.value = {
    matchLevel: '',
    skillType: '',
    sortBy: 'matchDesc'
  }
}

function handleInvite(person) {
  person.invited = !person.invited
}

function toggleExpand(id) {
  expandedCard.value = expandedCard.value === id ? null : id
}
</script>

<style scoped>
.recommendations-page {
  max-width: 1280px;
}

/* 页面头部 */
.page-header {
  margin-bottom: 2rem;
  padding: 1.75rem 1.5rem;
  background: #fff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.625rem;
  font-weight: 600;
  color: var(--gray-900);
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.2;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.page-subtitle {
  color: var(--gray-500);
  font-size: 0.9375rem;
  margin-top: 0.375rem;
  margin-left: 0;
}

/* 算法流程 */
.algorithm-flow {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: max-content;
  animation: slideInRight 0.5s ease-out backwards;
}

.flow-step:nth-child(1) { animation-delay: 0.05s; }
.flow-step:nth-child(2) { animation-delay: 0.15s; }
.flow-step:nth-child(3) { animation-delay: 0.25s; }
.flow-step:nth-child(4) { animation-delay: 0.35s; }

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.step-info {
  display: flex;
  flex-direction: column;
}

.step-title {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--gray-900);
}

.step-desc {
  font-size: 0.75rem;
  color: var(--gray-500);
  white-space: nowrap;
}

.flow-arrow {
  color: var(--gray-300);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin: 0 0.25rem;
}

/* Section通用 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.25rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
}

.section-subtitle {
  color: var(--gray-500);
  font-size: 0.9rem;
}

/* 用户技能概览 */
.skill-overview-section {
  margin-bottom: 2rem;
}

.btn-edit-profile {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary-600);
  border: 1.5px solid var(--primary-200);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-edit-profile:hover {
  background: var(--primary-50);
  border-color: var(--primary-400);
  color: var(--primary-700);
}

.skill-overview-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  padding: 2rem;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2.5rem;
  align-items: start;
}

.user-profile-side {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: var(--primary-600);
  opacity: 0.2;
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.08); opacity: 0.35; }
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--primary-600);
  color: white;
  font-family: var(--font-display);
  font-size: 1.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.user-basic {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-900);
}

.user-school {
  font-size: 0.875rem;
  color: var(--gray-500);
}

.user-stats {
  display: flex;
  gap: 1.25rem;
  margin-top: 0.75rem;
}

.stat-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary-600);
}

.stat-label {
  font-size: 0.7rem;
  color: var(--gray-400);
  font-weight: 500;
}

.skills-display {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.skill-bar-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.skill-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-700);
}

.skill-level-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-full);
}

.level-1 { background: #FEF2F2; color: #DC2626; }
.level-2 { background: #FFF7ED; color: #EA580C; }
.level-3 { background: #FFFBEB; color: #D97706; }
.level-4 { background: #EFF6FF; color: #2563EB; }
.level-5 { background: #ECFDF5; color: #059669; }

.skill-bar-track {
  height: 8px;
  background: var(--gray-100);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 1.5rem;
}

.filter-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  padding: 1.25rem 1.5rem;
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
  gap: 0.4rem;
  min-width: 155px;
}

.filter-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.filter-select {
  padding: 0.56rem 2.25rem 0.56rem 0.8rem;
  font-size: 0.85rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 0.75rem center;
  appearance: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--gray-700);
  font-weight: 500;
}

.filter-select:hover { border-color: var(--gray-300); }
.filter-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-reset {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.56rem 1rem;
  background: var(--gray-100);
  color: var(--gray-600);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  align-self: flex-end;
}

.btn-reset:hover {
  background: var(--gray-200);
  border-color: var(--gray-300);
  color: var(--gray-800);
}

.filter-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.875rem;
  padding-top: 0.875rem;
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

/* 推荐卡片网格 */
.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.recommendation-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  overflow: hidden;
  transition: all var(--transition-base);
  position: relative;
}

.recommendation-card::before {
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

.recommendation-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: transparent;
}

.recommendation-card:hover::before {
  opacity: 1;
}

.recommendation-card:nth-child(5n+1)::before { background: var(--success-600); }
.recommendation-card:nth-child(5n+2)::before { background: var(--primary-600); }
.recommendation-card:nth-child(5n+3)::before { background: var(--accent-600); }
.recommendation-card:nth-child(5n+4)::before { background: var(--warning-600); }
.recommendation-card:nth-child(5n+5)::before { background: var(--gray-700); }

/* 卡片顶部 */
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  gap: 1rem;
}

.card-avatar-area {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-container {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gray-100), var(--gray-200));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--gray-700);
  border: 3px solid transparent;
  position: relative;
  transition: border-color var(--transition-base);
}

.online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #10B981;
  border-radius: 50%;
  border: 2px solid white;
}

.person-identity {
  display: flex;
  flex-direction: column;
}

.person-name {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--gray-900);
}

.person-school {
  font-size: 0.8125rem;
  color: var(--gray-500);
  margin-top: 0.125rem;
}

/* 圆形匹配度 */
.match-circle-wrapper {
  position: relative;
  width: 78px;
  height: 86px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.match-circle {
  width: 78px;
  height: 78px;
  transform: rotate(0);
}

.circle-bg {
  fill: none;
  stroke: var(--gray-100);
  stroke-width: 7;
}

.circle-progress {
  fill: none;
  stroke-width: 7;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.08));
}

.match-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1;
}

.match-value small {
  font-size: 0.65rem;
  font-weight: 600;
}

.match-label {
  font-size: 0.65rem;
  color: var(--gray-400);
  font-weight: 500;
  margin-top: -2px;
}

/* 技能对比 */
.skill-comparison {
  padding: 0 1.5rem 1rem;
}

.comparison-title {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gray-700);
  margin-bottom: 0.75rem;
}

.comparison-title svg {
  color: var(--primary-500);
}

.skill-bars {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.skill-compare-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.compare-skill-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-600);
  width: 70px;
  flex-shrink: 0;
}

.compare-bars {
  flex: 1;
}

.bar-pair {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bar {
  height: 7px;
  border-radius: var(--radius-full);
  position: relative;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 100%;
}

.bar.mine {
  background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
}

.bar.theirs {
  background: linear-gradient(90deg, #94A3B8, #CBD5E1);
}

.bar-tooltip {
  position: absolute;
  top: -20px;
  left: 0;
  font-size: 0.62rem;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-fast);
  color: var(--gray-600);
  background: var(--gray-900);
  color: white;
  padding: 1px 5px;
  border-radius: 3px;
}

.bar:hover .bar-tooltip {
  opacity: 1;
}

.compare-diff {
  font-size: 0.7rem;
  font-weight: 700;
  width: 32px;
  text-align: right;
  flex-shrink: 0;
}

.compare-diff.positive { color: #10B981; }
.compare-diff.neutral { color: var(--gray-400); }
.compare-diff.negative { color: var(--gray-400); }

/* 优势标签 */
.advantage-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 1.5rem 0.75rem;
}

.adv-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.73rem;
  font-weight: 600;
  border: 1px solid;
  transition: all var(--transition-fast);
}

.adv-tag.expert {
  background: #ECFDF5;
  color: #059669;
  border-color: rgba(5, 150, 105, 0.2);
}

.adv-tag.award {
  background: #FFFBEB;
  color: #D97706;
  border-color: rgba(217, 119, 6, 0.2);
}

.adv-tag.skill {
  background: #EFF6FF;
  color: #2563EB;
  border-color: rgba(37, 78, 216, 0.2);
}

.adv-tag.method {
  background: #F5F3FF;
  color: #7C3AED;
  border-color: var(--gray-300);
}

.adv-tag.trait {
  background: #FEF2F2;
  color: #DC2626;
  border-color: rgba(220, 38, 38, 0.2);
}

.adv-tag:hover {
  transform: scale(1.05);
}

/* 卡片元信息 */
.card-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1.5rem 0.875rem;
  flex-wrap: wrap;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  color: var(--gray-500);
  font-weight: 500;
}

.meta-item svg {
  color: var(--gray-400);
}

/* 操作按钮 */
.card-actions {
  display: flex;
  gap: 0.625rem;
  padding: 0.875rem 1.5rem 1.25rem;
  border-top: 1px solid var(--gray-100);
}

.btn-invite {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  background: var(--primary-600);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-invite:hover:not(:disabled) {
  transform: scale(1.03);
  box-shadow: 0 4px 14px rgba(196, 30, 58, 0.35);
}

.btn-invite:disabled {
  background: var(--gray-200);
  color: var(--gray-500);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-detail {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  background: var(--gray-50);
  color: var(--gray-700);
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-detail:hover {
  background: var(--gray-100);
  border-color: var(--gray-300);
  color: var(--gray-900);
}

/* 展开详情 */
.expand-detail {
  overflow: hidden;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 400px;
}

.expand-detail {
  padding: 0 1.5rem 1.25rem;
  border-top: 1px solid var(--gray-100);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 1rem;
}

.detail-block.full-width {
  grid-column: 1 / -1;
}

.detail-heading {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 0.5rem;
}

.detail-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.detail-list li {
  font-size: 0.8rem;
  color: var(--gray-600);
  padding-left: 1rem;
  position: relative;
}

.detail-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--primary-400);
}

.detail-text {
  font-size: 0.8rem;
  color: var(--gray-600);
  line-height: 1.6;
}

.reason-text {
  font-size: 0.83rem;
  color: var(--gray-700);
  line-height: 1.65;
  background: var(--gray-100);
  padding: 0.875rem 1rem;
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--primary-500);
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
  font-size: 3.5rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

.empty-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.empty-desc {
  color: var(--gray-500);
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
}

.btn-reset-empty {
  padding: 0.7rem 1.5rem;
  background: var(--primary-600);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-reset-empty:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(196, 30, 58, 0.3);
}

/* 算法说明区域 */
.algorithm-explain-section {
  margin-bottom: 2rem;
}

.explain-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  padding: 2rem;
}

.explain-header {
  margin-bottom: 1.75rem;
  text-align: center;
}

.explain-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.375rem;
}

.explain-subtitle {
  color: var(--gray-500);
  font-size: 0.92rem;
}

.algorithm-factors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.factor-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-100);
  transition: all var(--transition-base);
}

.factor-card:hover {
  background: white;
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.factor-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
}

.factor-icon {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.08));
}

.factor-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.factor-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--gray-900);
}

.factor-desc {
  font-size: 0.78rem;
  color: var(--gray-500);
  line-height: 1.5;
}

.factor-weight {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.375rem;
}

.weight-label {
  font-size: 0.68rem;
  color: var(--gray-400);
  font-weight: 500;
  white-space: nowrap;
}

.weight-bar-track {
  flex: 1;
  height: 6px;
  background: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.weight-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.weight-value {
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 28px;
  text-align: right;
}

.formula-box {
  background: linear-gradient(135deg, #F8FAFC, #F1F5F9);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
  text-align: center;
}

.formula-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.625rem;
}

.formula-content code {
  display: block;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.88rem;
  color: var(--gray-800);
  background: white;
  padding: 0.875rem 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--gray-200);
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 1100px) {
  .recommendations-grid {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  }
}

@media (max-width: 900px) {
  .recommendations-grid {
    grid-template-columns: 1fr;
  }

  .skill-overview-card {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .user-profile-side {
    justify-content: center;
  }

  .algorithm-factors {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    margin-left: 0;
    font-size: 0.9rem;
  }

  .algorithm-flow {
    flex-direction: column;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .filter-row {
    flex-direction: column;
  }

  .filter-group,
  .search-group {
    width: 100%;
    min-width: auto;
  }

  .card-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .match-circle-wrapper {
    align-self: flex-end;
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
  }

  .algorithm-factors {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.25rem;
  }

  .filter-card {
    padding: 1rem;
  }

  .recommendation-card {
    border-radius: var(--radius-lg);
  }

  .card-actions {
    flex-direction: column;
  }

  .explain-card {
    padding: 1.25rem;
  }
}
</style>
