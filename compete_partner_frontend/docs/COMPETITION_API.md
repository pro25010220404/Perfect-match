# 赛事库后端接口文档（Laravel）

> 面向后端（Laravel + PHP）的实现规格。前端（Vue，本仓库）会按这份契约对接。
> 目标：为「赛搭」新增一个「赛事库」能力，支撑「查赛事 → 按赛事组队」的核心场景。

---

## 1. 背景与目标

当前产品只有「团队 / 推荐 / 组队」，缺少赛事信息源。赛事库要解决：

1. 用户能浏览、搜索、筛选赛事；
2. 赛事能关联「所需技能」，用于和用户的技能画像做组队匹配；
3. 赛事信息可持续更新（用户提交 + 管理员审核 + 定时抓取官方源）。

更新策略（**重要约定**）：赛事数据**默认进待审核状态**，审核通过才对外可见。禁止爬虫直接写入已发布状态，避免日期/链接错误。

---

## 2. 数据模型

### 2.1 表 `competitions`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | bigint PK | |
| `name` | string(255) | 竞赛名称 |
| `slug` | string(255) unique | URL 标识（可自动生成） |
| `type` | string(32) | 竞赛类型 code，见 2.3 枚举 |
| `organizer` | string(255) nullable | 主办方 |
| `registration_start` | date nullable | 报名开始 |
| `registration_deadline` | date nullable | **报名截止**（排序/提醒关键字段） |
| `competition_start` | date nullable | 比赛开始 |
| `competition_end` | date nullable | 比赛结束 |
| `official_url` | string(255) nullable | 官网/报名链接 |
| `description` | text nullable | 简介 |
| `tags` | json nullable | 标签，字符串数组，如 `["国赛","一等奖"]` |
| `skills_required` | json nullable | 所需技能，字符串数组，如 `["Python","嵌入式开发"]` |
| `status` | string(16) | 状态，见 2.2，默认 `pending` |
| `submitted_by` | bigint nullable | 提交人 user id，外键 users |
| `created_at` / `updated_at` | timestamp | |
| `deleted_at` | timestamp nullable | 软删除 |

### 2.2 状态机

```
pending ──approve──▶ published ──reject──▶ rejected
   └────reject────▶ rejected
```

- `pending`：待审核（用户提交 / 爬虫抓取后的初始态）
- `published`：对外可见
- `rejected`：审核驳回

「是否过期 / 是否即将截止」**不落库**，前端根据 `registration_deadline` 与当前时间动态计算（`deadline < now` = 已结束，`now <= deadline <= now+7d` = 即将截止）。

### 2.3 竞赛类型枚举（`type`）

前后端统一用下列 code，展示文案由前端映射。

| code | 中文 |
|------|------|
| `ai` | 人工智能 / 机器学习 |
| `robotics` | 机器人 / 机甲 |
| `math-modeling` | 数学建模 |
| `smart-car` | 智能汽车 |
| `software` | 软件开发 |
| `data-analysis` | 数据分析 |
| `algorithm` | 算法 / 编程 |
| `hardware` | 硬件 / 嵌入式 |
| `design` | 设计 / 创意 |
| `business` | 商业 / 创业 |
| `other` | 其他 |

---

## 3. 迁移与模型（可直接落代码）

```php
// database/migrations/xxxx_create_competitions_table.php
Schema::create('competitions', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->string('type');
    $table->string('organizer')->nullable();
    $table->date('registration_start')->nullable();
    $table->date('registration_deadline')->nullable();
    $table->date('competition_start')->nullable();
    $table->date('competition_end')->nullable();
    $table->string('official_url')->nullable();
    $table->text('description')->nullable();
    $table->json('tags')->nullable();
    $table->json('skills_required')->nullable();
    $table->string('status')->default('pending')->index();
    $table->foreignId('submitted_by')->nullable()->constrained('users')->nullOnDelete();
    $table->timestamps();
    $table->softDeletes();

    $table->index(['status', 'type']);
    $table->index('registration_deadline');
});
```

```php
// app/Models/Competition.php
class Competition extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'type', 'organizer',
        'registration_start', 'registration_deadline',
        'competition_start', 'competition_end',
        'official_url', 'description', 'tags', 'skills_required',
        'status', 'submitted_by',
    ];

    protected $casts = [
        'tags' => 'array',
        'skills_required' => 'array',
        'registration_start' => 'date',
        'registration_deadline' => 'date',
        'competition_start' => 'date',
        'competition_end' => 'date',
    ];

    public function scopePublished($q) { return $q->where('status', 'published'); }
}
```

