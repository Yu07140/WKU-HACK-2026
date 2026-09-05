# 后台订单看板 — 现有功能说明（无需改动）

## 结论
项目已有完整的后台订单看板，路径为 `/admin/orders`，无需新增开发。

## 现有功能清单

### 1. 订单看板页面 `/admin/orders`
- **表格字段**：订单号、日期、客户名/地区、商品（配色/尺码/数量/工厂SKU）、渠道、金额、状态
- **统计栏**：总单数、测试单 vs 真实单、GMV
- **刷新按钮**：手动拉取最新订单
- **状态徽章**：已支付 → 已出库 → 已发货 → 已签收（颜色区分）
- **入口**：`/admin` 侧边栏「交易闭环」或直接访问 http://localhost:3000/admin/orders

### 2. 结账下单 → 实时回流
- 用户在 `/checkout` 填写姓名/邮箱/国家/地址 → 点支付
- `POST /api/orders` 写入订单 → 立即出现在 `/admin/orders` 看板
- 新订单标记为 `paid` 状态、非 test

### 3. 数据流
- 存储：内存数组（`src/lib/data/orders.ts`），18 条种子数据 + 结账写入
- API：`GET /api/orders`（列表）+ `POST /api/orders`（新建）
- 类型：`Order` 接口含 customer/email/country/productId/factory_sku/size_eu 等履约字段

## 验证方式
1. 启动 dev：`npm run dev`
2. 打开 http://localhost:3000/admin/orders — 看到 18 条种子订单
3. 打开 http://localhost:3000/products/mono-boot → 加购 → /checkout → 填表下单
4. 回到 /admin/orders → 刷新 → 看到新订单（非 test 标记）
