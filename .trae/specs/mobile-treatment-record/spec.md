# 移动端治疗师拍照记录系统 Spec

## Why
治疗师需要向患者/医院证明"我确实给这位患者做了治疗"。当前老模式无法调动相机、无法加水印、无法归档防丢。需要一个手机打开即用的单文件 HTML 应用，下载到本地后直接使用，不依赖任何服务器。

## What Changes
- **重写** [index.html](file:///workspace/index.html) 为移动端优先的单文件应用（当前是 PC 端 sidebar 布局）
- 底部 Tab 导航：首页 / 客户 / **拍照记录（中间凸起大按钮）** / 记录 / 统计
- 拍照功能：`<input type="file" accept="image/*" capture="environment">` 调用手机原生相机（file:// 协议下可用）
- 6 要素水印：时间 + 地点（手动输入/EXIF 读取）+ 治疗师姓名 + 患者姓名 + 治疗类型 + 记录编号
- Canvas API 在照片上叠加水印文字（file:// 下 Canvas 可用）
- 数据归档：localStorage 存储（file:// 下可用），IndexedDB 存照片 Blob
- 统计页面：按日期/治疗师/治疗类型/患者维度的计数和列表
- **移除** 登录注册系统（治疗师姓名在设置页填一次，自动带入所有记录）
- 患者管理：增删改查，localStorage 存储
- 记录列表：按时间倒序，可查看详情和大图
- 证明生成：每条记录可生成带二维码的证明页（二维码内容=记录摘要+校验哈希）
- 企业微信 JS-SDK 加载（为后续企业微信内嵌使用预留，本地 file:// 下降级为原生相机）

## Impact
- Affected code: [index.html](file:///workspace/index.html)（完全重写为移动端单文件应用）
- 技术约束：file:// 协议下 getUserMedia 不可用 → 必须用 `<input capture>` 方案；Geolocation 不可用 → 手动输入地点 + 照片 EXIF GPS 读取（如有）
- 无需服务器、无需构建工具、无需 npm install

## ADDED Requirements

### Requirement: 移动端单文件应用
系统 SHALL 是一个独立的 index.html 文件，用户下载到手机后用浏览器直接打开即可使用全部功能，不依赖任何网络请求或服务器。

#### Scenario: 本地打开
- **WHEN** 用户将 index.html 下载到手机并用浏览器打开
- **THEN** 应用正常加载，显示首页工作台
- **AND** 所有功能（拍照、水印、记录、统计）均可在 file:// 协议下运行

### Requirement: 底部 Tab 导航
系统 SHALL 提供移动端底部 5 标签导航，中间为凸起的拍照大按钮。

#### Scenario: 导航切换
- **WHEN** 用户点击底部 Tab
- **THEN** 切换到对应页面（首页/客户/拍照/记录/统计）
- **AND** 中间拍照按钮视觉突出，点击直接进入拍照流程

### Requirement: 拍照加水印
系统 SHALL 支持调用手机原生相机拍照，并在照片上自动叠加 6 要素水印。

#### Scenario: 拍照记录
- **WHEN** 治疗师点击拍照按钮
- **THEN** 调用 `<input type="file" accept="image/*" capture="environment">` 打开手机相机
- **WHEN** 拍照完成
- **THEN** 照片加载到 Canvas
- **AND** 自动叠加水印：①日期时间 ②地点 ③治疗师姓名 ④患者姓名 ⑤治疗类型 ⑥记录编号
- **AND** 水印位于照片底部半透明条带，不遮挡核心画面
- **AND** 生成后的带水印照片可预览、可保存到记录

### Requirement: 治疗师身份设置
系统 SHALL 在设置页让治疗师输入姓名和科室，自动带入所有记录，无需登录注册。

#### Scenario: 首次设置
- **WHEN** 治疗师首次打开应用
- **THEN** 引导填写姓名+科室（可跳过，后续在设置中补填）
- **WHEN** 已填写姓名
- **THEN** 所有拍照记录自动带治疗师姓名水印

### Requirement: 患者管理
系统 SHALL 提供客户（患者）管理功能，支持新增/编辑/删除患者信息。

#### Scenario: 新增患者
- **WHEN** 治疗师在客户页点击"新增患者"
- **THEN** 填写姓名、性别、年龄、诊断、备注
- **AND** 保存到 localStorage
- **AND** 可在拍照时快速选择该患者

### Requirement: 治疗记录归档
系统 SHALL 将每条治疗记录持久化存储到 localStorage + IndexedDB，关闭浏览器后数据不丢失。

#### Scenario: 保存记录
- **WHEN** 治疗师完成拍照+水印后点击保存
- **THEN** 记录保存到 localStorage（文字信息）+ IndexedDB（带水印照片 Blob）
- **AND** 生成唯一记录编号（格式：TR-YYYYMMDD-HHMMSS）
- **AND** 记录列表中可见该条目

### Requirement: 治疗真实性证明
系统 SHALL 为每条记录生成可展示的真实性证明，含二维码追溯。

#### Scenario: 生成证明
- **WHEN** 治疗师在记录详情页点击"生成证明"
- **THEN** 展示证明卡片：治疗师+患者+时间+地点+治疗类型+记录编号
- **AND** 生成二维码（内容=记录摘要 SHA-256 哈希前 16 位）
- **AND** 可截图保存或展示给患者/医院

### Requirement: 统计归档
系统 SHALL 提供统计页面，按多维度展示治疗记录统计。

#### Scenario: 查看统计
- **WHEN** 治疗师进入统计页
- **THEN** 展示：今日记录数 / 累计记录数 / 患者总数
- **AND** 按治疗类型的分布（柱状图）
- **AND** 近 7 天每日记录趋势（折线图）
- **AND** 可按日期范围筛选

### Requirement: 数据导出备份
系统 SHALL 支持将所有记录导出为 JSON 文件备份。

#### Scenario: 导出数据
- **WHEN** 治疗师在设置页点击"导出备份"
- **THEN** 生成 JSON 文件（含所有记录文字信息+照片 base64）
- **AND** 触发浏览器下载

### Requirement: 企业微信兼容
系统 SHALL 预留企业微信 JS-SDK 加载，在企微容器内时使用企微相机/定位能力，在普通浏览器降级为原生 input capture。

#### Scenario: 企微内使用
- **WHEN** 应用在企业微信浏览器中打开
- **THEN** 加载 wx JS-SDK
- **AND** 可调用企微拍照接口（wx.chooseImage / wx.getLocation）
- **WHEN** 在普通浏览器打开
- **THEN** 降级为 `<input capture>` + 手动输入地点

## REMOVED Requirements

### Requirement: 治疗师注册登录系统
**Reason**: 用户明确要求移除账号系统，治疗师姓名在设置页填写即可，无需注册登录。
**Migration**: 治疗师身份信息存储在 localStorage，打开即用。
