# Tasks

- [x] Task 1: 底部Tab重构 + 患者基础信息录入扩展
  - [x] SubTask 1.1: 底部Tab改为：首页/患者/评估/方案/报告/设置（6个Tab），拍照入口移入患者详情页
  - [x] SubTask 1.2: 患者表单扩展：姓名+年龄(数字/下拉)+性别(下拉)，保存生成唯一ID(P-YYYYMMDD-XXXX)
  - [x] SubTask 1.3: 患者详情页：展示基础信息+关联所有评估数据入口

- [x] Task 2: 主诉与客观评估模块
  - [x] SubTask 2.1: 主诉文本输入区（症状/发病时间/诱因）
  - [x] SubTask 2.2: 触诊子模块（多选疼痛部位 + 0-10滑动评分）
  - [x] SubTask 2.3: 活动度子模块（关节分类 + 主动/被动数值输入）
  - [x] SubTask 2.4: 肌力子模块（肌群分类 + 0-5级单选 + 备注）
  - [x] SubTask 2.5: 皮温子模块（左右侧对比数值）
  - [x] SubTask 2.6: ADL子模块（穿衣/进食/如厕等多选+评分）
  - [x] SubTask 2.7: 所有评估数据按患者ID存localStorage，支持修改

- [x] Task 3: 特殊检查与视频示范模块
  - [x] SubTask 3.1: 内置检查项目库（直腿抬高/4字试验/托马斯/麦肯基/FABER等14项）
  - [x] SubTask 3.2: 每项支持勾选阳性/阴性/可疑 + 备注
  - [x] SubTask 3.3: 每项绑定B站视频链接，点击跳转/iframe播放
  - [x] SubTask 3.4: 检查结果存患者档案

- [x] Task 4: 量表评估模块
  - [x] SubTask 4.1: 量表分类（心肺/疼痛/运动功能）筛选
  - [x] SubTask 4.2: 内置VAS(0-10滑动)+NRS(0-10数字)+MPQ(疼痛问卷)+Barthel+6分钟步行量表
  - [x] SubTask 4.3: 自动计分+生成结论+风险提示
  - [x] SubTask 4.4: 自定义量表添加（问卷内容+评分规则）
  - [x] SubTask 4.5: 历史量表数据对比

- [x] Task 5: 康复方案生成模块
  - [x] SubTask 5.1: 三阶段方案框架（急性期/亚急性期/慢性期），每阶段含目标/频率/项目/注意事项
  - [x] SubTask 5.2: 物理因子治疗项目（电疗/热疗/冷疗，参数+频次）
  - [x] SubTask 5.3: 运动疗法项目（功率自行车/肌力训练/平衡训练，组数+时长）
  - [x] SubTask 5.4: 手法治疗项目（肌筋膜松解/关节松动，部位+时长）
  - [x] SubTask 5.5: 每个治疗项目绑定B站视频链接
  - [x] SubTask 5.6: 方案保存/修改/复制功能

- [x] Task 6: 报告生成与导出模块
  - [x] SubTask 6.1: 结构化报告页面（6部分：基本信息/主诉/客观评估/量表结论/康复方案/注意事项）
  - [x] SubTask 6.2: window.print() + @media print 样式实现PDF导出
  - [x] SubTask 6.3: 报告在线预览+一键修改更新

- [x] Task 7: 数据管理与系统设置模块
  - [x] SubTask 7.1: 患者档案搜索（按姓名/ID）+筛选
  - [x] SubTask 7.2: 患者导出（单个/全部JSON+Excel）
  - [x] SubTask 7.3: 角色切换（治疗师/主任/管理员）本地存储
  - [x] SubTask 7.4: 权限控制（管理员可清空数据，主任可查看全部，治疗师仅自己记录）

- [x] Task 8: 验证与交付
  - [x] SubTask 8.1: JS语法验证通过（2797行）
  - [x] SubTask 8.2: 推送GitHub Release v3.0.0

# Task Dependencies
- Task 2-7 依赖 Task 1（患者框架先搭好）
- Task 6 依赖 Task 2-5（报告需要整合所有评估数据）
- Task 8 依赖所有前置任务
- Task 3、4、5 可并行
