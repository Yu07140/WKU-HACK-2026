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

## 目录结构与四人分工

```
src/
├── app/
│   ├── page.tsx                【A】首页
│   ├── products/               【A】商品列表 + 详情 PDP
│   ├── cart/ checkout/         【A】购物车 + 结账（交易闭环入口）
│   ├── studio/                 【B】AIGC 素材工坊页面
│   ├── admin/                  【D】增长看板（总览/投放/订单/选款）
│   └── api/
│       ├── agent/              【C】AI 导购流式接口
│       ├── generate-copy/      【B】文案生成接口
│       └── orders/ products/   【共用】数据接口
├── components/
│   ├── store/                  【A】前台组件（Header/ProductCard/PDP...）
│   ├── studio/                 【B】工坊组件（场景图/文案/创意矩阵）
│   ├── agent/                  【C】AgentWidget 聊天挂件
│   ├── admin/                  【D】看板组件（Panel/Stat/Bar）
│   └── ui/                     【共用】Button/Card/Badge/Input/ProductImage
└── lib/
    ├── types.ts                【共用】全局数据模型 ⚠️ 改字段先群里同步
    ├── utils.ts                【共用】格式化工具
    ├── data/                   【共用】catalog 货盘 / orders / campaigns / brand
    ├── ai/
    │   ├── image.ts            【B】文生图统一封装（换模型只改这里）
    │   ├── copy.ts             【B】文案生成（规则引擎 → LLM 替换点）
    │   └── agent.ts            【C】导购 Agent（意图识别 + 商品检索 → LLM 替换点）
    └── store/cart.tsx          【A】购物车状态（localStorage）
```

### 分工建议

| 成员 | 模块 | 主战场 | 冲刺目标 |
| --- | --- | --- | --- |
| **A · 前端/建站** | DTC 独立站 | `app/(store)` + `components/store/` | 品牌视觉打磨、PDP 细节、评价区、多币种/多语言、结账接 Stripe test mode |
| **B · AIGC 素材** | 素材工坊 | `app/studio/` + `components/studio/` + `lib/ai/image.ts` `copy.ts` | 接真实 LLM/多模态模型、品牌 kit 生成、视频脚本、素材批量导出、模特换装图 |
| **C · AI Agent** | 智能导购 | `components/agent/` + `lib/ai/agent.ts` + `app/api/agent/` | 接 LLM function-calling、订单查询工具、弃购挽回邮件 Agent、多语言、语音输入 |
| **D · 增长/数据** | 投放看板 | `app/admin/` + `components/admin/` + `lib/data/` | 实时图表、A/B 测试流程、Meta/Google Ads API 对接、ROI 归因、路演数据大屏 |

**协作规则**
1. `components/ui/`、`lib/types.ts`、`lib/data/` 是公共区，修改前在群里说一声。
2. 各模块只在自己的目录里新建文件；需要跨模块能力时调 API（`/api/*`），不要直接 import 对方组件。
3. AI 功能一律保持「无 Key 也能 demo」：LLM 调用失败要回退到规则引擎。

## 推荐扩展点（按性价比排序）

- [ ] **B**：`lib/ai/copy.ts` 的 `generateCopy()` 内部换成大模型调用（返回结构 `CopyResult` 不变，前端零改动）
- [ ] **C**：`lib/ai/agent.ts` 的 `agentReply()` 换成 LLM + tools（`searchProducts` 等函数已就绪，可直接作为 function-calling 工具）
- [ ] **D**：订单/活动持久化到 SQLite 或 Vercel KV（当前为内存数组，重启重置）
- [ ] **A**：结账接 Stripe test mode；加商品评价区与买家秀 AIGC 图
- [ ] **B+C**：Agent 推荐结果一键生成该商品的广告创意（B/C 模块联动，路演亮点）
- [ ] **D**：路演模式数据大屏（实时订单滚动 + 世界地图）

## 数据说明

- `lib/data/catalog.ts`：8 个鞋类 SKU，含零售价/出厂价/MOQ/打样周期/AI 热度分（模拟组委会货盘）
- 所有商品图、Hero 图、广告创意均由文生图 API 实时生成（`lib/ai/image.ts`）
- 结账订单写入内存订单表，`/admin/orders` 实时可见（演示完整交易闭环）
