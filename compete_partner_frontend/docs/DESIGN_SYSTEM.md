# 赛搭 · 设计风格文档

> 本文档根据当前 **登录页**（`LoginView` + 开屏 `SplashScreen`）与 **应用页眉**（`MainLayout`）的实现整理，供设计与开发统一视觉语言。  
> 最后更新：2026-05

---

## 1. 产品气质

| 场景 | 气质关键词 | 参考来源 |
|------|------------|----------|
| **开屏** | 电影感、克制、品牌露出 | 深色全屏 + SaiDa 动效 |
| **登录/注册** | 编辑感、留白、内容即装饰 | Digital Library 式白底登录 |
| **登录后应用** | 清爽、可信、工具型 | 浅蓝导航 + 白底内容区 |

整体方向：**大面积留白 + 高对比文字 + 少量强调色（橙 / 浅蓝 / 彩色卡片）**，避免厚重渐变与过多装饰。

---

## 2. 色彩系统

### 2.1 应用页眉（主导航）

用于 `MainLayout.vue`，定义应用内「日常浏览」的主色。

| Token | 色值 | 用途 |
|-------|------|------|
| `--nav-blue` | `#5EB3E4` | Logo、导航链接、用户图标 |
| `--nav-blue-dark` | `#3D9FD4` | Hover、当前页强调 |
| `--nav-blue-soft` | `#7EC5EF` | 搜索框聚焦描边 / 光晕 |
| 背景 | `#FFFFFF` | 页眉、页脚背景 |
| 分割线 | `#F0F0F0` | 页眉底边、页脚顶边 |
| 搜索框边框 | `#E8E8E8` | 默认描边 |
| 搜索占位符 | `#C4C4C4` | Placeholder |
| 搜索图标 | `#B8B8B8` → Hover `#5EB3E4` | 放大镜按钮 |

### 2.2 认证区（登录 / 注册）

用于 `auth-theme.css` + `LoginView.vue`。

| Token | 色值 | 用途 |
|-------|------|------|
| `--auth-page-bg` | `#FFFFFF` | 登录页背景 |
| `--auth-text` | `#0A0A0A` | 标题、主文案 |
| `--auth-text-muted` | `#6B7280` | 副标题、标签、页脚链接 |
| `--auth-border` | `#E5E7EB` | 输入框边框 |
| `--auth-btn-primary` | `#0A0A0A` | 主按钮（登录/注册） |
| `--auth-btn-primary-hover` | `#262626` | 主按钮 Hover |
| `--auth-accent-orange` | `#F97316` | 标题内书本图标 |
| 输入背景 | `#FAFAFA` | 表单输入（登录页覆盖） |

### 2.3 开屏（Splash）

| 用途 | 色值 |
|------|------|
| 全屏背景 / 幕布 | `#0A0A0A` |
| 品牌字 | `#FAFAFA` |
| 副标「赛搭 · 竞赛组队」 | `rgba(255,255,255,0.38)` |
| 字下光晕 | `rgba(255,255,255,0.07)` 径向渐变 |

### 2.4 登录页底部装饰卡片

扇形叠卡，仅作视觉装饰，不参与信息架构。

| 卡片 | 背景 | 文字/图形 |
|------|------|-----------|
| 黑 | `#0A0A0A` | — |
| 灰 | `#E7E5E4` | `#1C1917` |
| 黄 | `#FACC15` | `#0A0A0A` |
| 白 | `#FFFFFF` + 边 `#E5E5E5` | `#0A0A0A` |
| 粉 | `#EC4899` | 白色波纹 |
| 绿 | `#22C55E` | 白色高光条 |

### 2.5 全局设计系统（内页遗留）

`src/styles/global.css` 仍保留 **蓝紫渐变体系**（`--primary-*`、`--accent-*`），用于首页、团队广场等旧版内页组件。  
与页眉浅蓝 **尚未完全统一**；新页面建议优先使用页眉蓝或认证区黑白，逐步替换内页渐变卡片。

---

## 3. 字体

| 角色 | 字体栈 | 使用场景 |
|------|--------|----------|
| **展示** `--font-display` | Space Grotesk, system-ui | Logo、登录主标题、开屏 SaiDa |
| **正文** `--font-body` | Plus Jakarta Sans, Segoe UI | 导航、表单、说明文案 |

### 字号阶梯（实现值）

| 元素 | 大小 | 字重 |
|------|------|------|
| 开屏 SaiDa | `clamp(3.25rem, 12vw, 7rem)` | 600 / 大写 700 |
| 登录主标题 | `clamp(1.75rem, 5vw, 2.75rem)` | 700 |
| 登录副标题 | `0.9375rem` | 400 |
| 页眉 Logo | `1.5rem` | 700 |
| 导航链接 | `1rem`（移动端 `0.9375rem`） | 500 / 当前 600 |
| 搜索框 | `0.875rem` | 400 |
| Powered by 标签 | `0.6875rem` | 400 |

### 字距习惯

- 登录标题：`letter-spacing: -0.04em`（紧凑编辑风）
- 开屏副标：`letter-spacing: 0.35em`（全大写间距）
- 页眉 Logo：`letter-spacing: 0.02em`

---

## 4. 布局与间距

### 4.1 全局容器

```text
.container → max-width: 1280px; padding: 0 1.5rem（移动端 1rem）
```

### 4.2 页眉

```text
高度：72px（移动端 60px）
结构：Logo | 导航（flex:1 居中） | 搜索(220px) + 用户图标
间距：gap 2.5rem；导航项 gap 2.25rem
```

### 4.3 登录页

