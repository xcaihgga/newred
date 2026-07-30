# Checklist

- [x] index.html 为移动端单文件应用，底部 5 Tab 导航，中间拍照按钮凸出
- [x] 打开即用，无登录注册，治疗师姓名在设置页填写后自动带入所有记录
- [x] 拍照通过 `<input type="file" accept="image/*" capture="environment">` 调用手机相机
- [x] 拍照后 Canvas 自动叠加 6 要素水印（时间/地点/治疗师/患者/类型/编号）
- [x] 水印位于照片底部半透明条带，不遮挡核心画面
- [x] 患者管理功能完整（增删改查），localStorage 持久化
- [x] 治疗记录保存到 localStorage + IndexedDB（照片 Blob），关闭浏览器不丢数据
- [x] 记录编号格式 TR-YYYYMMDD-HHMMSS，全局唯一
- [x] 记录列表按时间倒序，展示缩略图和摘要
- [x] 记录详情页可生成带二维码的真实性证明卡片
- [x] 统计页展示今日/累计/患者总数 + 治疗类型分布柱状图 + 7 天趋势
- [x] 设置页可修改治疗师信息、导出 JSON 备份、清空数据
- [x] 全部功能在 file:// 协议下可运行（无网络依赖）
- [x] 企业微信 JS-SDK 预留加载，普通浏览器降级正常
- [x] 推送 GitHub Release，用户可下载 index.html 在手机浏览器直接打开使用
