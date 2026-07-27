# 数据库分析项目

一个面向 Excel/CSV、PDF 与 Obsidian 笔记的统一数据分析工作流。

## 目录结构

| 目录 | 用途 | 读写 |
| --- | --- | --- |
| `data/inputs/` | 存放用户上传的原始数据（Excel/CSV/PDF 等） | 只读 |
| `data/outputs/` | 存放分析结果、汇总表、导出物 | 可写 |
| `scripts/` | 存放可复用的分析脚本或 DuckDB SQL 文件 | 可写 |
| `notes/` | 存放分析笔记、Obsidian 模板 | 可写 |
| `notes/templates/` | Obsidian 笔记模板 | 可写 |

## 命名规范

所有文件统一遵循 `<YYYYMMDD>_<topic>.<ext>` 格式，例如：

- `20260727_sales_top10.csv`
- `20260727_revenue_by_region.json`
- `20260727_monthly_trend.md`

## 推荐工作流

1. **上传数据**：将 Excel/CSV 文件放入 `data/inputs/`，PDF 放入 `data/inputs/`。
2. **结构检查**：使用 `data-analysis` 技能 `inspect` 动作了解表结构与样例。
3. **撰写 SQL**：在 `scripts/` 下保存可复用的 SQL 文件，便于后续回溯。
4. **执行查询**：通过 `data-analysis` 技能 `query` 动作执行 SQL。
5. **导出结果**：将结果导出到 `data/outputs/`，按命名规范命名。
6. **PDF 辅助**：使用 `pdf-monster` 技能解析 PDF，提取关键文本。
7. **分析笔记**：在 `notes/` 下以 `analysis-note` 模板记录每次分析。

## 可用技能与插件

- **data-analysis**：Excel/CSV 的结构检查、SQL 查询、统计汇总、结果导出（DuckDB 引擎）
- **pdf-monster**：PDF 文档解析、OCR、页面渲染与图像提取
- **codex-obsidian**：通过 Obsidian 官方桌面 CLI 管理笔记、属性、模板与同步

## 快速命令参考

```bash
# 检查 Excel/CSV 结构
python /mnt/skills/public/data-analysis/scripts/analyze.py \
  --files /workspace/data/inputs/<file>.xlsx \
  --action inspect

# 执行 SQL
python /mnt/skills/public/data-analysis/scripts/analyze.py \
  --files /workspace/data/inputs/<file>.xlsx \
  --action query \
  --sql "SELECT ..."

# 导出查询结果
python /mnt/skills/public/data-analysis/scripts/analyze.py \
  --files /workspace/data/inputs/<file>.xlsx \
  --action query \
  --sql "SELECT ..." \
  --output-file /workspace/data/outputs/20260727_<topic>.csv
```

## 注意事项

- `data/inputs/` 视为只读区域，不直接修改原始上传文件
- `data/outputs/` 才是分析结果落盘的位置
- 多文件交叉分析时，所有文件同时传给 `data-analysis` 即可在同一 DuckDB 上下文中查询
- 笔记语言跟随用户主要使用语言
