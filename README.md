# 🎨 Sora Image Demo - 智能AI图片生成工具

基于云雾AI和APICore平台的智能图片生成工具，支持图转提示词和故事分镜批量生成，内置完善的错误修复机制。

## ✨ 核心功能

### 🖼️ 图转提示词生成
- 上传参考图片，AI自动分析并生成详细的绘画提示词
- 支持多张图片批量处理
- 使用OpenRouter API的多种AI模型（GPT-4o、Claude-3、Gemini等）

### 📖 故事分镜批量生成  
- AI自动生成完整故事脚本
- 一键批量生成整个故事的所有分镜图片
- 支持CSV格式导入/导出故事数据

### 🔄 多平台API支持
- **云雾API** - 主要图片生成服务（sora_image模型）
- **APICore平台** - 备用图片生成服务，提供双重保障
- **OpenRouter API** - 多模型AI对话和图片分析

### 🛠️ 完善的错误修复系统
- ✅ 修复了"Failed to fetch"网络错误
- ✅ 智能自动重试机制（失败时重试3次）
- ✅ 60秒超时保护，防止无限等待
- ✅ 多端点自动切换，提高成功率
- ✅ 详细的网络诊断和错误分析工具

## 🚀 快速开始

### 环境要求
- Node.js 14.0.0+
- npm 6.0.0+
- 现代浏览器（支持ES6+和Fetch API）

### 安装运行
```bash
# 克隆项目
git clone <repository-url>
cd sora-image-demo

# 安装依赖
npm install

# 启动开发服务器
npm start
# 或者
npm run dev

# 访问应用
open http://localhost:8888
```

### 测试页面
- **主应用**: http://localhost:8888
- **修复测试页面**: http://localhost:8888/test-fixed-api.html  
- **优化测试页面**: http://localhost:8888/test-optimized-api.html
- **APICore集成测试**: http://localhost:8888/test-apicore-integration.html

## 🔑 API配置

### 必需的API Keys

| API服务 | 用途 | 获取地址 | 模型/功能 |
|---------|------|----------|-----------|
| **OpenRouter** | AI提示词生成和图片分析 | https://openrouter.ai/ | GPT-4o Mini, Claude-3, Gemini Pro等 |
| **云雾API** | 主要图片生成服务 | https://yunwu.ai/ | sora_image模型 |
| **APICore** | 备用图片生成服务 | https://doc.apicore.ai/ | sora_image模型 |

### 配置方法
1. 在页面对应的输入框中填入API Key
2. 点击"测试连接"验证API可用性
3. 系统会自动保存到浏览器本地存储
4. 支持多平台同时配置，自动智能切换

### API Key格式
- **OpenRouter**: `sk-or-v1-xxxxxxxxxxxxxxxx`
- **云雾API**: `sk-xxxxxxxxxxxxxxxx`  
- **APICore**: `sk-xxxxxxxxxxxxxxxx`

## 📖 使用指南

### 🖼️ 图转提示词功能
1. **配置API Key**
   - 填入OpenRouter API Key（用于图片分析）
   - 填入云雾API或APICore API Key（用于图片生成）
   - 点击"测试连接"验证可用性

2. **上传参考图片**
   - 支持JPG、PNG、WebP等格式
   - 支持多张图片批量上传
   - 自动压缩到1024px以内

3. **生成提示词**
   - 点击"批量生成Prompts"
   - AI自动分析图片并生成详细提示词
   - 可手动编辑和优化提示词

4. **生成图片**
   - 点击"批量生成图片"
   - 系统自动选择最佳API平台
   - 实时显示生成进度和结果

### 📖 故事分镜功能
1. **输入故事描述**
   - 在"故事元提示词"中描述故事主题
   - 或者导入CSV格式的故事数据
   - 支持详细的角色和场景描述

2. **生成故事脚本**
   - 点击"生成故事脚本"
   - AI自动创建完整的分镜脚本
   - 可预览和编辑每个分镜的描述

3. **批量生成分镜**
   - 点击"一键生成整个故事"
   - 自动为每个分镜生成对应图片
   - 支持批量下载和导出

