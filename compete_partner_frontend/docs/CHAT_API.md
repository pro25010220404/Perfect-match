# 聊天（消息）后端接口文档（Laravel）

> 面向后端（Laravel + PHP）的实现规格。前端（Vue，本仓库）按此契约对接。
> 目标：支撑「组队前沟通」——申请者与队长/团队在加入前聊清楚事宜。

---

## 1. 背景与目标

用户在看中一个团队后，先和队长私聊了解详情（项目内容、分工、时间），再决定是否加入。聊天场景是**用户 ↔ 团队**（实际由队长代表团队回复）。

---

## 2. 数据模型

### 2.1 表 `conversations`（会话）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | bigint PK | |
| `user_id` | bigint | 申请者（会话发起方），外键 users |
| `team_id` | bigint | 目标团队，外键 teams |
| `last_message_at` | timestamp nullable | 最后一条消息时间（列表排序用） |
| `created_at` / `updated_at` | timestamp | |

- 同一 `(user_id, team_id)` 唯一，避免重复开会话（`unique(['user_id','team_id'])`）。

### 2.2 表 `messages`（消息）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | bigint PK | |
| `conversation_id` | bigint | 外键 conversations |
| `sender_id` | bigint | 发送者 user id（申请者或队长） |
| `content` | text | 消息内容 |
| `created_at` | timestamp | |

### 2.3 未读计数

不单独建表，由前端/后端根据「最后已读消息 id」计算。简化方案：会话表加一个 `last_read_message_id`（当前用户最后读到的消息 id），未读数 = `messages.id > last_read_message_id` 的数量。

> 若时间紧，M1 可以先不做未读，前端用「最后一条消息」展示，未读红点后续再加。

---

## 3. API 接口

约定：字段 `snake_case`；鉴权用 Sanctum（`Authorization: Bearer <token>`）；所有接口需登录。

### 3.1 会话列表

`GET /api/conversations`

响应（按 `last_message_at` 倒序）：

```json
{
  "data": [
    {
      "id": 1,
      "team": { "id": 1, "name": "无人车战队", "emoji": "car" },
      "peer": { "id": 5, "name": "李明", "is_leader": true },
      "last_message": { "content": "你算法熟悉哪些方向？", "created_at": "2026-09-07T10:00:00+08:00" },
      "unread_count": 2,
      "last_message_at": "2026-09-07T10:00:00+08:00"
    }
  ]
}
```

### 3.2 创建 / 打开会话

`POST /api/conversations`，请求体 `{ "team_id": 1 }`

- 已存在则返回现有会话（幂等），否则创建。
- 用于「联系队长」入口。

响应：`201`（新建）或 `200`（已存在），返回会话结构（同 3.1 的 data 元素）。

### 3.3 会话详情 + 消息列表

`GET /api/conversations/{conversation}`

| 参数 | 说明 |
|------|------|
| `page` | 页码（默认 1） |
| `after_id` | 只返回 id 大于该值的消息（**轮询增量用**） |

响应：

```json
{
  "conversation": {
    "id": 1,
    "team": { "id": 1, "name": "无人车战队" },
    "peer": { "id": 5, "name": "李明", "is_leader": true }
  },
  "messages": [
    { "id": 1, "sender_id": 5, "content": "你算法熟悉哪些方向？", "created_at": "2026-09-07T10:00:00+08:00", "mine": false },
    { "id": 2, "sender_id": 2, "content": "Python 和算法设计比较熟", "created_at": "2026-09-07T10:01:00+08:00", "mine": true }
  ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 20, "total": 2 }
}
```

- `mine`：由后端根据当前登录用户与 `sender_id` 判断，前端据此决定气泡靠左/靠右。

### 3.4 发送消息

`POST /api/conversations/{conversation}/messages`，请求体 `{ "content": "你好" }`

响应：`201` + 新消息结构：

```json
{ "id": 3, "sender_id": 2, "content": "你好", "created_at": "2026-09-07T10:02:00+08:00", "mine": true }
```

### 3.5 标记已读

`POST /api/conversations/{conversation}/read`

- 把当前用户在该会话的未读清零（更新 `last_read_message_id`）。
- 响应 `204`。

---

## 4. 实时方案（重要）

**M1 用轮询**（前端每 3 秒调 `GET /conversations/{id}?after_id=最后一条消息id` 拉增量）：

- 简单、稳、答辩不翻车；
- 接口已为增量设计（`after_id` 参数），以后切 WebSocket 不需要改数据结构。

**M2 升级 WebSocket**（Laravel Echo + Pusher / Laravel WebSockets）：

- 后端在 `Message` 上做 `ShouldBroadcast`，前端用 Echo 订阅私有频道；
- 鉴权用 `Broadcast::auth` 回调校验。

---

## 5. 前端对接要点

1. **鉴权**：前端登录后保存 Sanctum token，axios 拦截器统一加 `Authorization: Bearer`。
2. **轮询**：进入聊天页后 `setInterval` 每 3 秒拉 `after_id` 增量；页面失焦或切走时停止。
3. **未读红点**：导航栏调 `GET /conversations`，用 `unread_count` 求和显示。
4. **气泡方向**：靠 `mine` 字段，`mine=true` 右侧、否则左侧。
5. **错误处理**：401 跳登录；422 展示校验错误（见 COMPETITION_API.md 4.6）。

---

## 6. 里程碑

| 阶段 | 内容 | 验收 |
|------|------|------|
| M1 | conversations + messages 表 + 五个接口 + Sanctum | 能发消息、能拉列表、能拉增量 |
| M2 | 未读计数 + `read` 接口 | 红点正确 |
| M3 | WebSocket（可选，答辩后） | 免轮询实时 |

---

*本文档随实现变更更新；改动字段或接口时请同步修订。*
