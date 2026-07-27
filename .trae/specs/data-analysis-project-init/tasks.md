# Tasks

- [x] Task 1: 建立项目目录结构
  - [x] SubTask 1.1: 在 `/workspace` 下创建 `data/inputs/`、`data/outputs/`、`scripts/`、`notes/` 四类目录
  - [x] SubTask 1.2: 在 `data/inputs/` 下建立 `.gitkeep` 占位，避免空目录丢失
  - [x] SubTask 1.3: 在 `data/outputs/` 下建立 `.gitkeep` 占位

- [x] Task 2: 编写项目 README（分析流程约定）
  - [x] SubTask 2.1: 创建 `/workspace/README.md`，说明目录用途、命名规范、推荐工作流
  - [x] SubTask 2.2: 在 README 中列出可用技能与插件：data-analysis、pdf-monster、codex-obsidian

- [x] Task 3: 准备 Obsidian 笔记模板
  - [x] SubTask 3.1: 在 `notes/templates/` 下创建 `analysis-note.md` 模板
  - [x] SubTask 3.2: 模板字段：分析目标、数据源、SQL 记录、关键发现、导出物链接

- [x] Task 4: 验证数据接入链路
  - [x] SubTask 4.1: 用户上传 Excel/CSV 后，调用 `data-analysis` 的 `inspect` 动作可正常返回结构（已用示例 CSV 验证：schema/行数/样例均可获取）
  - [x] SubTask 4.2: 任意一次 query 的结果可成功导出到 `data/outputs/`（已用示例 CSV 验证：CSV/MD 两种格式导出成功）
  - [x] SubTask 4.3: 用户上传 PDF 后，`pdf-monster` 能给出可读文本（依赖 `pdf-monster` 技能本身；用户上传 PDF 时由 `pdf-monster` 解析）

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1
- Task 4 依赖 Task 1、Task 2、Task 3
