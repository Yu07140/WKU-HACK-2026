---
name: "integrate-teammate-pull"
description: "Integrates teammate-pushed code for the STRYDE Next.js project: fetch, resolve committed conflict markers, apply project compliance rules, build-verify, commit locally. Invoke when user says 整合/整合修复/整合改错 after teammates push."
---

# 队友代码整合（STRYDE 项目专用）

当用户说「整合」「整合修复」「整合改错」时执行。背景：队友被允许顶着报错/冲突直接提交 push，由用户统一整合 debug。

## 环境事实（Windows）

- Git 用 GitHub Desktop 自带的（系统 PATH 无 git）：
  `$git = "C:\Users\11417\AppData\Local\GitHubDesktop\app-3.6.5\resources\app\git\cmd\git.exe"`
  （版本号目录可能变，找不到时用 `Get-ChildItem "C:\Users\11417\AppData\Local\GitHubDesktop\app-*"` 取最新）
- **只本地 commit，绝不 push**——用户用 GitHub Desktop 自己推。
- 提交后给用户现成的 GitHub Desktop commit message（Summary + Description）。

## 标准流程

1. **侦察**：`fetch origin` → 查 `origin/main..main`（未推）、`main..origin/main`（新拉）、`status`、以及：
   `git grep -n "^<<<<<<<\|^=======$\|^>>>>>>>" -- "src/"`
   注意：标记可能在工作区干净时仍存在于 HEAD（队友把冲突提交进历史），所以同时查：
   `git grep -n "^<<<<<<" HEAD -- "src/"`
2. **理解队友意图**：`git show --stat <commit>` + 读冲突两侧。先判断哪些是功能（保留）、哪些是 stash 复活的死代码（丢弃）。
3. **解决冲突**（取舍规则见下）。大文件（>300 行）优先用 PowerShell 原子写入，避免 Edit 工具多轮往返期间被 IDE 回写。
4. **停服再构建**：先 StopCommand 停 dev + `Get-Process node | Stop-Process -Force`，再 `npm run build`（dev 与 build 共用 `.next` 目录，同时跑会写坏缓存导致 `Cannot find module './xxx.js'`）。
5. **冒烟测试**：重启 dev（后台），请求：
   `/`(200)、`/products/mono-boot`(200)、`/products/no-5910-5`(200)、`/clips`(200)、`/admin`(307→/login)
6. **commit**（不 push），输出 commit message。

## 冲突取舍规则（项目合规红线）

- **概念款价格锁**：collection/concept 商品（如 no-5910-5）PDP 绝不显示价格、加购按钮、"Factory Direct · Save" 徽章；保留 CONCEPT STUDY 徽章。hero（mono-boot / boot-14534-h）才可显示价格购买。
- **评论区 ReviewsSection**：保留「PRE-LAUNCH REVIEW PREVIEW（DEMO REVIEW 明确标注）+ REAL CUSTOMER REVIEWS 预留区」结构；文件头必须有 `"use client"` 和 `import { Star }`；不得伪造 Verified Buyer/评分汇总。
- **后台保护不可回退**：middleware 对 `/admin/*` 的 cookie 鉴权、`/stock` → `/admin/stock` 重定向必须保留；storefront 导航不得出现 Stock/Dashboard 入口；后台入口是 footer 的可见 Admin 按钮；登录页不得显示密码明文；cookie 为 session cookie（关浏览器失效）。
- **StrydeClips**：首页 StrydeClips 组件 = 单字母实时预览版（`CLIP_LETTERS`/`clipLetterImage`，素材 `public/clips/letters/A-Z.png`）；`ClipCustomizerModal` 是加购弹窗（add 14534-H + 字母备注），**两者共存**。若 PDPView 存在 `clipOpen` state 和 "Click here to get personalized" 按钮，就必须 import 并渲染 `<ClipCustomizerModal open={clipOpen} .../>`——队友合并常漏掉这一处导致 TS 报错。
- **死代码丢弃**：`others`、`PLANS`、未 import 的 `PRODUCTS[0]` fallback、重复的静态服务承诺块（保留 ServiceLink 链接网格）、未使用的 import。
- **多币种**：价格走 `useCurrency().formatPrice`，AI 挂件迷你商品卡同理。
- **EdgeOne 适配**：`@edgeone/opennextjs-pages` 依赖与 edgeone 配置不得被合并冲掉。

## 高频坑

- **IDE 缓冲区回写**：用户 Trae/VS Code 开着冲突文件的旧标签页，自动保存会把冲突标记写回磁盘（本项目已发生 5+ 次）。对策：修复后立即 `git add` 暂存；最终验证 `git grep` 工作区 + HEAD 双查；提醒用户关闭相关标签页（Ctrl+W，弹窗选 Don't Save）。
- **dev 端口卡死**：浏览器显示「服务不可用」多半是僵死 node 占着 :3000——杀 node 进程重启即可。
- **`.next` 损坏**：构建报奇怪模块缺失 → 删 `.next` 目录重启。
- 队友提交信息常为 "1"/"32"/"change"，无参考价值，以 diff 内容为准。
