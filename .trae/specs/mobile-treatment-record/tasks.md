# Tasks

- [x] Task 1: 移动端框架与底部 Tab 导航
  - [x] SubTask 1.1: 重写 index.html 为移动端 viewport + 底部 5 Tab 固定导航
  - [x] SubTask 1.2: 中间拍照按钮凸出设计，点击进入拍照页
  - [x] SubTask 1.3: 页面路由（hash 路由 #/home #/patients #/camera #/records #/stats #/settings）

- [x] Task 2: 治疗师身份设置（无登录）
  - [x] SubTask 2.1: 首次打开引导填写姓名+科室（可跳过）
  - [x] SubTask 2.2: 设置页可修改姓名/科室，存 localStorage
  - [x] SubTask 2.3: 全局读取治疗师姓名供拍照水印使用

- [x] Task 3: 患者管理
  - [x] SubTask 3.1: 客户列表页，展示所有患者卡片
  - [x] SubTask 3.2: 新增/编辑患者表单（姓名/性别/年龄/诊断/备注）
  - [x] SubTask 3.3: 删除患者（确认弹窗）
  - [x] SubTask 3.4: localStorage 持久化

- [x] Task 4: 拍照+6 要素水印
  - [x] SubTask 4.1: 拍照页：选择患者 + 选择治疗类型 + 输入地点 + `<input capture>` 拍照
  - [x] SubTask 4.2: Canvas 加载照片 → 底部半透明条带叠加水印文字（时间/地点/治疗师/患者/类型/编号）
  - [x] SubTask 4.3: 水印照片预览，确认后保存
  - [x] SubTask 4.4: 记录编号自动生成 TR-YYYYMMDD-HHMMSS

- [x] Task 5: 记录归档（localStorage + IndexedDB）
  - [x] SubTask 5.1: IndexedDB 初始化 store（photos）
  - [x] SubTask 5.2: 保存记录文字信息到 localStorage（数组）
  - [x] SubTask 5.3: 保存带水印照片 Blob 到 IndexedDB
  - [x] SubTask 5.4: 记录列表页：按时间倒序展示缩略图+摘要

- [x] Task 6: 记录详情与真实性证明
  - [x] SubTask 6.1: 记录详情页：大图+全部信息+治疗师/患者/时间/地点/类型
  - [x] SubTask 6.2: 生成证明卡片（含二维码，内容=SHA-256 哈希前 16 位）
  - [x] SubTask 6.3: 证明可截图展示

- [x] Task 7: 统计页面
  - [x] SubTask 7.1: 概览卡片（今日记录数/累计/患者总数）
  - [x] SubTask 7.2: 治疗类型分布（CSS 柱状图，无外部库）
  - [x] SubTask 7.3: 近 7 天趋势（CSS 折线/柱状图）
  - [x] SubTask 7.4: 日期范围筛选

- [x] Task 8: 数据导出与设置
  - [x] SubTask 8.1: 设置页：治疗师信息修改
  - [x] SubTask 8.2: 导出 JSON 备份（含照片 base64）
  - [x] SubTask 8.3: 清空数据（二次确认）

- [x] Task 9: 企业微信 JS-SDK 预留
  - [x] SubTask 9.1: 检测企微环境（wx.miniProgram / UA 判断）
  - [x] SubTask 9.2: 企微内加载 wx JS-SDK（降级不影响普通浏览器）

- [x] Task 10: 自检与交付
  - [x] SubTask 10.1: JS 语法验证通过，10 项功能检查全通过
  - [x] SubTask 10.2: GitHub Release v2.0.0 已发布，下载链接可用
  - [x] SubTask 10.3: 代码已推送到 main 分支

# Task Dependencies
- Task 2 依赖 Task 1（框架先搭好）
- Task 4 依赖 Task 2 + Task 3（需要治疗师姓名和患者信息）
- Task 5 依赖 Task 4（拍照后才能归档）
- Task 6 依赖 Task 5（归档后才能查看详情）
- Task 7 依赖 Task 5（有数据才能统计）
- Task 10 依赖所有前置任务
- Task 8、Task 9 可与 Task 5-7 并行
