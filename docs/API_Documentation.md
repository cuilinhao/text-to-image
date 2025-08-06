# Sora Image Demo API 调用文档

## 概述

本项目集成了两个主要的AI服务：
1. **OpenRouter API** - 用于AI提示词生成
2. **云雾API (yunwu.ai)** - 用于图像生成

## 1. OpenRouter API

### 1.1 基本信息
- **服务商**: OpenRouter
- **用途**: AI提示词生成和聊天完成
- **认证方式**: Bearer Token

### 1.2 API端点

#### 1.2.1 聊天完成接口
- **请求接口**: `https://openrouter.ai/api/v1/chat/completions`
- **请求方法**: POST
- **内容类型**: application/json

#### 1.2.2 请求头 (Headers)
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_OPENROUTER_API_KEY",
  "HTTP-Referer": "当前页面URL",
  "X-Title": "Sora Image Demo"
}
```

#### 1.2.3 请求参数详解

##### 基础参数
| 参数名 | 类型 | 必填 | 描述 | 示例值 |
|--------|------|------|------|--------|
| model | string | 是 | 使用的AI模型 | "openai/gpt-4o-mini" |
| messages | array | 是 | 对话消息数组 | 见下方消息格式 |
| max_tokens | number | 否 | 最大生成token数 | 2000 |

##### 支持的模型列表
- `openai/gpt-4o-mini` (默认)
- `openai/gpt-4.1-mini`
- `openai/gpt-4-vision-preview`
- `openai/gpt-4o`
- `anthropic/claude-3-opus`
- `anthropic/claude-3-sonnet`
- `google/gemini-pro-vision`

##### 消息格式 (Messages)

**纯文本消息**:
```json
{
  "role": "user",
  "content": "请根据上传的图片，生成一个详细的AI绘画提示词..."
}
```

**包含图片的消息**:
```json
{
  "role": "user", 
  "content": [
    {
      "type": "text",
      "text": "请根据上传的图片，生成一个详细的AI绘画提示词..."
    },
    {
      "type": "image_url",
      "image_url": {
        "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      }
    }
  ]
}
```

#### 1.2.4 完整请求示例

**纯文本请求**:
```json
{
  "model": "openai/gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": "你是一位AI图像提示词造型师，专攻将任意角色形象..."
    }
  ],
  "max_tokens": 2000
}
```

**图片分析请求**:
```json
{
  "model": "openai/gpt-4o-mini", 
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "请根据上传的图片，生成一个详细的AI绘画提示词..."
        },
        {
          "type": "image_url", 
          "image_url": {
            "url": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAA..."
          }
        }
      ]
    }
  ],
  "max_tokens": 2000
}
```

#### 1.2.5 响应格式

**成功响应**:
```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion", 
  "created": 1677858242,
  "model": "openai/gpt-4o-mini",
  "usage": {
    "prompt_tokens": 13,
    "completion_tokens": 150,
    "total_tokens": 163
  },
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "主题：咖啡杯娃娃婴儿超模T台秀，完美复刻原版五官神韵..."
      },
      "finish_reason": "stop"
    }
  ]
}
```

**错误响应**:
```json
{
  "error": {
    "message": "Invalid API key provided",
    "type": "invalid_request_error",
    "param": null,
    "code": "invalid_api_key"
  }
}
```

## 2. 云雾API (yunwu.ai)

### 2.1 基本信息
- **服务商**: 云雾AI
- **用途**: 图像生成
- **认证方式**: Bearer Token
- **模型**: sora_image

### 2.2 API端点 (按优先级尝试)

项目会按以下顺序尝试不同的端点：

1. `https://yunwu.ai/v1/images/generations`
2. `https://yunwu.ai/api/v1/images/generations`
3. `https://yunwu.ai/v1/generate`
4. `https://yunwu.ai/api/generate`
5. `https://yunwu.ai/generate`
6. `https://yunwu.ai/v1/chat/completions`