```text
垂直结构：
  顶部品牌区（2×2 方块 Logo + Powered by）
  → 主内容区（标题 + 副标题 + 表单，max-width 640px）
  → 底部卡片扇形（高度 clamp(280px, 40vh, 380px)）

表单宽度：max-width 360px，居中
```

### 4.4 圆角

| 场景 | 半径 |
|------|------|
| 胶囊按钮 / 搜索框 | `9999px`（`--radius-full`） |
| 登录输入框 | `10px` |
| 装饰卡片 | `8px` |
| 方块 Logo 单元格 | `2px` |

---

## 5. 组件规范

### 5.1 页眉（Navbar）

**文件：** `src/layouts/MainLayout.vue`

| 部件 | 规范 |
|------|------|
| Logo | 文字「赛搭」，浅蓝，链至 `/` |
| 导航 | 首页 / 详情 / 社区 / 指南 / 个人中心；当前项加深 + `font-weight: 600` |
| 搜索 | 圆角输入框，右侧图标按钮；提交跳转 `/teams?q=` |
| 用户 | 线框人像图标，点击进 `/profile` |

**响应式：** `<768px` 隐藏导航，保留 Logo + 搜索 + 用户。

### 5.2 开屏（Splash）

**文件：** `src/components/splash/SplashScreen.vue`、`SaiDaMonogram.vue`

**流程：**

1. **falling** — 黑底，居中 `SaiDa` 逐字下落弹跳（约 1.7s）
2. **settled** — 停稳约 0.75s
3. **opening** — 品牌区淡出，上下黑幕移开（1s，`cubic-bezier(0.76, 0, 0.24, 1)`）
4. **done** — 露出登录页

**交互：** 点击可跳过落下或提前拉开。

### 5.3 登录表单

**文件：** `src/components/auth/*` + `LoginView.vue`

| 组件 | 样式要点 |
|------|----------|
| `AuthFormField` | 上标签 + 圆角输入；登录页内居中、浅灰底 |
| `AuthPrimaryButton` | 黑底白字胶囊；最小宽度 160px |
| `AuthFooterLink` | 灰色前缀 + 黑色下划线链接（登录 ↔ 注册） |

**路由：** `/login`、`/signup` → `?tab=register`

### 5.4 登录页品牌区

- **方块 Logo：** 2×2 网格，色块 `#0A0A0A` / `#525252` / `#D4D4D4`
- **主标题：** 两行；第二行含橙色书本 SVG（`#F97316`）
- **装饰卡片：** 可 Hover 上浮 `translateY(-28px)` + `scale(1.06)`，扇形旋转叠放

---

## 6. 动效

| 场景 | 时长 | 缓动 |
|------|------|------|
| 开屏落字 | 0.95s / 字，错峰 0.09s | `cubic-bezier(0.34, 1.25, 0.64, 1)` |
| 开屏拉开 | 1s | `cubic-bezier(0.76, 0, 0.24, 1)` |
| 登录页露出 | 0.5s opacity | ease，延迟 0.35s |
| 导航 Hover | 0.15s | ease |
| 卡片 Hover | 0.4s transform | `cubic-bezier(0.34, 1.4, 0.64, 1)` |
| 全局过渡 token | 150–300ms | `cubic-bezier(0.4, 0, 0.2, 1)` |

**无障碍：** 开屏与落字在 `prefers-reduced-motion: reduce` 下应关闭动画（已实现）。

---

## 7. 图标与插图

- **风格：** 1.75–2px 线框 SVG，`stroke="currentColor"`，与文字同色
- **登录标题：** 内联橙色书本（28×36），圆角矩形 + 书脊线
- **页眉：** 搜索放大镜、用户轮廓（圆形头 + 肩线）

---

## 8. 文案语气

| 场景 | 语气 |
|------|------|
| 登录标题 | 价值主张 + 人群定位（「一站式…为创客而设」） |
| 登录副标题 | 说明性、克制、一行内说清 |
| 开屏副标 | 极简品牌 + 品类（「赛搭 · 竞赛组队」） |
| 页眉 Powered by | 英文小字弱化（`Powered by 赛搭`） |

---

## 9. 代码映射

| 视觉模块 | 主要文件 |
|----------|----------|
| 全局 Token | `src/styles/global.css` |
| 认证 Token | `src/components/auth/auth-theme.css` |
| 登录页 | `src/views/LoginView.vue` |
| 登录入口（含开屏） | `src/views/LoginEntryView.vue` |
| 开屏 | `src/components/splash/` |
| 页眉 / 页脚 | `src/layouts/MainLayout.vue` |

---

## 10. 统一建议（后续迭代）

1. **主色收敛：** 将内页的 `--primary-600` 渐变逐步改为 `--nav-blue` 或中性黑，避免「页眉浅蓝 + 内页蓝紫」双轨。
2. **CSS 变量上提：** 把 `--nav-blue*` 写入 `global.css :root`，页眉与按钮共用。
3. **认证与内页：** 登录成功后的首屏可延续白底大标题风格，缩小与 `HomeView` 渐变卡片的反差。
4. **品牌字：** 开屏用 `SaiDa`，页眉/登录用「赛搭」——文档中保留双语标，产品对外需定一个主品牌写法。

---

## 11. 快速参考（复制用）

```css
/* 页眉 */
--nav-blue: #5eb3e4;
--nav-blue-dark: #3d9fd4;

/* 认证 */
--auth-text: #0a0a0a;
--auth-muted: #6b7280;
--auth-accent: #f97316;

/* 开屏 */
--splash-bg: #0a0a0a;
--splash-text: #fafafa;

/* 字体 */
--font-display: 'Space Grotesk', sans-serif;
--font-body: 'Plus Jakarta Sans', sans-serif;
```

---

*本文档随实现变更而更新；修改 `LoginView` 或 `MainLayout` 时请同步修订本节。*
