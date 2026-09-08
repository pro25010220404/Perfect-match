<template>
  <div class="create-team-page animate-fade-in">
    <div class="page-container">
      <!-- 返回链接 -->
      <router-link to="/teams" class="back-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        返回团队列表
      </router-link>

      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">创建新团队</h1>
        <p class="page-subtitle">填写以下信息，开始组建你的竞赛团队</p>
      </div>

      <!-- 进度指示器 -->
      <div class="progress-stepper">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="step-item"
          :class="{ active: currentStep === index, completed: currentStep > index }"
        >
          <div class="step-circle">
            <svg v-if="currentStep > index" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="step-label">{{ step }}</span>
          <div v-if="index < steps.length - 1" class="step-connector" :class="{ active: currentStep > index }"></div>
        </div>
      </div>

      <!-- 表单卡片 -->
      <div class="form-card">
        <!-- 步骤1: 基本信息 -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentStep === 0" key="step1" class="step-content">
            <div class="step-header">
              <div class="step-icon basic">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <h2 class="step-title">基本信息</h2>
                <p class="step-desc">设置团队的基本属性和目标</p>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group full-width">
                <label class="form-label required">团队名称</label>
                <input
                  v-model="form.teamName"
                  type="text"
                  class="form-input"
                  :class="{ error: errors.teamName }"
                  placeholder="请输入团队名称（2-50字符）"
                  maxlength="50"
                  @blur="validateField('teamName')"
                />
                <p v-if="errors.teamName" class="form-error">{{ errors.teamName }}</p>
                <p v-else class="form-hint">建议使用简洁有特色的名称，如"无人车战队"</p>
              </div>

              <div class="form-group full-width">
                <label class="form-label required">详细描述</label>
                <textarea
                  v-model="form.description"
                  class="form-textarea large"
                  :class="{ error: errors.description }"
                  placeholder="详细描述团队背景、竞赛计划、分工安排、时间规划等...&#10;&#10;例如：&#10;- 团队背景与经验&#10;- 竞赛具体目标&#10;- 预期工作内容&#10;- 时间安排与里程碑"
                  rows="6"
                  maxlength="1000"
                  @blur="validateField('description')"
                ></textarea>
                <div class="char-count">{{ form.description.length }}/1000</div>
                <p v-if="errors.description" class="form-error">{{ errors.description }}</p>
              </div>

              <div class="form-group full-width">
                <label class="form-label">期望技能标签</label>
                <div class="skills-input-wrapper">
                  <input
                    v-model="skillInput"
                    type="text"
                    class="form-input"
                    placeholder="输入技能后按回车添加"
                    @keyup.enter="addSkill"
                  />
                  <button type="button" class="btn-add-skill" @click="addSkill">添加</button>
                </div>
                <div v-if="form.skills.length > 0" class="skills-tags">
                  <span v-for="(skill, index) in form.skills" :key="index" class="skill-tag">
                    {{ skill }}
                    <button type="button" class="remove-tag" @click="removeSkill(index)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </span>
                </div>
                <p class="form-hint">添加后可帮助系统更精准地匹配队友</p>
              </div>

              <div class="form-group">
                <label class="form-label required">竞赛类型</label>
                <select
                  v-model="form.competitionType"
                  class="form-select"
                  :class="{ error: errors.competitionType }"
                  @blur="validateField('competitionType')"
                >
                  <option value="">选择竞赛类型</option>
                  <option value="algorithm">算法/编程竞赛</option>
                  <option value="ai">人工智能/机器学习</option>
                  <option value="math">数学建模</option>
                  <option value="hardware">硬件/嵌入式</option>
                  <option value="design">设计/创意类</option>
                  <option value="business">商业/创业类</option>
                  <option value="other">其他</option>
                </select>
                <p v-if="errors.competitionType" class="form-error">{{ errors.competitionType }}</p>
              </div>

              <div class="form-group">
                <label class="form-label required">最大人数</label>
                <div class="member-selector">
                  <button
                    v-for="n in 10"
                    :key="n"
                    type="button"
                    class="member-btn"
                    :class="{ active: form.maxMembers === n }"
                    @click="form.maxMembers = n"
                  >
                    {{ n }}
                  </button>
                </div>
                <p v-if="errors.maxMembers" class="form-error">{{ errors.maxMembers }}</p>
              </div>

              <div class="form-group full-width">
                <label class="form-label required">目标描述</label>
                <textarea
                  v-model="form.goalDescription"
                  class="form-textarea"
                  :class="{ error: errors.goalDescription }"
                  placeholder="简要描述团队的竞赛目标和期望成果..."
                  rows="3"
                  maxlength="200"
                  @blur="validateField('goalDescription')"
                ></textarea>
                <div class="char-count">{{ form.goalDescription.length }}/200</div>
                <p v-if="errors.goalDescription" class="form-error">{{ errors.goalDescription }}</p>
              </div>

              <div class="form-group">
                <label class="form-label required">招募截止日期</label>
                <input
                  v-model="form.deadline"
                  type="datetime-local"
                  class="form-input"
                  :class="{ error: errors.deadline }"
                  @blur="validateField('deadline')"
                />
                <p v-if="errors.deadline" class="form-error">{{ errors.deadline }}</p>
                <p v-else class="form-hint">设置后将自动停止招募</p>
              </div>
            </div>
          </div>

          <!-- 步骤2: 角色需求 -->
          <div v-else-if="currentStep === 1" key="step2" class="step-content">
            <div class="step-header">
              <div class="step-icon roles">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <h2 class="step-title">角色需求配置</h2>
                <p class="step-desc">定义需要招募的角色和人数</p>
              </div>
            </div>

            <div class="roles-section">
              <div v-for="(role, index) in form.roles" :key="role.id" class="role-card">
                <div class="role-card-header">
                  <div class="role-number">
                    <span>角色 {{ index + 1 }}</span>
                  </div>
                  <button
                    v-if="form.roles.length > 1"
                    type="button"
                    class="btn-remove-role"
                    @click="removeRole(index)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    删除此角色
                  </button>
                </div>

                <div class="role-form-grid">
                  <div class="form-group">
                    <label class="form-label required">角色名称</label>
                    <input
                      v-model="role.name"
                      type="text"
                      class="form-input"
                      :class="{ error: role.errors?.name }"
                      placeholder="如：算法工程师、前端开发"
                      @blur="validateRole(index, 'name')"
                    />
                    <p v-if="role.errors?.name" class="form-error">{{ role.errors.name }}</p>
                  </div>

                  <div class="form-group">
                    <label class="form-label">所需技能</label>
                    <select v-model="role.skill" class="form-select">
                      <option value="">选择技能（可选）</option>
                      <option>Python</option>
                      <option>Java</option>
                      <option>C/C++</option>
                      <option>JavaScript/TypeScript</option>
                      <option>前端开发</option>
                      <option>算法设计</option>
                      <option>数据分析</option>
                      <option>UI/UX设计</option>
                      <option>嵌入式开发</option>
                      <option>机械设计</option>
                      <option>论文写作</option>
                      <option>项目管理</option>
                    </select>
                  </div>

                  <div class="form-group full-width">
                    <label class="form-label required">需求人数</label>
                    <div class="count-selector">
                      <button
                        v-for="n in 5"
                        :key="n"
                        type="button"
                        class="count-btn"
                        :class="{ active: role.count === n }"
                        @click="role.count = n"
                      >
                        {{ n }}
                      </button>
                    </div>
                    <p v-if="role.errors?.count" class="form-error">{{ role.errors.count }}</p>
                  </div>

                  <div class="form-group full-width">
                    <label class="form-label">角色说明</label>
                    <textarea
                      v-model="role.description"
                      class="form-textarea small"
                      placeholder="简要说明该角色的职责和要求..."
                      rows="2"
                      maxlength="200"
                    ></textarea>
                  </div>
                </div>
              </div>

              <button type="button" class="btn-add-role" @click="addRole">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                添加更多角色
              </button>
            </div>
          </div>

          <!-- 步骤3: 完成 -->
          <div v-else key="step3" class="step-content">
            <div class="completion-content">
              <div class="success-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2 class="success-title">信息填写完成！</h2>
              <p class="success-desc">请确认以下团队信息无误后提交创建</p>

              <div class="summary-card">
                <div class="summary-section">
                  <h3 class="summary-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    基本信息
                  </h3>
                  <div class="summary-grid">
                    <div class="summary-item">
                      <span class="summary-label">团队名称</span>
                      <span class="summary-value">{{ form.teamName || '-' }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="summary-label">竞赛类型</span>
                      <span class="summary-value">{{ competitionTypeLabel || '-' }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="summary-label">最大人数</span>
                      <span class="summary-value">{{ form.maxMembers || '-' }} 人</span>
                    </div>
                    <div class="summary-item">
                      <span class="summary-label">截止日期</span>
                      <span class="summary-value">{{ formatDeadline(form.deadline) || '-' }}</span>
                    </div>
                  </div>
                  <div class="summary-goal">
                    <span class="summary-label">目标描述</span>
                    <p class="summary-text">{{ form.goalDescription || '未填写' }}</p>
                  </div>
                  <div class="summary-goal">
                    <span class="summary-label">详细描述</span>
                    <p class="summary-text">{{ form.description || '未填写' }}</p>
                  </div>
                  <div v-if="form.skills.length > 0" class="summary-skills">
                    <span class="summary-label">期望技能</span>
                    <div class="skills-tags">
                      <span v-for="skill in form.skills" :key="skill" class="skill-tag static">{{ skill }}</span>
                    </div>
                  </div>
                </div>

                <div class="summary-divider"></div>

                <div class="summary-section">
                  <h3 class="summary-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    角色需求 ({{ form.roles.length }} 个)
                  </h3>
                  <div class="roles-summary-list">
                    <div v-for="(role, index) in form.roles" :key="role.id" class="role-summary-item">
                      <div class="role-summary-info">
                        <span class="role-summary-name">{{ role.name || `角色 ${index + 1}` }}</span>
                        <span v-if="role.skill" class="role-summary-skill">{{ role.skill }}</span>
                      </div>
                      <span class="role-summary-count">×{{ role.count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- 底部操作按钮 -->
        <div class="form-actions">
          <button
            v-if="currentStep > 0 && currentStep < steps.length - 1"
            type="button"
            class="btn btn-secondary"
            @click="prevStep"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            上一步
          </button>
          <button
            v-if="currentStep === steps.length - 1"
            type="button"
            class="btn btn-secondary"
            @click="$router.push('/teams')"
          >
            返回修改
          </button>

          <div class="actions-right">
            <button
              v-if="currentStep < steps.length - 1"
              type="button"
              class="btn btn-primary"
              @click="nextStep"
            >
              下一步
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <button
              v-if="currentStep === steps.length - 1"
              type="button"
              class="btn btn-primary btn-submit"
              :disabled="isSubmitting"
              @click="submitForm"
            >
              <svg v-if="isSubmitting" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
              </svg>
              <span v-else>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                创建团队
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { toast } = useToast()

const steps = ['基本信息', '角色需求', '确认完成']
const currentStep = ref(0)
const isSubmitting = ref(false)
const skillInput = ref('')

const form = reactive({
  teamName: '',
  competitionType: '',
  maxMembers: null,
  goalDescription: '',
  deadline: '',
  description: '',
  skills: [],
  roles: [
    { id: 1, name: '', skill: '', count: 2, description: '', errors: {} },
    { id: 2, name: '', skill: '', count: 1, description: '', errors: {} }
  ]
})

const errors = reactive({
  teamName: '',
  competitionType: '',
  maxMembers: '',
  goalDescription: '',
  deadline: '',
  description: ''
})

const competitionTypeMap = {
  algorithm: '算法/编程竞赛',
  ai: '人工智能/机器学习',
  math: '数学建模',
  hardware: '硬件/嵌入式',
  design: '设计/创意类',
  business: '商业/创业类',
  other: '其他'
}

const competitionTypeLabel = computed(() => competitionTypeMap[form.competitionType] || '')

let roleIdCounter = 3

const validateField = (field) => {
  switch (field) {
    case 'teamName':
      if (!form.teamName.trim()) {
        errors.teamName = '请输入团队名称'
      } else if (form.teamName.trim().length < 2) {
        errors.teamName = '团队名称至少需要2个字符'
      } else if (form.teamName.trim().length > 50) {
        errors.teamName = '团队名称不能超过50个字符'
      } else {
        errors.teamName = ''
      }
      break
    case 'competitionType':
      if (!form.competitionType) {
        errors.competitionType = '请选择竞赛类型'
      } else {
        errors.competitionType = ''
      }
      break
    case 'maxMembers':
      if (!form.maxMembers) {
        errors.maxMembers = '请选择最大人数'
      } else {
        errors.maxMembers = ''
      }
      break
    case 'goalDescription':
      if (!form.goalDescription.trim()) {
        errors.goalDescription = '请输入目标描述'
      } else if (form.goalDescription.trim().length < 10) {
        errors.goalDescription = '目标描述至少需要10个字符'
      } else {
        errors.goalDescription = ''
      }
      break
    case 'deadline':
      if (!form.deadline) {
        errors.deadline = '请选择招募截止日期'
      } else if (new Date(form.deadline) <= new Date()) {
        errors.deadline = '截止日期必须晚于当前时间'
      } else {
        errors.deadline = ''
      }
      break
    case 'description':
      if (!form.description.trim()) {
        errors.description = '请输入详细描述'
      } else if (form.description.trim().length < 20) {
        errors.description = '详细描述至少需要20个字符'
      } else {
        errors.description = ''
      }
      break
  }
}

const validateRole = (index, field) => {
  const role = form.roles[index]
  if (!role.errors) role.errors = {}
  
  if (field === 'name') {
    if (!role.name.trim()) {
      role.errors.name = '请输入角色名称'
    } else {
      role.errors.name = ''
    }
  }
}

const validateCurrentStep = () => {
  let isValid = true
  
  if (currentStep.value === 0) {
    validateField('teamName')
    validateField('competitionType')
    validateField('maxMembers')
    validateField('goalDescription')
    validateField('deadline')
    validateField('description')

    isValid = !errors.teamName && !errors.competitionType &&
              !errors.maxMembers && !errors.goalDescription && !errors.deadline &&
              !errors.description
  } else if (currentStep.value === 1) {
    form.roles.forEach((role, index) => {
      validateRole(index, 'name')
      if (role.errors?.name) isValid = false
    })

    const hasValidRole = form.roles.some(r => r.name.trim())
    if (!hasValidRole) {
      isValid = false
    }
  }
  
  return isValid
}

const nextStep = () => {
  if (validateCurrentStep()) {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const addSkill = () => {
  const skill = skillInput.value.trim()
  if (skill && !form.skills.includes(skill)) {
    form.skills.push(skill)
    skillInput.value = ''
  }
}

const removeSkill = (index) => {
  form.skills.splice(index, 1)
}

const addRole = () => {
  form.roles.push({
    id: roleIdCounter++,
    name: '',
    skill: '',
    count: 1,
    description: '',
    errors: {}
  })
}

const removeRole = (index) => {
  if (form.roles.length > 1) {
    form.roles.splice(index, 1)
  }
}

const formatDeadline = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const submitForm = async () => {
  isSubmitting.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast('团队创建成功', 'success')
    router.push('/teams')
  } catch (error) {
    toast('创建失败，请重试', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.create-team-page {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.page-container {
  padding-top: 1rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-500);
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all var(--transition-fast);
  margin-bottom: 2rem;
}

.back-link:hover {
  color: var(--nav-blue-dark);
  gap: 0.75rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  color: var(--gray-900);
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--gray-500);
  font-size: 1.0625rem;
}

/* 进度指示器 */
.progress-stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 2.5rem;
  padding: 1rem 0 2.75rem;
}

.step-item {
  display: flex;
  align-items: center;
  position: relative;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gray-100);
  border: 2px solid var(--gray-300);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--gray-500);
  transition: all var(--transition-base);
  z-index: 1;
}

.step-item.active .step-circle {
  background: var(--nav-blue-deep);
  border-color: transparent;
  color: white;
  transform: scale(1.1);
}

.step-item.completed .step-circle {
  background: linear-gradient(135deg, var(--success-500), #059669);
  border-color: transparent;
  color: white;
}

.step-label {
  position: absolute;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--gray-400);
  transition: all var(--transition-fast);
}

.step-item.active .step-label,
.step-item.completed .step-label {
  color: var(--nav-blue-dark);
  font-weight: 600;
}

.step-connector {
  width: 80px;
  height: 3px;
  background: var(--gray-200);
  border-radius: 2px;
  margin: 0 0.5rem;
  transition: all var(--transition-base);
}

.step-connector.active {
  background: linear-gradient(90deg, var(--success-500), var(--nav-blue));
}

/* 表单卡片 */
.form-card {
  background: transparent;
  border: none;
  overflow: visible;
}

/* 步骤内容 */
.step-content {
  padding: 2rem 0 2.5rem;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--line-strong);
}

.step-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.step-icon.basic { background: linear-gradient(135deg, #5EB3E4, #3D9FD4); }
.step-icon.roles { background: linear-gradient(135deg, #F59E0B, #D97706); }

.step-title {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
}

.step-desc {
  color: var(--gray-500);
  font-size: 0.9375rem;
}

/* 表单网格 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 0.5rem;
}

.form-label.required::after {
  content: ' *';
  color: var(--danger-500);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: var(--white);
  color: var(--gray-800);
  transition: all var(--transition-fast);
  outline: none;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--nav-blue);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: var(--danger-500);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--gray-400);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
  cursor: pointer;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

.form-textarea.large {
  min-height: 160px;
}

.form-textarea.small {
  min-height: 60px;
}

.char-count {
  text-align: right;
  font-size: 0.75rem;
  color: var(--gray-400);
  margin-top: 0.375rem;
}

.form-error {
  font-size: 0.8125rem;
  color: var(--danger-500);
  margin-top: 0.375rem;
  animation: fadeIn 0.2s ease-out;
}

.form-hint {
  font-size: 0.8125rem;
  color: var(--gray-400);
  margin-top: 0.375rem;
}

/* 成员选择器 */
.member-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.member-btn {
  width: 44px;
  height: 44px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: white;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--gray-600);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.member-btn:hover {
  border-color: var(--nav-blue);
  color: var(--nav-blue-dark);
  transform: translateY(-2px);
}

.member-btn.active {
  background: var(--nav-blue-deep);
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
}

/* 技能输入 */
.skills-input-wrapper {
  display: flex;
  gap: 0.75rem;
}

.skills-input-wrapper .form-input {
  flex: 1;
}

.btn-add-skill {
  padding: 0.75rem 1.25rem;
  background: var(--gray-50);
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-md);
  color: var(--gray-600);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-add-skill:hover {
  border-color: var(--nav-blue);
  color: var(--nav-blue-dark);
  background: var(--nav-blue-50);
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: var(--nav-blue-50);
  border: 1px solid var(--nav-blue-100);
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--nav-blue-dark);
}

.skill-tag.static {
  cursor: default;
}

.remove-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 0;
  transition: color var(--transition-fast);
}

.remove-tag:hover {
  color: var(--danger-500);
}

/* 角色卡片 */
.roles-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.role-card {
  background: var(--gray-50);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: all var(--transition-base);
}

.role-card:hover {
  border-color: var(--nav-blue-100);
  box-shadow: var(--shadow-sm);
}

.role-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
}

.role-number {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 1rem;
  background: var(--nav-blue-deep);
  color: white;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 700;
}

.btn-remove-role {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: none;
  border: none;
  color: var(--danger-500);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.btn-remove-role:hover {
  background: var(--danger-50);
}

.role-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.role-form-grid .full-width {
  grid-column: 1 / -1;
}

.count-selector {
  display: flex;
  gap: 0.5rem;
}

.count-btn {
  width: 48px;
  height: 42px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: white;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--gray-600);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.count-btn:hover {
  border-color: var(--nav-blue);
  color: var(--nav-blue-dark);
}

.count-btn.active {
  background: var(--nav-blue-deep);
  border-color: transparent;
  color: white;
}

.btn-add-role {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: white;
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-lg);
  color: var(--gray-500);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-add-role:hover {
  border-color: var(--nav-blue);
  color: var(--nav-blue-dark);
  background: var(--nav-blue-50);
  transform: translateY(-2px);
}

/* 完成页面 */
.completion-content {
  text-align: center;
  padding: 1rem 0;
}

.success-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ECFDF5, #D1FAE5);
  border-radius: 50%;
  color: var(--success-600);
  animation: scaleIn 0.5s ease-out;
}

.success-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.success-desc {
  color: var(--gray-500);
  font-size: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: 2rem;
  text-align: left;
}

.summary-section {
  margin-bottom: 1.5rem;
}

.summary-section:last-child {
  margin-bottom: 0;
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--gray-200);
}

.summary-title svg {
  color: var(--nav-blue);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.875rem;
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--gray-800);
}

.summary-goal {
  margin-top: 0.875rem;
}

.summary-text {
  font-size: 0.9375rem;
  color: var(--gray-600);
  line-height: 1.6;
  margin-top: 0.375rem;
}

.summary-skills {
  margin-top: 0.875rem;
}

.summary-divider {
  height: 1px;
  background: var(--gray-200);
  margin: 1.5rem 0;
}

.roles-summary-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.role-summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
}

.role-summary-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.role-summary-name {
  font-weight: 600;
  color: var(--gray-800);
}

.role-summary-skill {
  padding: 0.125rem 0.5rem;
  background: var(--nav-blue-50);
  color: var(--nav-blue-dark);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
}

.role-summary-count {
  font-weight: 700;
  color: var(--nav-blue-dark);
  font-size: 1rem;
}

/* 底部操作按钮 */
.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0;
  background: transparent;
  border-top: 1px solid var(--line);
}

