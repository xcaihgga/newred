# 水印功能使用说明

## 功能概述

治疗师治疗记录系统的拍照水印功能已完整实现，包括水印添加、地理定位和自定义配置。该功能确保治疗记录的真实性和可追溯性。

## 主要功能

### 1. 拍照功能 (Task 9)

#### 水印添加功能
- **MediaDevices API 集成**: 支持调用摄像头进行拍照
- **前后摄像头切换**: 可在前后摄像头之间切换
- **实时预览**: 拍摄前可实时预览摄像头画面
- **水印叠加**: 自动在照片上叠加水印信息

#### 水印信息收集
系统自动收集并嵌入以下信息到水印中：
- **拍摄时间**: 精确到秒的时间戳
- **地理位置**: 经纬度坐标 + 可读地址
- **治疗师信息**: 姓名、证书编号
- **患者信息**: 姓名、病历号
- **治疗类型**: 当前治疗的类型

#### 图片保存
- **原图保存**: 保存原始照片用于备份和验证
- **水印图保存**: 保存带水印的照片用于日常展示

### 2. 地理定位功能 (Task 10)

#### Geolocation API 集成
- 自动获取当前位置信息
- 处理权限请求和错误提示
- 支持高精度定位模式

#### 地理坐标获取
获取以下位置信息：
- 经纬度坐标
- 海拔高度（如果可用）
- 定位精度
- 速度和方向（如果可用）

#### 地图服务集成
- 支持高德地图API
- 支持百度地图API
- 将经纬度转换为可读地址
- 在水印中显示地址信息

#### 位置验证
- 检查定位精度是否合理
- 验证定位时间与拍照时间匹配
- 防止虚假定位

### 3. 水印自定义功能 (Task 11)

#### 水印配置页面
访问路径: `/watermark-settings` 或点击顶部导航栏的水滴图标

#### 可配置项目

**基本设置:**
- 启用/禁用水印
- 水印位置: 左上、右上、左下、右下、居中
- 透明度: 0.1 - 1.0
- 字体大小: 10px - 30px
- 字体颜色
- 背景颜色（可选）

**字段配置:**
- 选择显示哪些字段
- 自定义字段标签
- 调整字段显示顺序

**导入导出:**
- 导出当前配置为JSON文件
- 从JSON文件导入配置
- 恢复默认配置

#### 配置存储
- 配置自动保存到 localStorage
- 支持离线模式
- 刷新页面后配置保持

## 使用方法

### 1. 配置水印

1. 登录系统后，点击顶部导航栏的水滴图标
2. 进入水印配置页面
3. 根据需要调整水印样式和显示字段
4. 实时预览效果
5. 配置自动保存

### 2. 拍摄照片

1. 在创建或编辑治疗记录时，选择"拍照记录"
2. 系统自动打开摄像头并获取地理位置
3. 预览画面，可以切换前后摄像头
4. 点击"拍照"按钮拍摄照片
5. 预览带水印的照片
6. 确认使用或重新拍摄

### 3. 查看照片

拍摄的照片会同时保存两个版本：
- **原图**: 文件名以 `original-` 开头，用于备份和验证
- **水印图**: 文件名以 `watermarked-` 开头，包含完整水印信息

## 技术实现

### 核心文件

**类型定义:**
- `src/types/watermark.ts`: 水印配置类型定义

**工具函数:**
- `src/utils/watermarkGenerator.ts`: 水印生成工具
- `src/utils/geoLocation.ts`: 地理定位工具

**状态管理:**
- `src/stores/watermarkStore.ts`: 水印配置存储

**组件:**
- `src/components/media/CameraCapture.tsx`: 拍照组件
- `src/pages/WatermarkSettingsPage.tsx`: 水印配置页面

### Canvas API 水印绘制

系统使用 Canvas API 绘制水印：

```typescript
// 绘制文本水印
const drawTextWatermark = (ctx: CanvasRenderingContext2D, config: WatermarkConfig, data: WatermarkData) => {
  ctx.globalAlpha = config.opacity
  ctx.font = `${config.fontSize}px ${config.fontFamily}`
  ctx.fillStyle = config.fontColor
  // ... 绘制逻辑
}
```

### 地理定位实现

使用浏览器 Geolocation API 获取位置：

```typescript
navigator.geolocation.getCurrentPosition(
  (position) => {
    // 处理位置信息
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy
    }
  },
  (error) => {
    // 错误处理
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }
)
```

## 安全性考虑

### 防止虚假定位
系统通过以下方式验证位置真实性：
- 检查定位精度阈值
- 验证定位时间与拍照时间匹配度
- 检测移动速度异常
- 提供位置验证警告

### 数据完整性
- 保存原始照片用于后续验证
- 水印信息不可篡改
- 所有水印字段都有时间戳

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

需要支持：
- MediaDevices API
- Geolocation API
- Canvas API
- localStorage

## 未来扩展

可以进一步扩展的功能：
1. 支持更多地图服务API
2. 添加图片水印（Logo）
3. 支持批量处理
4. 添加二维码水印
5. 支持水印加密验证

## 故障排查

### 常见问题

**问题1: 摄像头无法打开**
- 检查浏览器权限设置
- 确认网站使用HTTPS协议
- 尝试刷新页面

**问题2: 位置获取失败**
- 检查浏览器位置权限
- 确认GPS已开启（移动设备）
- 尝试在开阔区域获取位置

**问题3: 水印不显示**
- 检查水印是否已启用
- 确认配置正确保存
- 清除浏览器缓存重新配置

## 技术支持

如有问题，请检查：
1. 浏览器控制台错误信息
2. 网络请求状态
3. localStorage配置数据

---

**版本**: 1.0.0  
**更新日期**: 2024年  
**开发团队**: 治疗师治疗记录系统开发组