// 项目配置文件
module.exports = {
  // 服务器配置
  server: {
    port: 8888,
    host: 'localhost'
  },
  
  // API配置
  apis: {
    yunwu: {
      baseUrl: 'https://yunwu.ai',
      endpoints: {
        chatCompletions: '/v1/chat/completions',
        imageGenerations: '/v1/images/generations'
      },
      model: 'sora_image',
      timeout: 60000, // 60秒
      retries: 3
    },
    openrouter: {
      baseUrl: 'https://openrouter.ai',
      endpoint: '/api/v1/chat/completions',
      defaultModel: 'openai/gpt-4o-mini',
      supportedModels: [
        'openai/gpt-4o-mini',
        'openai/gpt-4.1-mini',
        'openai/gpt-4-vision-preview',
        'openai/gpt-4o',
        'anthropic/claude-3-opus',
        'anthropic/claude-3-sonnet',
        'google/gemini-pro-vision'
      ]
    }
  },
  
  // 功能配置
  features: {
    autoRetry: true,
    timeoutProtection: true,
    networkDiagnosis: true,
    detailedLogging: true,
    imageCompression: true,
    batchProcessing: true
  },
  
  // 文件路径配置
  paths: {
    main: 'sora_image.html',
    server: 'server.js',
    src: 'src/',
    tests: 'tests/',
    docs: 'docs/',
    public: 'public/',
    scripts: 'scripts/'
  },
  
  // 版本信息
  version: '1.2.0',
  lastUpdated: '2025-08-06',
  
  // 修复状态
  fixes: {
    fetchError: {
      status: 'applied',
      version: '1.2.0',
      description: 'Fixed Failed to fetch error with retry mechanism and timeout control'
    },
    apiOptimization: {
      status: 'applied', 
      version: '1.1.0',
      description: 'Optimized API calls based on test results'
    }
  }
};