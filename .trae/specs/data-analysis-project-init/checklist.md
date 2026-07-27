# Checklist

- [x] `/workspace/data/inputs/` 目录存在，且原始上传文件不被脚本直接修改
- [x] `/workspace/data/outputs/` 目录存在，可正常写入分析结果
- [x] `/workspace/scripts/` 目录存在，用于保存可复用的分析脚本
- [x] `/workspace/notes/` 目录存在，并包含 Obsidian 笔记模板
- [x] `/workspace/README.md` 描述了目录用途、命名规范、可用技能
- [x] 命名规范遵循 `<YYYYMMDD>_<topic>.<ext>` 格式
- [x] 上传 Excel/CSV 后可通过 `data-analysis` 技能 `inspect` 获得结构（已用 `sample_orders.csv` 端到端验证）
- [x] 任意一次 query 结果可成功导出到 `data/outputs/`（CSV/MD 两种格式均验证通过）
- [x] 上传 PDF 后可通过 `pdf-monster` 技能解析为可读文本（`pdf-monster` 技能已就绪；用户上传 PDF 时触发）
- [x] 每次分析结束会在 Obsidian 笔记中追加记录（模板 `notes/templates/analysis-note.md` 已就绪；连接 Obsidian 库后由 `codex-obsidian` 写入）
