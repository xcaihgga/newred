# 数据库分析项目初始化 Spec

## Why
用户希望建立一个数据库分析的工作流脚手架，使其后续上传的数据文档（Excel/CSV、PDF、Obsidian 笔记）能够被统一加载、查询、汇总与导出，并形成可复用的分析知识库。当前阶段不需要立即写代码，仅完成项目骨架与流程约定。

## What Changes
- 在 `/workspace` 下建立分析项目目录结构（输入区、输出区、脚本区、笔记区）
- 约定数据接入约定：使用 `data-analysis` 技能处理 Excel/CSV；使用 `pdf-monster` 技能解析 PDF；使用 `codex-obsidian` 插件维护分析笔记
- 约定文件命名、上传位置、查询结果导出路径
- 为后续每次具体分析建立独立的运行目录与记录

## Impact
- Affected specs: 数据接入规范、分析结果管理、笔记与产出物同步
- Affected code: 暂无（当前为脚手架阶段，未涉及代码改动）

## ADDED Requirements

### Requirement: 项目目录结构
The system SHALL 提供一套标准的项目目录，区分输入数据、输出结果、分析脚本与笔记四类内容。

#### Scenario: 用户上传数据文件
- **WHEN** 用户上传 Excel/CSV 至 `/workspace/data/inputs/`
- **THEN** 项目应能在不破坏现有结构的前提下接受新文件，并保持输入区只读语义（不直接修改原文件）

#### Scenario: 导出分析结果
- **WHEN** 用户要求将查询结果落盘
- **THEN** 结果应写入 `/workspace/data/outputs/` 下，使用 CSV/JSON/Markdown 之一，文件名带时间戳与分析主题

### Requirement: 数据接入工作流
The system SHALL 通过 `data-analysis` 技能完成 Excel/CSV 数据的结构检查、SQL 查询、统计汇总和结果导出。

#### Scenario: 首次分析某文件
- **WHEN** 用户给出新的数据文件路径并提出分析问题
- **THEN** 助手应先调用 `inspect` 了解表结构与样例数据，再决定后续 SQL

#### Scenario: 多文件交叉分析
- **WHEN** 用户同时上传多份相关数据（如订单 + 客户）
- **THEN** 助手应能在同一 SQL 上下文中跨表关联查询

### Requirement: PDF 文档接入
The system SHALL 通过 `pdf-monster` 技能解析用户上传的 PDF 数据说明、报告或扫描件，输出可被后续分析使用的结构化文本。

#### Scenario: 用户上传 PDF 数据说明
- **WHEN** 用户上传 PDF 用于辅助理解数据
- **THEN** 助手应能解析其文本内容并结合 Excel/CSV 分析给出结论

### Requirement: Obsidian 笔记同步
The system SHALL 通过 `codex-obsidian` 插件在指定 Obsidian 库中创建分析记录、问题清单与结论摘要。

#### Scenario: 每次分析产出笔记
- **WHEN** 一次分析结束
- **THEN** 助手应在 Obsidian 库中追加一条笔记，包含：分析目标、数据源、SQL/方法、关键发现、导出物链接

## MODIFIED Requirements
无（首次建立项目，无既有需求需要修改）

## REMOVED Requirements
无

## 非功能性约定
- 输入区只读：原始上传文件不应被脚本直接覆盖
- 输出区可写：所有分析结果、汇总、导出一律落盘到 `outputs/`
- 命名规范：`<YYYYMMDD>_<topic>.<ext>`，如 `20260727_sales_top10.csv`
- SQL 查询统一使用 DuckDB 语法（通过 `data-analysis` 技能）
- 笔记语言：跟随用户主要使用语言