---

## 4. API 接口

### 约定

- 字段统一 `snake_case`（Laravel 默认），前端适配。
- 时间字段：日期用 `YYYY-MM-DD`；`created_at` 等时间戳用 ISO8601（如 `2026-09-07T10:00:00+08:00`）。
- 列表用 Laravel 默认 `paginate()` 结构（见 4.1 响应）。
- 校验失败统一返回 HTTP 422，结构见 4.6。

### 4.1 赛事列表（公开）

`GET /api/competitions`

| 参数 | 类型 | 说明 |
|------|------|------|
| `q` | string | 关键词，模糊匹配 `name` 或 `description` |
| `type` | string | 竞赛类型 code（2.3） |
| `sort` | string | `latest`（默认，按 created_at 倒序）/ `deadline`（按截止日期升序） |
| `page` | int | 页码，默认 1 |

只返回 `status = published` 的赛事。

响应：

```json
{
  "data": [
    {
      "id": 1,
      "name": "全国大学生智能汽车竞赛",
      "slug": "smart-car-2026",
      "type": "smart-car",
      "organizer": "教育部高等学校自动化类专业教学指导委员会",
      "registration_start": "2026-01-01",
      "registration_deadline": "2026-06-30",
      "competition_start": "2026-07-15",
      "competition_end": "2026-08-15",
      "official_url": "https://example.com",
      "description": "面向全国高校的智能车竞速与算法竞赛。",
      "tags": ["国赛", "工科"],
      "skills_required": ["Python", "嵌入式开发", "控制算法"],
      "status": "published",
      "created_at": "2026-01-05T10:00:00+08:00",
      "updated_at": "2026-01-05T10:00:00+08:00"
    }
  ],
  "links": { "first": null, "last": null, "prev": null, "next": null },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "per_page": 20,
    "total": 1
  }
}
```

### 4.2 赛事详情（公开）

`GET /api/competitions/{competition}`

返回单个 `published` 赛事（结构同 4.1 的 data 元素）。未发布或不存在返回 404。

### 4.3 提交赛事（用户，需登录）

`POST /api/competitions`（鉴权：Sanctum，`Authorization: Bearer <token>`）

请求体：

```json
{
  "name": "全国大学生数学建模竞赛",
  "type": "math-modeling",
  "organizer": "中国工业与应用数学学会",
  "registration_start": "2026-04-01",
  "registration_deadline": "2026-08-20",
  "competition_start": "2026-09-10",
  "competition_end": "2026-09-13",
  "official_url": "https://example.com",
  "description": "……",
  "tags": ["国赛", "建模"],
  "skills_required": ["数学建模", "MATLAB", "论文写作"]
}
```

- `name`、`type` 必填；其余可空。
- `slug` 后端自动生成（Str::slug(name) + 去重后缀）。
- `status` 强制置为 `pending`，`submitted_by` 置为当前用户 id（忽略前端传入）。

响应：`201` + 单个赛事结构。

### 4.4 审核通过 / 驳回（管理员）

`POST /api/competitions/{competition}/approve` → `status = published`
`POST /api/competitions/{competition}/reject` → `status = rejected`

鉴权：管理员（建议 `Auth::user()->is_admin` 或策略 `CompetitionPolicy`）。

### 4.5 类型枚举（公开，供前端下拉框）

`GET /api/competitions/types`

```json
{
  "data": [
    { "code": "ai", "label": "人工智能 / 机器学习" },
    { "code": "robotics", "label": "机器人 / 机甲" }
  ]
}
```

（若前端已维护枚举映射，此接口可省略。）

### 4.6 错误格式

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["名称不能为空"],
    "type": ["请选择竞赛类型"]
  }
}
```

前端约定：`errors` 的 key 为字段名，value 为字符串数组，逐字段展示。

---

## 5. 控制器与路由

```php
// routes/api.php
Route::get('competitions/types', [CompetitionController::class, 'types']);
Route::apiResource('competitions', CompetitionController::class)
    ->only(['index', 'show', 'store']);
Route::post('competitions/{competition}/approve', [CompetitionController::class, 'approve'])
    ->middleware('can:approve,competition');
Route::post('competitions/{competition}/reject', [CompetitionController::class, 'reject'])
    ->middleware('can:approve,competition');
