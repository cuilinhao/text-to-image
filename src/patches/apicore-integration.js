// APICore平台集成补丁
// 添加对APICore平台sora_image模型的支持

// APICore API调用函数
async function callAPICore(prompt, apiKey, options = {}) {
    const {
        size = "1024x1024",
        quality = "hd",
        response_format = "url",
        n = 1
    } = options;

    console.log('🔍 调用APICore API...');
    console.log(`📝 提示词: ${prompt.substring(0, 100)}...`);
    console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);

    const requestBody = {
        prompt: prompt,
        model: "sora_image",
        n: n,
        size: size,
        quality: quality,
        response_format: response_format
    };

    console.log('📦 请求体:', requestBody);

    try {
        const response = await enhancedFetch('https://api.apicore.ai/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'User-Agent': 'Sora-Image-Demo/1.0'
            },
            body: JSON.stringify(requestBody)
        });

        console.log(`📊 APICore响应状态: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ APICore成功响应:', data);

            // 提取图片URL
            if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                const imageUrl = data.data[0].url || data.data[0].b64_json;
                if (imageUrl) {
                    console.log(`🖼️ 提取到图片URL: ${imageUrl.substring(0, 50)}...`);
                    return {
                        success: true,
                        imageUrl: imageUrl,
                        platform: 'APICore',
                        model: 'sora_image',
                        created: data.created
                    };
                }
            }

            throw new Error('无法从APICore响应中提取图片URL');
        } else {
            const errorText = await response.text();
            console.log(`❌ APICore错误响应: ${errorText}`);
            
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(`APICore API错误: ${errorData.error?.message || errorText}`);
            } catch (e) {
                throw new Error(`APICore API错误 (${response.status}): ${errorText}`);
            }
        }
    } catch (error) {
        console.log(`💥 APICore请求异常: ${error.message}`);
        throw error;
    }
}

// 测试APICore连接
async function testAPICoreConnection(apiKey) {
    const debug = document.getElementById('debug');
    
    debug.textContent += '\n\n🔍 开始测试APICore连接...\n';
    debug.textContent += `🔑 API Key: ${apiKey.substring(0, 10)}...\n`;

    try {
        const result = await callAPICore('测试图片生成', apiKey, {
            size: "512x512",
            n: 1
        });

        debug.textContent += `✅ APICore连接测试成功!\n`;
        debug.textContent += `🏢 平台: ${result.platform}\n`;
        debug.textContent += `🤖 模型: ${result.model}\n`;
        debug.textContent += `🖼️ 测试图片: ${result.imageUrl}\n`;

        return result;
    } catch (error) {
        debug.textContent += `❌ APICore连接测试失败: ${error.message}\n`;
        throw error;
    }
}

// 增强的图片生成函数，支持多平台
async function generateImageMultiPlatform(promptText, platforms, groupIndex, imageIndex) {
    const debug = document.getElementById('debug');
    const requestId = `${groupIndex + 1}-${imageIndex + 1}`;
    
    debug.textContent += `\n\n🔍 [${requestId}] 开始多平台图片生成`;
    debug.textContent += `\n📝 [${requestId}] 提示词: ${promptText.substring(0, 100)}...`;
    debug.textContent += `\n🏢 [${requestId}] 可用平台: ${platforms.map(p => p.name).join(', ')}`;

    let lastError = null;

    // 按优先级尝试各个平台
    for (const platform of platforms) {
        try {
            debug.textContent += `\n🔍 [${requestId}] 尝试平台: ${platform.name}`;
            
            let result;
            
            if (platform.name === 'APICore') {
                result = await callAPICore(promptText, platform.apiKey, {
                    size: platform.size || "1024x1024",
                    quality: platform.quality || "hd",
                    n: 1
                });
            } else if (platform.name === '云雾API') {
                result = await callYunwuAPIFixed(promptText);
            } else {
                throw new Error(`不支持的平台: ${platform.name}`);
            }

            debug.textContent += `\n🎉 [${requestId}] ${platform.name} 生成成功!`;
            debug.textContent += `\n🖼️ [${requestId}] 图片URL: ${result.imageUrl.substring(0, 50)}...`;

            return {
                url: result.imageUrl,
                prompt: promptText,
                groupIndex: groupIndex,
                imageIndex: imageIndex,
                platform: platform.name,
                model: result.model || 'sora_image'
            };

        } catch (error) {
            debug.textContent += `\n❌ [${requestId}] ${platform.name} 失败: ${error.message}`;
            lastError = error;
            
            // 如果不是最后一个平台，继续尝试下一个
            if (platform !== platforms[platforms.length - 1]) {
                debug.textContent += `\n🔄 [${requestId}] 尝试下一个平台...`;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // 所有平台都失败了
    debug.textContent += `\n💥 [${requestId}] 所有平台都失败了`;
    throw lastError || new Error('所有图片生成平台都不可用');
}

// 获取配置的平台列表
function getConfiguredPlatforms() {
    const platforms = [];
    
    // 检查云雾API
    const yunwuApiKey = document.getElementById('apiKey')?.value;
    if (yunwuApiKey) {
        platforms.push({
            name: '云雾API',
            apiKey: yunwuApiKey,
            priority: 1
        });
    }
    
    // 检查APICore
    const apicoreApiKey = document.getElementById('apicoreApiKey')?.value;
    if (apicoreApiKey) {
        platforms.push({
            name: 'APICore',
            apiKey: apicoreApiKey,
            priority: 2,
            size: document.getElementById('apicoreSize')?.value || "1024x1024",
            quality: document.getElementById('apicoreQuality')?.value || "hd"
        });
    }
    
    // 按优先级排序
    platforms.sort((a, b) => a.priority - b.priority);
    
    return platforms;
}

// 导出函数供全局使用
window.callAPICore = callAPICore;
window.testAPICoreConnection = testAPICoreConnection;
window.generateImageMultiPlatform = generateImageMultiPlatform;
window.getConfiguredPlatforms = getConfiguredPlatforms;

console.log('✅ APICore平台集成补丁已加载');