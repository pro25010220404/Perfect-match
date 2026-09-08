// 团队相关假数据（mock）

// 首页「推荐团队」区块
export const recommendedTeams = [
  {
    id: 1,
    name: '无人车战队',
    emoji: 'car',
    description: '目标：全国大学生智能汽车竞赛一等奖',
    leader: '李明',
    members: 3,
    maxMembers: 6,
    rating: '4.9',
    deadline: '2025-12-31',
    status: 'recruiting',
    statusClass: 'recruiting',
    roles: [
      { name: '算法工程师', urgent: true },
      { name: '嵌入式开发', filled: true },
      { name: '机械设计' }
    ]
  },
  {
    id: 2,
    name: 'AI创新挑战赛',
    emoji: 'bot',
    description: '专注人工智能创新应用开发，探索AI边界',
    leader: '王芳',
    members: 2,
    maxMembers: 5,
    rating: '4.7',
    deadline: '2025-11-15',
    status: 'urgent',
    statusClass: 'urgent',
    roles: [
      { name: 'Python开发', urgent: true },
      { name: '算法设计' },
      { name: '前端开发' }
    ]
  },
  {
    id: 3,
    name: '数学建模竞赛队',
    emoji: 'bar-chart-3',
    description: '参加全国大学生数学建模竞赛，冲刺国奖',
    leader: '孙伟',
    members: 4,
    maxMembers: 4,
    rating: '4.8',
    deadline: '2025-09-30',
    status: 'full',
    statusClass: 'full',
    roles: [
      { name: '编程手', urgent: true },
      { name: '论文写作' },
      { name: '建模' }
    ]
  }
]

// 团队广场「全部团队」数据
export const teams = [
  {
    id: 1,
    name: '无人车战队',
    emoji: 'car',
    description: '目标：全国大学生智能汽车竞赛一等奖，专注于智能驾驶技术研发与算法优化',
    leader: '李明',
    rating: '4.9',
    members: 3,
    maxMembers: 6,
    deadline: '2025-12-31',
    status: 'recruiting',
    statusClass: 'recruiting',
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
    emoji: 'bot',
    description: '专注人工智能创新应用开发，参加中国大学生人工智能创新大赛',
    leader: '王芳',
    rating: '4.7',
    members: 2,
    maxMembers: 5,
    deadline: '2025-11-15',
    status: 'recruiting',
    statusClass: 'recruiting',
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
    emoji: 'cpu',
    description: 'RoboMaster机甲大师赛备赛团队，需要机械、电控、算法多方向人才',
    leader: '赵强',
    rating: '4.8',
    members: 4,
    maxMembers: 8,
    deadline: '2025-12-15',
    status: 'recruiting',
    statusClass: 'recruiting',
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
    emoji: 'bar-chart-3',
    description: '全国大学生数学建模竞赛，寻找建模、编程、写作人才冲刺国奖',
    leader: '孙伟',
    rating: '4.6',
    members: 1,
    maxMembers: 3,
    deadline: '2025-09-01',
    status: 'urgent',
    statusClass: 'urgent',
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
    emoji: 'trending-up',
    description: '参加全国高校大数据挑战赛，需要数据挖掘、可视化方向人才',
    leader: '周静',
    rating: '4.5',
    members: 2,
    maxMembers: 4,
    deadline: '2025-10-20',
    status: 'recruiting',
    statusClass: 'recruiting',
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
    emoji: 'code',
    description: '参加软件设计大赛，打造创新Web应用，寻找前后端全栈人才',
    leader: '吴昊',
    rating: '4.8',
    members: 3,
    maxMembers: 5,
    deadline: '2025-11-30',
    status: 'recruiting',
    statusClass: 'recruiting',
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
    emoji: 'globe',
    description: '聚焦IoT应用开发，参加全国物联网设计竞赛，实现智慧场景解决方案',
    leader: '郑琳',
    rating: '4.4',
    members: 2,
    maxMembers: 4,
    deadline: '2025-11-10',
    status: 'in-progress',
    statusClass: 'in-progress',
    competitionType: 'software',
    roles: [
      { name: '嵌入式开发 1/2' },
      { name: '云平台开发 0/1', urgent: true }
    ]
  },
  {
    id: 8,
    name: '网络安全CTF战队',
    emoji: 'shield',
    description: '备战各大CTF安全竞赛，涵盖逆向、密码学、Web安全等多个方向',
    leader: '陈杰',
    rating: '4.9',
    members: 5,
    maxMembers: 6,
    deadline: '2025-12-25',
    status: 'recruiting',
    statusClass: 'recruiting',
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
    emoji: 'plane',
    description: '参与无人机应用创新大赛，专注飞行控制算法与图像识别技术',
    leader: '黄磊',
    rating: '4.7',
    members: 3,
    maxMembers: 5,
    deadline: '2025-11-05',
    status: 'recruiting',
    statusClass: 'recruiting',
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
    emoji: 'link',
    description: '探索区块链技术应用，参加区块链创新大赛，构建去中心化解决方案',
    leader: '林峰',
    rating: '4.6',
    members: 2,
    maxMembers: 4,
    deadline: '2025-12-10',
    status: 'recruiting',
    statusClass: 'recruiting',
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
    emoji: 'gamepad',
    description: '参加独立游戏开发大赛，打造原创游戏作品，需要美术、程序、策划人才',
    leader: '许婷',
    rating: '4.5',
    members: 3,
    maxMembers: 6,
    deadline: '2025-11-20',
    status: 'recruiting',
    statusClass: 'recruiting',
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
    emoji: 'message-circle',
    description: '专注于NLP技术研究与应用，参加AI自然语言处理相关竞赛',
    leader: '马超',
    rating: '4.8',
    members: 2,
    maxMembers: 4,
    deadline: '2025-12-05',
    status: 'recruiting',
    statusClass: 'recruiting',
    competitionType: 'ai',
    roles: [
      { name: 'NLP算法 1/2' },
      { name: 'Python开发 0/1', urgent: true },
      { name: '数据处理 1/1', filled: true }
    ]
  }
]