```

```php
// app/Http/Controllers/CompetitionController.php
public function index(Request $request)
{
    $query = Competition::published()
        ->when($request->q, fn ($q, $s) => $q->where(function ($w) use ($s) {
            $w->where('name', 'like', "%{$s}%")
              ->orWhere('description', 'like', "%{$s}%");
        }))
        ->when($request->type, fn ($q, $t) => $q->where('type', $t));

    if ($request->sort === 'deadline') {
        $query->orderBy('registration_deadline');
    } else {
        $query->orderByDesc('created_at');
    }

    return CompetitionResource::collection($query->paginate(20));
}

public function store(StoreCompetitionRequest $request)
{
    $competition = Competition::create($request->validated() + [
        'slug' => $this->uniqueSlug($request->name),
        'status' => 'pending',
        'submitted_by' => $request->user()->id,
    ]);
    return (new CompetitionResource($competition))
        ->response()->setStatusCode(201);
}
```

---

## 6. 定时抓取（半自动更新）

抓取结果**一律写入 `status = pending`**，由管理员审核放行。

```php
// app/Console/Commands/SyncCompetitions.php
class SyncCompetitions extends Command
{
    protected $signature = 'competitions:sync';
    protected $description = '抓取官方竞赛源并写入待审核队列';

    public function handle()
    {
        foreach (config('competitions.sources') as $source) {
            $html = Http::retry(3, 500)->get($source['url'])->body();
            foreach ($this->parse($html, $source['rules']) as $item) {
                Competition::firstOrCreate(
                    ['slug' => $item['slug']],
                    $item + ['status' => 'pending']
                );
            }
        }
    }
}
```

```php
// routes/console.php（Laravel 11+；老版本在 App\Console\Kernel::schedule）
Schedule::command('competitions:sync')->dailyAt('08:00')->withoutOverlapping();
```

服务器 cron：`* * * * * php /path/to/artisan schedule:run`

### 6.1 抓取源清单（按优先级）

**① 竞赛聚合站（信息集中、更新快，首选，但有反爬/合规风险）**
- 我爱竞赛网（52jingsai）、赛氪（saikr）、大学生竞赛网等

**② 头部官方赛事站（权威稳定，需逐个写解析）**
- 全国大学生数学建模竞赛、RoboMaster、蓝桥杯、智能汽车竞赛等官网公告页

**③ 官方通知渠道**
- RSS / 公告列表页 / 公众号（结构固定优先，其次才抓正文）

> 建议 M1 阶段先人工录入 + 用户众包；M2 阶段爬虫只接 2~3 个「聚合站 + 官方公告页」，跑通再加。

### 6.2 合规规范（必须遵守）

1. 先检查目标站 `robots.txt`，禁止抓的站点不抓；
2. 低频抓取（每天 1 次，加随机延迟），避免影响对方服务；
3. 只抓事实性信息（名称/日期/主办方/链接），不复制原创简介文案；
4. 展示时注明来源并附原始链接；
5. 抓取结果一律进 `pending`，人工审核后发布。

### 6.3 源配置示例

```php
// config/competitions.php
return [
    'sources' => [
        [
            'name' => '某竞赛官网公告页',
            'url'  => 'https://example.com/notices',
            'parser' => App\Services\Scrapers\ExampleParser::class,
        ],
    ],
];
```

每个 `Parser` 返回统一结构 `{ slug, name, type, organizer, registration_deadline, official_url, description }`，`SyncCompetitions` 用 `firstOrCreate` 写入 `pending`。

---

## 7. 前端对接要点（给后端对齐用）

1. **CORS**：`config/cors.php` 允许前端 dev/prod 的 origin（`http://localhost:3000` 等）。
2. **鉴权**：前端目前是 mock 登录，后续接 Sanctum 后，`POST /competitions` 需带 token。
3. **字段**：前端按 `snake_case` 消费；`type` 用 code，前端映射中文。
4. **状态计算**：前端用 `registration_deadline` 计算「报名中 / 即将截止 / 已结束」，不依赖后端额外字段。
5. **分页**：前端解析 `meta.last_page` / `meta.total` 做分页。

---

## 8. 里程碑与验收

| 阶段 | 内容 | 验收 |
|------|------|------|
| M1 | migration + model + 列表/详情/类型接口 + 种子数据 | `GET /api/competitions` 返回发布态列表 |
| M2 | 提交接口 + 审核接口 + 权限 | 用户提交进 pending，管理员可 approve/reject |
| M3 | 爬虫命令 + 定时调度 | `php artisan competitions:sync` 能写入 pending |
| M4 | CORS + 前端联调 | 前端赛事库页替换 mock 数据源 |

---

*本文档随实现变更更新；改动字段或接口时请同步修订。*
