# STRYDE — 极限出海：AI 驱动跨境鞋类 DTC 品牌

WKU HACK 2026 · 60-Hour Cross-Border Sprint: AI-Powered D2C Footwear Brand

从「白牌鞋厂」到「海外独立站 DTC 品牌」的全流程演示：**建站 → AIGC 素材 → 投放冷启动 → 交易闭环**，
一个 Next.js 全栈应用内全部跑通，四位队员按模块分工、互不冲突。

## 快速开始

```bash
npm install
npm run dev      # http://localhost:3000
```

| 页面 | 地址 | 说明 |
| --- | --- | --- |
| DTC 独立站前台 | `/` | 首页 / 商品列表 / 详情 / 购物车 / 结账 |
| AIGC 素材工坊 | `/studio` | 场景图生成、广告文案、跨平台创意矩阵 |
| AI 导购 Agent | 右下角悬浮按钮 | 流式对话、商品检索、尺码/物流问答 |
| 增长投放看板 | `/admin` | KPI 漏斗、渠道成交、AI 选款、广告活动、订单 |

**演示动线（路演 script）**：`/studio` 用 AI 给货盘出图出文案 → `/admin/campaigns` 建广告组冷启动
→ 回到 `/` 以消费者身份逛站、问 AI 导购、加购结账 → `/admin/orders` 看订单实时回流、`/admin` 看漏斗与 ROAS。

## 技术栈

- **Next.js 15**（App Router + Route Handlers）+ **React 19** + **TypeScript**
- **Tailwind CSS v4**（零配置，主题 token 见 `src/app/globals.css`）
- **lucide-react** 图标；无重型依赖，安装快、Vercel 一键部署
- AI 能力默认全部**离线可演示**（规则引擎 + 文生图 API），接 LLM 只需替换单个文件（见下）

## 项目结构

```
src/
├── app/
│   ├── page.tsx                # 首页
│   ├── products/               # 商品列表 + 详情 PDP
│   ├── cart/ checkout/         # 购物车 + 结账（交易闭环入口）
│   ├── studio/                 # AIGC 素材工坊页面
│   ├── admin/                  # 增长看板（总览/投放/订单/选款）
│   └── api/
│       ├── agent/              # AI 导购流式接口
│       ├── generate-copy/      # 文案生成接口
│       └── orders/ products/   # 数据接口（共用）
├── components/
│   ├── store/                  # 前台组件（Header/ProductCard/PDP...）
│   ├── studio/                 # 工坊组件（场景图/文案/创意矩阵）
│   ├── agent/                  # AgentWidget 聊天挂件
│   ├── admin/                  # 看板组件（Panel/Stat/Bar）
│   └── ui/                     # 共用基础组件（Button/Card/Badge/Input/ProductImage）
└── lib/
    ├── types.ts                # 全局数据模型 ⚠️ 改字段先群里同步
    ├── utils.ts                # 格式化工具（共用）
    ├── data/                   # catalog 货盘 / orders / campaigns / brand（共用）
    ├── ai/
    │   ├── image.ts            # 文生图统一封装（换模型只改这里）
    │   ├── copy.ts             # 文案生成（规则引擎 → LLM 替换点）
    │   └── agent.ts            # 导购 Agent（意图识别 + 商品检索 → LLM 替换点）
    └── store/cart.tsx          # 购物车状态（localStorage）
```

### 协作约定

1. `components/ui/`、`lib/types.ts`、`lib/data/` 是公共区，**修改前在群里同步**。
2. 各模块优先在自己的目录里新建文件；跨模块能力调用 API（`/api/*`），避免直接 import 对方组件。
3. AI 功能一律保持「**无 Key 也能 demo**」：LLM 调用失败时回退到规则引擎。

## 冲刺扩展点（按性价比排序 · 任选切入）

- [ ] `lib/ai/copy.ts` 的 `generateCopy()` 内部换成大模型调用（返回结构 `CopyResult` 不变，前端零改动）
- [ ] `lib/ai/agent.ts` 的 `agentReply()` 换成 LLM + tools（`searchProducts` 等函数已就绪，可直接作为 function-calling 工具）
- [ ] 订单/活动持久化到 SQLite 或 Vercel KV（当前为内存数组，重启重置）
- [ ] 结账接 Stripe test mode；加商品评价区与买家秀 AIGC 图
- [ ] Agent 推荐结果 → 一键生成该商品的广告创意（模块联动，路演强亮点）
- [ ] 路演模式数据大屏（实时订单滚动 + 世界地图）

## 数据说明

- `lib/data/catalog.ts`：8 个鞋类 SKU，含零售价/出厂价/MOQ/打样周期/AI 热度分（模拟组委会货盘）
- 所有商品图、Hero 图、广告创意均由文生图 API 实时生成（`lib/ai/image.ts`）
- 结账订单写入内存订单表，`/admin/orders` 实时可见（演示完整交易闭环）