## 🛠️ 技术架构

### 前端技术栈
- **HTML5 + CSS3 + 原生JavaScript (ES6+)**
- **响应式设计** - 支持桌面和移动设备
- **标签页界面** - 直观的功能切换
- **实时调试日志** - 完整的操作记录
- **原生Fetch API** + 自研错误修复补丁

### 后端服务
- **Node.js + Express** - 轻量级静态文件服务器
- **端口**: 8888
- **支持CORS** - 跨域资源共享
- **Vercel部署** - 支持云端部署

### API集成架构
```
用户界面
    ↓
多平台智能路由
    ├── OpenRouter API (图片分析)
    ├── 云雾API (主要图片生成)
    └── APICore API (备用图片生成)
```

### 错误修复系统
- **智能重试机制** - 失败自动重试3次
- **多端点切换** - 自动尝试不同API端点
- **超时保护** - 60秒超时防止卡死
- **网络诊断** - 实时连接状态检测

## 🔧 核心特性详解

### 🛡️ 网络错误修复系统
- ✅ **智能重试机制** - 网络失败时自动重试3次，间隔2秒
- ✅ **多端点支持** - 自动尝试6个不同的API端点
- ✅ **超时保护** - 60秒超时机制，防止无限等待
- ✅ **错误分类** - 智能区分4xx客户端错误和5xx服务器错误
- ✅ **网络诊断** - 实时检测API连接状态和SSL证书

### 🖼️ 智能图片处理
- **自动压缩** - 上传图片自动压缩到1024px以内
- **格式支持** - JPG、PNG、WebP、GIF等主流格式
- **批量处理** - 支持多张图片同时上传和处理
- **Base64编码** - 自动转换为API所需格式
- **垫图功能** - 支持参考图片引导生成

### 🎯 多平台智能路由
- **优先级系统** - 云雾API优先，APICore备用
- **自动切换** - 主平台失败时无缝切换到备用平台
- **状态监控** - 实时显示当前使用的API平台
- **负载均衡** - 智能分配请求到最佳平台

### 🎨 用户体验优化
- **标签页界面** - 清晰的功能分区
- **实时日志** - 详细的操作记录和错误信息
- **进度显示** - 批量操作的实时进度条
- **一键操作** - 批量下载、复制链接等便捷功能
- **响应式设计** - 完美适配各种屏幕尺寸

## 📁 项目结构

```
sora-image-demo/
├── 📄 主要文件
│   ├── sora_image.html                    # 主应用页面（已集成所有修复）
│   ├── index.html                         # 入口页面
│   ├── server.js                          # Express静态服务器
│   └── package.json                       # 项目配置和依赖
│
├── 📋 项目文档
│   ├── README.md                          # 项目说明（本文件）
│   ├── PROJECT_SUMMARY.md                 # 项目总结
│   ├── APICore集成完成总结.md              # APICore集成报告
│   ├── APICore修复完成报告.md              # 错误修复报告
│   └── docs/                              # 详细文档
│       ├── API_Documentation.md           # API调用文档
│       └── USAGE_GUIDE.md                 # 使用指南
│
├── 🧪 测试文件
│   ├── test-apicore-integration.html      # APICore集成测试
│   ├── test-apicore-fix.html             # APICore修复测试
│   ├── test-fixed-api.html               # 网络修复测试
│   ├── test-current-implementation.html   # 当前实现测试
│   ├── final-verification.js             # 最终验证脚本
│   └── test-api-detailed.js              # 详细API测试
│
├── 🔧 脚本工具
│   └── scripts/
│       ├── deploy.js                      # 部署脚本
│       ├── integrate-fix-to-main.js       # 修复集成脚本
│       └── verify-integration.js          # 集成验证脚本
│
├── 🎨 静态资源
│   └── public/
│       ├── 工作簿4-木子年华.csv            # 测试数据
│       └── *.png, *.jpg                   # 示例图片
│
├── 📦 配置文件
│   ├── vercel.json                        # Vercel部署配置
│   ├── .gitignore                         # Git忽略文件
│   └── project.config.js                  # 项目配置
│
└── 📚 备份文件
    └── sora_image_backup_*.html           # 历史版本备份
```

