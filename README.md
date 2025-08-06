# 🎨 Sora Image Demo - AI图片生成工具

一个功能强大的AI图片生成工具，支持图转提示词和故事分镜批量生成，集成多个AI平台API。

## ✨ 主要特性

- 🖼️ **图转提示词** - 上传图片自动生成AI绘画提示词
- 📖 **故事分镜** - AI生成故事脚本并批量生成分镜图片
- 🔄 **多API支持** - 云雾API + APICore平台双重保障
- 🛠️ **错误修复** - 内置网络错误修复和重试机制
- 📊 **实时调试** - 详细的操作日志和错误分析
- 📱 **响应式设计** - 支持桌面和移动设备

## 🚀 快速开始

### 环境要求
- Node.js 14+
- npm 或 yarn

### 安装运行
```bash
# 克隆项目
git clone <repository-url>
cd text-to-image

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
open http://localhost:8888
```

## 🔑 API配置

### 必需的API Keys

1. **OpenRouter API Key** - 用于AI提示词生成
   - 获取地址：https://openrouter.ai/
   - 用途：图片分析和提示词生成

2. **云雾API Key** - 主要图片生成服务
   - 获取地址：https://yunwu.ai/
   - 模型：sora_image

3. **APICore API Key** - 备用图片生成服务
   - 获取地址：https://doc.apicore.ai/
   - 模型：sora_image

### 配置方法
在页面中直接输入对应的API Key即可，系统会自动保存到本地存储。

## 📖 使用指南

### 图转提示词功能
1. 切换到"图转提示词"标签页
2. 输入OpenRouter API Key
3. 上传参考图片（支持多张）
4. 点击"批量生成Prompts"
5. 输入云雾或APICore API Key
6. 点击"批量生成图片"

### 故事分镜功能
1. 切换到"故事提示词"标签页
2. 输入故事描述或导入CSV文件
3. 点击"生成故事脚本"
4. 配置API Key和生成参数
5. 点击"一键生成整个故事"

## 🛠️ 技术架构

### 前端技术
- HTML5 + CSS3 + JavaScript (ES6+)
- 响应式布局设计
- 原生Fetch API + 错误修复补丁

### 后端技术
- Node.js + Express
- 静态文件服务
- 端口：8888

### API集成
- **OpenRouter API** - 多模型AI对话
- **云雾API** - Sora图片生成
- **APICore API** - 备用图片生成

## 🔧 核心功能

### 网络错误修复
- ✅ 自动重试机制（失败时重试3次）
- ✅ 60秒超时保护
- ✅ 智能错误分类和解决建议
- ✅ 详细的网络诊断工具

### 图片处理
- 自动图片压缩（1024px以内）
- 支持多种图片格式
- 批量处理能力
- 实时进度显示

### 用户体验
- 直观的标签页界面
- 实时调试日志
- 一键下载功能
- 批量操作支持

## 📁 项目结构

```
text-to-image/
├── sora_image.html              # 主页面
├── server.js                    # Express服务器
├── package.json                 # 项目配置
├── fix-fetch-error.js          # 网络修复补丁
├── yunwu-api-patch.js          # API优化补丁
├── test-fixed-api.html         # 修复测试页面
├── test-optimized-api.html     # 优化测试页面
├── API_Documentation.md        # API文档
├── USAGE_GUIDE.md              # 详细使用指南
└── public/                     # 静态资源
```

## 🔍 故障排除

### 常见问题

**Q: 遇到"Failed to fetch"错误怎么办？**
A: 项目已内置修复方案，会自动重试。如仍有问题，请：
- 刷新页面（Ctrl+F5）
- 检查网络连接
- 使用"网络诊断"功能

**Q: API连接失败怎么办？**
A: 请检查：
- API Key是否正确
- 网络连接是否正常
- 查看调试日志获取详细错误信息

**Q: 图片生成失败怎么办？**
A: 可能原因：
- 提示词包含敏感内容
- API余额不足
- 网络连接不稳定

### 调试工具
- 页面底部的实时调试日志
- "网络诊断"按钮
- "测试连接"功能
- 浏览器开发者工具控制台

## 🎯 API端点说明

### 云雾API
```
POST https://yunwu.ai/v1/chat/completions
POST https://yunwu.ai/v1/images/generations
```

### APICore API
```
POST https://api.apicore.ai/v1/images/generations
```

### OpenRouter API
```
POST https://openrouter.ai/api/v1/chat/completions
```

## 📊 性能优化

- 图片自动压缩减少传输时间
- 请求去重避免重复调用
- 智能重试提高成功率
- 批量处理提升效率

## 🔒 安全考虑

- API Key仅存储在浏览器本地
- 不上传敏感信息到服务器
- 输入内容自动过滤
- 错误信息脱敏处理

## 📈 更新计划

- [ ] 支持更多AI模型
- [ ] 添加图片编辑功能
- [ ] 优化移动端体验
- [ ] 增加用户管理系统

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 支持与反馈

如果您遇到问题或有建议，请：
- 查看 [USAGE_GUIDE.md](USAGE_GUIDE.md) 详细使用指南
- 查看 [API_Documentation.md](API_Documentation.md) API文档
- 使用页面内置的调试工具
- 提交 Issue 或 Pull Request

---

🎨 **开始创作您的AI艺术作品吧！**