# 🎨 Sora Image Demo - 批量图片生成器

基于云雾AI的智能图片生成工具，支持图转提示词和故事分镜批量生成。

## ✨ 特性

- 🖼️ **图转提示词**: 上传图片自动生成AI绘画提示词
- 📖 **故事分镜**: 批量生成故事分镜图片
- 🔄 **自动重试**: 网络异常时自动重试机制
- ⏰ **超时保护**: 60秒请求超时保护
- 🌐 **网络诊断**: 内置网络连接诊断工具
- 📊 **详细日志**: 实时显示操作状态和错误信息

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

```bash
npm install
```

### 启动服务

```bash
npm run dev
```

### 访问应用

- 主页面: http://localhost:8888
- 修复测试页面: http://localhost:8888/test-fixed-api.html
- 优化测试页面: http://localhost:8888/test-optimized-api.html

## 🔧 配置

### API Key 配置

在页面中输入你的云雾API Key：
```
sk-VTv4s0IaV72yIgzMYIhvW6pg0h5ikOxeGMPq6ovHB8gi1U5q
```

### 支持的API端点

- `https://yunwu.ai/v1/chat/completions` (推荐)
- `https://yunwu.ai/v1/images/generations` (备用)

## 📁 项目结构

```
text-to-image/
├── src/                    # 源代码
│   ├── fix-fetch-error.js  # 网络错误修复补丁
│   └── yunwu-api-patch.js  # API优化补丁
├── tests/                  # 测试文件
│   ├── api-test.js         # API测试脚本
│   ├── optimized-api-test.js # 优化API测试
│   └── test-*.js           # 其他测试文件
├── scripts/                # 工具脚本
│   ├── integrate-fix-to-main.js # 修复集成脚本
│   └── verify-integration.js   # 集成验证脚本
├── docs/                   # 文档
│   ├── API_Documentation.md    # API文档
│   └── USAGE_GUIDE.md          # 使用指南
├── public/                 # 静态文件
│   ├── 工作簿4-木子年华.csv    # 测试数据
│   ├── test-fixed-api.html     # 修复测试页面
│   └── test-optimized-api.html # 优化测试页面
├── sora_image.html         # 主页面 (已集成修复)
├── server.js               # 服务器文件
├── package.json            # 项目配置
└── README.md               # 项目说明
```

## 🎯 功能说明

### 图转提示词

1. 上传参考图片
2. 配置OpenRouter API Key
3. 选择AI模型 (推荐GPT-4o Mini)
4. 生成AI绘画提示词
5. 使用云雾API生成图片

### 故事分镜

1. 输入故事描述或导入CSV文件
2. 自动生成分镜脚本
3. 为每个分镜指定参考图片
4. 批量生成所有分镜图片

## 🔍 故障排除

### Failed to fetch 错误

项目已集成自动修复方案：
- ✅ 自动重试机制 (3次)
- ✅ 超时控制 (60秒)
- ✅ 详细错误分析
- ✅ 网络诊断工具

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| API连接失败 | 检查API Key，使用网络诊断 |
| 图片生成失败 | 简化提示词，避免敏感内容 |
| 页面加载异常 | 清除缓存，强制刷新 |

## 🧪 测试

### 运行API测试

```bash
node tests/api-test.js
```

### 运行优化测试

```bash
node tests/optimized-api-test.js
```

### 验证集成状态

```bash
node scripts/verify-integration.js
```

## 📊 API支持

### OpenRouter API
- 用途: AI提示词生成
- 支持模型: GPT-4o Mini, Claude-3, Gemini等
- 端点: `https://openrouter.ai/api/v1/chat/completions`

### 云雾API
- 用途: 图片生成
- 模型: sora_image
- 端点: `https://yunwu.ai/v1/chat/completions`

## 🔒 安全说明

- API Key仅在客户端使用，不会上传到服务器
- 支持密码类型输入框隐藏API Key
- 生成的图片链接来自官方CDN

## 📝 更新日志

### v1.2.0 (最新)
- ✅ 修复 Failed to fetch 网络错误
- ✅ 集成自动重试机制
- ✅ 添加超时保护
- ✅ 增强网络诊断功能
- ✅ 优化API调用成功率

### v1.1.0
- ✅ 支持故事分镜批量生成
- ✅ 添加CSV导入功能
- ✅ 优化用户界面

### v1.0.0
- ✅ 基础图转提示词功能
- ✅ 云雾API集成
- ✅ OpenRouter API支持

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目。

## 📄 许可证

MIT License

## 🙏 致谢

- [云雾AI](https://yunwu.ai) - 图片生成API
- [OpenRouter](https://openrouter.ai) - AI模型API
- [Express.js](https://expressjs.com) - Web服务器框架