## 🔍 故障排除

### ✅ 已修复的问题
- ✅ **"Failed to fetch"错误** - 已通过智能重试机制完全修复
- ✅ **API连接超时** - 已添加60秒超时保护和自动重试
- ✅ **网络不稳定** - 已实现多端点自动切换
- ✅ **SSL证书问题** - 已优化HTTPS连接处理

### 🛠️ 内置诊断工具

| 工具名称 | 功能描述 | 使用方法 |
|----------|----------|----------|
| **网络诊断** | 检测API连接状态 | 点击页面中的"网络诊断"按钮 |
| **连接测试** | 验证API Key有效性 | 填入API Key后点击"测试连接" |
| **实时日志** | 显示详细操作记录 | 查看页面底部的调试日志区域 |
| **错误分析** | 智能分析错误原因 | 自动显示在日志中，提供解决建议 |

### 🔧 常见问题解决

#### Q: 仍然遇到网络错误怎么办？
**A: 按以下步骤排查：**
1. **强制刷新页面** - `Ctrl+F5` (Windows) 或 `Cmd+Shift+R` (Mac)
2. **检查调试日志** - 查看页面底部的详细错误信息
3. **运行网络诊断** - 点击"网络诊断"按钮检测连接状态
4. **尝试测试页面** - 访问 `http://localhost:8888/test-fixed-api.html`

#### Q: API Key配置问题？
**A: 验证步骤：**
- 确保API Key格式正确（以`sk-`开头）
- 点击"测试连接"验证可用性
- 检查API账户余额是否充足
- 查看调试日志中的具体错误信息

#### Q: 图片生成失败？
**A: 可能原因和解决方案：**
- **提示词问题** - 简化描述，避免敏感词汇
- **网络问题** - 使用网络诊断工具检测
- **API限制** - 检查账户配额和频率限制
- **平台故障** - 系统会自动切换到备用平台

### 📊 成功指标

**当看到以下信息时，说明系统正常运行：**

✅ **启动成功**:
```
🔧 Failed to fetch 错误修复补丁已加载
✅ 增强的网络请求功能已启用
🔄 自动重试机制已激活
⏰ 60秒超时保护已设置
```

✅ **API连接成功**:
```
✅ 连接测试成功!
🔗 使用API: [平台名称]
📡 响应时间: [毫秒]ms
```

✅ **图片生成成功**:
```
🖼️ 图片生成成功
🔗 图片URL: https://...
📊 使用平台: [云雾API/APICore]
```

## 🌐 API端点详解

### 🔗 OpenRouter API (图片分析)
```bash
POST https://openrouter.ai/api/v1/chat/completions
```
**支持模型**: GPT-4o Mini, Claude-3, Gemini Pro等  
**用途**: 图片分析和AI提示词生成

### ☁️ 云雾API (主要图片生成)
系统会按优先级自动尝试以下端点：
```bash
POST https://yunwu.ai/v1/images/generations      # 优先
POST https://yunwu.ai/api/v1/images/generations  # 备用1
POST https://yunwu.ai/v1/chat/completions        # 备用2
POST https://yunwu.ai/v1/generate                # 备用3
POST https://yunwu.ai/api/generate               # 备用4
POST https://yunwu.ai/generate                   # 备用5
```
**模型**: sora_image  
**特点**: 多端点自动切换，提高成功率

### 🔧 APICore API (备用图片生成)
```bash
POST https://api.apicore.ai/v1/images/generations
```
**模型**: sora_image  
**参数**: prompt, size, quality, response_format, n  
**特点**: 完全符合OpenAI API规范

### 📊 智能路由策略
```
用户请求
    ↓
1. 尝试云雾API（6个端点）
    ↓ (失败时)
2. 自动切换到APICore
    ↓ (失败时)  
3. 显示详细错误信息和解决建议
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