.actions-right {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.btn-secondary {
  background: white;
  color: var(--gray-700);
  border: 2px solid var(--gray-300);
}

.btn-secondary:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
  color: var(--gray-900);
}

.btn-primary {
  background: var(--nav-blue-deep);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--nav-blue-deeper);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-submit {
  padding: 0.75rem 2rem;
  font-size: 1rem;
}

/* 动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.spin {
  animation: spin 1s linear infinite;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .create-team-page {
    padding-bottom: 2rem;
  }

  .page-container {
    padding-top: 0.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .progress-stepper {
    padding: 1rem 1rem 2.5rem;
  }

  .step-connector {
    width: 40px;
  }

  .step-label {
    font-size: 0.6875rem;
  }

  .step-circle {
    width: 36px;
    height: 36px;
    font-size: 0.8125rem;
  }

  .step-content {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .role-form-grid {
    grid-template-columns: 1fr;
  }

  .role-form-grid .full-width {
    grid-column: 1;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .actions-right {
    width: 100%;
  }

  .actions-right .btn {
    flex: 1;
  }

  .member-selector {
    gap: 0.375rem;
  }

  .member-btn {
    width: 38px;
    height: 38px;
    font-size: 0.875rem;
  }

  .count-btn {
    width: 42px;
    height: 38px;
  }

  .skills-input-wrapper {
    flex-direction: column;
  }

  .btn-add-skill {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .step-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .step-icon {
    width: 48px;
    height: 48px;
  }

  .step-title {
    font-size: 1.125rem;
  }

  .summary-card {
    padding: 1.25rem;
  }

  .role-card {
    padding: 1rem;
  }
}
</style>
