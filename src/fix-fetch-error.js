// 修复 Failed to fetch 错误的补丁

// 增强的fetch函数，添加更多错误处理和重试机制
async function enhancedFetch(url, options = {}) {
    const maxRetries = 3;
    const retryDelay = 2000; // 2秒
    
    // 默认选项
    const defaultOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Sora-Image-Demo/1.0',
            ...options.headers
        },
        // 添加超时控制
        signal: AbortSignal.timeout(60000), // 60秒超时
        ...options
    };
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🔄 尝试第 ${attempt} 次请求: ${url}`);
            
            const response = await fetch(url, defaultOptions);
            
            console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
            
            // 如果响应成功，直接返回
            if (response.ok) {
                return response;
            }
            
            // 如果是客户端错误（4xx），不重试
            if (response.status >= 400 && response.status < 500) {
                console.log(`❌ 客户端错误 (${response.status})，不重试`);
                return response;
            }
            
            // 服务器错误（5xx），可以重试
            if (response.status >= 500 && attempt < maxRetries) {
                console.log(`⚠️ 服务器错误 (${response.status})，${retryDelay/1000}秒后重试...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                continue;
            }
            
            return response;
            
        } catch (error) {
            console.log(`❌ 请求异常 (尝试 ${attempt}/${maxRetries}): ${error.message}`);
            
            // 分析错误类型
            if (error.name === 'AbortError') {
                console.log('⏰ 请求超时');
            } else if (error.message.includes('Failed to fetch')) {
                console.log('🌐 网络连接问题');
            } else if (error.message.includes('CORS')) {
                console.log('🔒 跨域问题');
            }
            
            // 如果是最后一次尝试，抛出错误
            if (attempt === maxRetries) {
                throw new Error(`请求失败 (${maxRetries}次尝试): ${error.message}`);
            }
            
            // 等待后重试
            console.log(`⏳ ${retryDelay/1000}秒后重试...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
}

// 优化的云雾API调用函数（修复版）
async function callYunwuAPIFixed(prompt, refImageData = null) {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) {
        throw new Error('请输入云雾API Key');
    }

    // 基于测试结果的API配置
    const workingAPIs = [
        {
            name: 'Chat Completions API',
            endpoint: 'https://yunwu.ai/v1/chat/completions',
            createRequest: (prompt) => ({
                model: "sora_image",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            }),
            extractImageUrl: (data) => {
                if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                    const content = data.choices[0].message.content;
                    const urlMatch = content.match(/https?:\/\/[^\s"'\],})\n]+(?:\.png|\.jpg|\.jpeg|\.gif|\.webp)/i);
                    if (urlMatch) {
                        return urlMatch[0];
                    }
                }
                return null;
            }
        },
        {
            name: 'Images Generation API',
            endpoint: 'https://yunwu.ai/v1/images/generations',
            createRequest: (prompt) => ({
                prompt: prompt,
                model: "sora_image",
                n: 1,
                size: "1024x1024"
            }),
            extractImageUrl: (data) => {
                if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                    return data.data[0].url;
                }
                return null;
            }
        }
    ];

    let lastError = null;

    // 尝试可用的API端点
    for (const api of workingAPIs) {
        try {
            console.log(`🔍 尝试 ${api.name}: ${api.endpoint}`);
            
            const requestBody = api.createRequest(prompt);
            console.log(`📦 请求体:`, requestBody);

            // 使用增强的fetch函数
            const response = await enhancedFetch(api.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'User-Agent': 'Sora-Image-Demo/1.0'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ 成功响应:`, data);
                
                const imageUrl = api.extractImageUrl(data);
                if (imageUrl) {
                    console.log(`🖼️ 提取到图片URL: ${imageUrl}`);
                    
                    return {
                        success: true,
                        imageUrl: imageUrl,
                        endpoint: api.endpoint,
                        apiName: api.name
                    };
                } else {
                    console.log(`⚠️ 无法从响应中提取图片URL`);
                    lastError = new Error('无法从响应中提取图片URL');
                }
            } else {
                const errorText = await response.text();
                console.log(`❌ 错误响应: ${errorText}`);
                
                try {
                    const errorData = JSON.parse(errorText);
                    lastError = new Error(`HTTP ${response.status}: ${errorData.error?.message || errorText}`);
                } catch (e) {
                    lastError = new Error(`HTTP ${response.status}: ${errorText}`);
                }
            }
        } catch (error) {
            console.log(`💥 请求异常: ${error.message}`);
            lastError = error;
        }

        // 添加延迟避免请求过频
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    throw lastError || new Error('所有API端点都失败了');
}

// 修复版的单个图片生成函数
async function generateSingleImageFixed(apiKey, promptText, refImageData, groupIndex, imageIndex) {
    const debug = document.getElementById('debug');
    const requestId = `${groupIndex + 1}-${imageIndex + 1}`;
    
    debug.textContent += `\n\n🔍 [${requestId}] 开始处理图片生成请求 (修复版)`;
    debug.textContent += `\n📝 [${requestId}] 提示词: ${promptText.substring(0, 100)}...`;
    
    try {
        const result = await callYunwuAPIFixed(promptText, refImageData);
        
        debug.textContent += `\n🎉 [${requestId}] 图片生成成功!`;
        debug.textContent += `\n🔗 [${requestId}] 使用API: ${result.apiName}`;
        debug.textContent += `\n🖼️ [${requestId}] 图片URL: ${result.imageUrl.substring(0, 50)}...`;
        
        return {
            url: result.imageUrl,
            prompt: promptText,
            groupIndex: groupIndex,
            imageIndex: imageIndex,
            apiUsed: result.apiName,
            endpoint: result.endpoint
        };
        
    } catch (error) {
        debug.textContent += `\n💥 [${requestId}] 生成失败: ${error.message}`;
        
        // 提供更详细的错误信息和建议
        if (error.message.includes('Failed to fetch')) {
            debug.textContent += `\n💡 [${requestId}] 建议: 检查网络连接，尝试刷新页面`;
        } else if (error.message.includes('timeout')) {
            debug.textContent += `\n💡 [${requestId}] 建议: 请求超时，请稍后重试`;
        } else if (error.message.includes('401')) {
            debug.textContent += `\n💡 [${requestId}] 建议: API Key可能无效，请检查`;
        }
        
        throw error;
    }
}

// 导出修复版函数
window.callYunwuAPIFixed = callYunwuAPIFixed;
window.generateSingleImageFixed = generateSingleImageFixed;
window.enhancedFetch = enhancedFetch;

console.log('🔧 Failed to fetch 错误修复补丁已加载');