### 2.3 请求头 (Headers)
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_YUNWU_API_KEY",
  "User-Agent": "Sora-Image-Demo/1.0"
}
```

### 2.4 请求格式 (按优先级尝试)

#### 2.4.1 格式1: OpenAI风格的图像生成
```json
{
  "prompt": "主题：咖啡杯娃娃婴儿超模T台秀，完美复刻原版五官神韵...",
  "model": "sora_image",
  "n": 1,
  "size": "1024x1024"
}
```

#### 2.4.2 格式2: 聊天完成风格
```json
{
  "model": "sora_image",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user", 
      "content": "主题：咖啡杯娃娃婴儿超模T台秀，完美复刻原版五官神韵..."
    }
  ]
}
```

#### 2.4.3 格式3: 简单提示词格式
```json
{
  "prompt": "主题：咖啡杯娃娃婴儿超模T台秀，完美复刻原版五官神韵...",
  "model": "sora_image"
}
```

#### 2.4.4 格式4: 包含垫图的格式
```json
{
  "prompt": "主题：咖啡杯娃娃婴儿超模T台秀，完美复刻原版五官神韵...",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "model": "sora_image"
}
```

### 2.5 请求参数详解

| 参数名 | 类型 | 必填 | 描述 | 示例值 |
|--------|------|------|------|--------|
| model | string | 是 | 固定为"sora_image" | "sora_image" |
| prompt | string | 是 | 图像生成提示词 | "主题：咖啡杯娃娃婴儿超模T台秀..." |
| n | number | 否 | 生成图片数量 | 1 |
| size | string | 否 | 图片尺寸 | "1024x1024" |
| image | string | 否 | 垫图的base64数据 | "data:image/jpeg;base64,..." |
| messages | array | 否 | 聊天消息格式 | 见上方示例 |

### 2.6 响应格式

#### 2.6.1 成功响应 (方式1: 直接返回图片URL)
```json
{
  "choices": [
    {
      "message": {
        "content": "https://example.com/generated-image.png"
      }
    }
  ]
}
```

#### 2.6.2 成功响应 (方式2: 数据数组格式)
```json
{
  "data": [
    {
      "url": "https://example.com/generated-image.png"
    }
  ]
}
```

#### 2.6.3 成功响应 (方式3: Base64格式)
```json
{
  "data": [
    {
      "b64_json": "iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
```

#### 2.6.4 异步响应 (需要轮询)
```json
{
  "task_id": "task_12345",
  "status": "processing"
}
```

#### 2.6.5 错误响应
```json
{
  "error": {
    "message": "Invalid URL (GET /v1/chat/completions)",
    "type": "invalid_request_error", 
    "param": "",
    "code": ""
  }
}
```

### 2.7 异步任务轮询

如果API返回任务ID，需要进行轮询查询：

**轮询请求**:
```json
{
  "model": "sora_image",
  "task_id": "task_12345",
  "action": "query_status"
}
```

**轮询响应**:
```json
{
  "status": "completed",
  "output": ["https://example.com/generated-image.png"]
}
```

## 3. 错误处理

### 3.1 常见错误类型

| 错误类型 | HTTP状态码 | 描述 | 解决方案 |
|----------|------------|------|----------|
| 认证失败 | 401 | API Key无效或过期 | 检查并更新API Key |
| 权限不足 | 403 | API Key权限不足或余额不足 | 检查账户余额和权限 |
| 端点不存在 | 404 | API端点不存在 | 检查URL是否正确 |
| 请求过频 | 429 | 请求过于频繁 | 稍后重试 |
| 服务器错误 | 500+ | 服务器内部错误 | 稍后重试 |
| SSL协议错误 | - | 网络连接问题 | 检查网络连接，关闭VPN |
| 请求超时 | - | 网络超时 | 检查网络连接质量 |

### 3.2 错误处理流程

1. **多端点尝试**: 系统会自动尝试多个API端点
2. **多格式尝试**: 每个端点会尝试不同的请求格式
3. **超时处理**: 设置60秒超时机制
4. **详细日志**: 记录完整的错误信息和调试日志
5. **用户提示**: 根据错误类型提供具体的解决建议

## 4. 使用流程

### 4.1 图转提示词流程
1. 用户上传参考图片
2. 调用OpenRouter API生成提示词
3. 使用生成的提示词调用云雾API生成图片
4. 显示生成结果

### 4.2 故事提示词流程  
1. 用户输入故事元提示词或导入CSV
2. 调用OpenRouter API生成故事脚本
3. 为每个分镜调用云雾API生成图片
4. 批量显示生成结果

## 5. 配置要求

### 5.1 必需的API Key
- **OpenRouter API Key**: 用于AI提示词生成
- **云雾API Key**: 用于图像生成

### 5.2 网络要求
- 支持HTTPS请求
- 无需VPN或代理 (云雾API)
- 稳定的网络连接

### 5.3 浏览器要求
- 支持现代JavaScript (ES6+)
- 支持Fetch API
- 支持FileReader API (用于图片上传)

## 6. 性能优化

### 6.1 图片压缩
- 自动将上传图片压缩到1024px以内
- 减少API请求大小，提高成功率

### 6.2 并发控制
- 支持批量处理多个请求
- 自动管理请求队列

### 6.3 缓存机制
- 本地存储生成结果
- 避免重复请求

## 7. 安全考虑

### 7.1 API Key保护
- 使用password类型输入框隐藏API Key
- 不在日志中记录完整的API Key

### 7.2 图片处理
- 仅支持常见图片格式
- 自动压缩减少数据传输

### 7.3 错误信息
- 详细的错误日志帮助调试
- 不暴露敏感系统信息