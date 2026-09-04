import type { Order, OrderStatus } from "@/lib/types";

/**
 * 订单数据 —— 种子数据模拟过去 14 天交易
 * 新结账订单通过 addOrder 追加到内存数组（演示交易闭环）
 * 模块 D 若要持久化，可换成 SQLite/Vercel KV，接口保持不变
 */
const SEED_ORDERS: Order[] = [
  { id: "ST-1042", date: "2026-08-20T09:12:00Z", customer: "Emma R.", email: "emma@example.com", country: "United States", productId: "p01", productName: "No. 5910-5", color: "Orange", size: 8, qty: 1, amount: 89, channel: "meta", status: "delivered" },
  { id: "ST-1043", date: "2026-08-20T14:33:00Z", customer: "Liam T.", email: "liam@example.com", country: "Canada", productId: "p02", productName: "No. 5830", color: "Golden", size: 10, qty: 1, amount: 95, channel: "tiktok", status: "delivered" },
  { id: "ST-1044", date: "2026-08-21T11:05:00Z", customer: "Sophia M.", email: "sophia@example.com", country: "United States", productId: "p09", productName: "No. 8801", color: "Black", size: 7, qty: 2, amount: 150, channel: "google", status: "delivered" },
  { id: "ST-1045", date: "2026-08-22T16:41:00Z", customer: "Noah K.", email: "noah@example.com", country: "United Kingdom", productId: "p03", productName: "No. 9525", color: "Holographic", size: 9, qty: 1, amount: 98, channel: "meta", status: "shipped" },
  { id: "ST-1046", date: "2026-08-23T10:20:00Z", customer: "Olivia P.", email: "olivia@example.com", country: "Australia", productId: "p01", productName: "No. 5910-5", color: "Pink", size: 7, qty: 1, amount: 89, channel: "tiktok", status: "shipped" },
  { id: "ST-1047", date: "2026-08-24T08:58:00Z", customer: "Ethan B.", email: "ethan@example.com", country: "United States", productId: "p04", productName: "No. 5960", color: "Yellow", size: 11, qty: 1, amount: 85, channel: "google", status: "shipped" },
  { id: "ST-1048", date: "2026-08-25T19:07:00Z", customer: "Ava L.", email: "ava@example.com", country: "Germany", productId: "p01", productName: "No. 5910-5", color: "Black", size: 6, qty: 1, amount: 89, channel: "meta", status: "fulfilled" },
  { id: "ST-1049", date: "2026-08-26T13:44:00Z", customer: "Mason W.", email: "mason@example.com", country: "United States", productId: "p10", productName: "No. 8013", color: "Black & White", size: 9, qty: 1, amount: 89, channel: "tiktok", status: "fulfilled" },
  { id: "ST-1050", date: "2026-08-27T09:31:00Z", customer: "Isabella F.", email: "bella@example.com", country: "Canada", productId: "p06", productName: "No. 5925", color: "Black", size: 8, qty: 1, amount: 82, channel: "google", status: "fulfilled" },
  { id: "ST-1051", date: "2026-08-28T17:52:00Z", customer: "Lucas H.", email: "lucas@example.com", country: "United States", productId: "p01", productName: "No. 5910-5", color: "Denim", size: 10, qty: 1, amount: 89, channel: "direct", status: "fulfilled" },
  { id: "ST-1052", date: "2026-08-29T12:19:00Z", customer: "Mia G.", email: "mia@example.com", country: "France", productId: "p05", productName: "No. 5922", color: "Black", size: 7, qty: 1, amount: 79, channel: "meta", status: "paid" },
  { id: "ST-1053", date: "2026-08-30T20:03:00Z", customer: "James D.", email: "james@example.com", country: "United States", productId: "p03", productName: "No. 9525", color: "Holographic", size: 10, qty: 1, amount: 98, channel: "tiktok", status: "paid" },
  { id: "ST-1054", date: "2026-08-31T15:26:00Z", customer: "Charlotte S.", email: "charl@example.com", country: "Netherlands", productId: "p01", productName: "No. 5910-5", color: "Magenta", size: 8, qty: 1, amount: 89, channel: "meta", status: "paid" },
  { id: "ST-1055", date: "2026-09-01T11:47:00Z", customer: "Benjamin C.", email: "ben@example.com", country: "United States", productId: "p07", productName: "No. 5970", color: "Black", size: 11, qty: 1, amount: 82, channel: "google", status: "paid" },
  { id: "ST-1056", date: "2026-09-02T08:15:00Z", customer: "Amelia N.", email: "amelia@example.com", country: "United Kingdom", productId: "p01", productName: "No. 5910-5", color: "Off-white", size: 6, qty: 1, amount: 89, channel: "tiktok", status: "paid" },
  { id: "ST-1057", date: "2026-09-02T21:38:00Z", customer: "Henry O.", email: "henry@example.com", country: "United States", productId: "p08", productName: "No. 8058", color: "Black", size: 9, qty: 1, amount: 79, channel: "meta", status: "paid" },
  { id: "ST-1058", date: "2026-09-03T07:59:00Z", customer: "Harper V.", email: "harper@example.com", country: "Canada", productId: "p01", productName: "No. 5910-5", color: "Yellow", size: 9, qty: 1, amount: 89, channel: "direct", status: "paid" },
];

let orders: Order[] = [...SEED_ORDERS];

export function getOrders() {
  return orders;
}

export function addOrder(
  input: Omit<Order, "id" | "date" | "status">
): Order {
  const order: Order = {
    ...input,
    id: `ST-${1059 + orders.length - SEED_ORDERS.length}`,
    date: new Date().toISOString(),
    status: "paid",
  };
  orders = [order, ...orders];
  return order;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  paid: "已支付 Paid",
  fulfilled: "已出库 Fulfilled",
  shipped: "已发货 Shipped",
  delivered: "已签收 Delivered",
};
