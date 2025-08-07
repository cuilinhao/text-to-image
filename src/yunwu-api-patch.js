// 云雾API优化补丁 - 基于测试结果的API调用优化
// 这个补丁基于我们的测试结果，使用成功率最高的API端点和格式

// 优化后的云雾API调用函数
async function callYunwuAPIOptimized(prompt, refImageData = null) {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) {
        throw new Error('请输入云雾API Key');
    }

    // 基于测试结果，优先使用成功率高的API
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
                    // 提取图片URL
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

            const response = await fetch(api.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'User-Agent': 'Sora-Image-Demo/1.0'
                },
                body: JSON.stringify(requestBody)
            });

            console.log(`📊 响应状态: ${response.status} ${response.statusText}`);

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ 成功响应:`, data);
                
                const imageUrl = api.extractImageUrl(data);
                if (imageUrl) {
                    console.log(`🖼️ 提取到图片URL: ${imageUrl}`);
                    
                    // 验证图片URL是否可访问
                    try {
                        const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
                        if (imageResponse.ok) {
                            console.log(`✅ 图片URL可访问 (${imageResponse.status})`);
                            return {
                                success: true,
                                imageUrl: imageUrl,
                                endpoint: api.endpoint,
                                apiName: api.name
                            };
                        } else {
                            console.log(`⚠️ 图片URL不可访问 (${imageResponse.status})`);
                            lastError = new Error(`图片URL不可访问: ${imageResponse.status}`);
                        }
                    } catch (urlError) {
                        console.log(`⚠️ 验证图片URL时出错: ${urlError.message}`);
                        // 仍然返回成功，因为API调用本身是成功的
                        return {
                            success: true,
                            imageUrl: imageUrl,
                            endpoint: api.endpoint,
                            apiName: api.name,
                            urlWarning: urlError.message
                        };
                    }
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
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw lastError || new Error('所有API端点都失败了');
}

// 优化的单个图片生成函数
async function generateSingleImageOptimized(apiKey, promptText, refImageData, groupIndex, imageIndex) {
    const debug = document.getElementById('debug');
    const requestId = `${groupIndex + 1}-${imageIndex + 1}`;
    
    debug.textContent += `\n\n🔍 [${requestId}] 开始处理图片生成请求 (优化版)`;
    debug.textContent += `\n📝 [${requestId}] 提示词: ${promptText.substring(0, 100)}...`;
    
    try {
        const result = await callYunwuAPIOptimized(promptText, refImageData);
        
        debug.textContent += `\n🎉 [${requestId}] 图片生成成功!`;
        debug.textContent += `\n🔗 [${requestId}] 使用API: ${result.apiName}`;
        debug.textContent += `\n🖼️ [${requestId}] 图片URL: ${result.imageUrl.substring(0, 50)}...`;
        
        if (result.urlWarning) {
            debug.textContent += `\n⚠️ [${requestId}] URL验证警告: ${result.urlWarning}`;
        }
        
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
        throw error;
    }
}

// 优化的测试连接函数
async function testYunwuConnectionOptimized() {
    const apiKey = document.getElementById('apiKey').value;
    const testBtn = document.getElementById('testYunwuBtn');
    const debug = document.getElementById('debug');

    if (!apiKey) {
        alert('请输入云雾API Key');
        return;
    }

    testBtn.disabled = true;
    testBtn.textContent = '测试中...';
    debug.textContent += '\n\n🔍 开始测试云雾API连接 (优化版)...\n';

    try {
        const result = await callYunwuAPIOptimized('测试图片生成');
        
        debug.textContent += `\n✅ 连接测试成功!`;
        debug.textContent += `\n🔗 使用API: ${result.apiName}`;
        debug.textContent += `\n📍 端点: ${result.endpoint}`;
        debug.textContent += `\n🖼️ 测试图片: ${result.imageUrl}`;
        
        alert('✅ 云雾API连接测试成功!\n\n' + 
              `使用API: ${result.apiName}\n` +
              `端点: ${result.endpoint}\n` +
              `图片已生成: ${result.imageUrl.substring(0, 50)}...`);
              
    } catch (error) {
        debug.textContent += `\n❌ 连接测试失败: ${error.message}`;
        alert('❌ 云雾API连接测试失败:\n\n' + error.message);
    } finally {
        testBtn.disabled = false;
        testBtn.textContent = '测试连接';
    }
}

// 导出函数供全局使用
window.callYunwuAPIOptimized = callYunwuAPIOptimized;
window.generateSingleImageOptimized = generateSingleImageOptimized;
window.testYunwuConnectionOptimized = testYunwuConnectionOptimized;

console.log('✅ 云雾API优化补丁已加载');