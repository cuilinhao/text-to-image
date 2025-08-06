const fs = require('fs');
const path = require('path');

// 你的API Key
const YUNWU_API_KEY = 'sk-VTv4s0IaV72yIgzMYIhvW6pg0h5ikOxeGMPq6ovHB8gi1U5q';

// 从CSV文件读取测试提示词
function loadTestPromptsFromCSV() {
    try {
        const csvPath = path.join(__dirname, 'public', '工作簿4-木子年华.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        
        console.log('📄 读取CSV文件内容...');
        const lines = csvContent.split('\n').filter(line => line.trim());
        const prompts = [];
        
        // 跳过标题行，从第二行开始读取
        for (let i = 1; i < lines.length; i++) {
            const columns = lines[i].split(',');
            if (columns.length >= 2) {
                const prompt = columns[1].trim(); // 文生图prompt列
                if (prompt) {
                    prompts.push(prompt);
                }
            }
        }
        
        console.log(`✅ 从CSV文件读取到 ${prompts.length} 个提示词`);
        return prompts;
    } catch (error) {
        console.log(`⚠️ 读取CSV文件失败: ${error.message}`);
        return [];
    }
}

// 使用可用的API端点和格式
const WORKING_APIS = [
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
    },
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
    }
];

// 测试单个API调用
async function testAPI(api, prompt, promptIndex) {
    console.log(`\n🔍 测试 ${api.name} - 提示词${promptIndex + 1}`);
    console.log(`📍 端点: ${api.endpoint}`);
    console.log(`📝 提示词: ${prompt.substring(0, 50)}...`);
    
    const requestBody = api.createRequest(prompt);
    console.log(`📦 请求体:`, JSON.stringify(requestBody, null, 2));
    
    try {
        const response = await fetch(api.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${YUNWU_API_KEY}`,
                'User-Agent': 'Sora-Image-Demo/1.0'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ 成功响应:`, JSON.stringify(data, null, 2));
            
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
                            imageUrl, 
                            api: api.name,
                            prompt: prompt.substring(0, 100) + '...',
                            responseData: data
                        };
                    } else {
                        console.log(`⚠️ 图片URL不可访问 (${imageResponse.status})`);
                        return { 
                            success: false, 
                            error: `图片URL不可访问: ${imageResponse.status}`,
                            imageUrl,
                            api: api.name
                        };
                    }
                } catch (urlError) {
                    console.log(`⚠️ 验证图片URL时出错: ${urlError.message}`);
                    return { 
                        success: true, // 仍然认为API调用成功
                        imageUrl, 
                        api: api.name,
                        prompt: prompt.substring(0, 100) + '...',
                        responseData: data,
                        urlWarning: urlError.message
                    };
                }
            } else {
                console.log(`⚠️ 无法从响应中提取图片URL`);
                return { 
                    success: false, 
                    error: '无法提取图片URL', 
                    api: api.name,
                    responseData: data 
                };
            }
        } else {
            const errorText = await response.text();
            console.log(`❌ 错误响应: ${errorText}`);
            
            try {
                const errorData = JSON.parse(errorText);
                return { 
                    success: false, 
                    error: errorData, 
                    status: response.status,
                    api: api.name
                };
            } catch (e) {
                return { 
                    success: false, 
                    error: errorText, 
                    status: response.status,
                    api: api.name
                };
            }
        }
        
    } catch (error) {
        console.log(`💥 请求异常: ${error.message}`);
        return { 
            success: false, 
            error: error.message,
            api: api.name
        };
    }
}

// 批量测试所有提示词
async function testAllPrompts() {
    console.log('🚀 开始优化的云雾API测试...');
    console.log(`🔑 使用API Key: ${YUNWU_API_KEY.substring(0, 10)}...${YUNWU_API_KEY.substring(-10)}`);
    
    const prompts = loadTestPromptsFromCSV();
    if (prompts.length === 0) {
        console.log('❌ 没有找到测试提示词，退出测试');
        return;
    }
    
    const results = [];
    
    for (let promptIndex = 0; promptIndex < prompts.length; promptIndex++) {
        const prompt = prompts[promptIndex];
        
        console.log(`\n${'='.repeat(80)}`);
        console.log(`📝 测试提示词 ${promptIndex + 1}/${prompts.length}`);
        console.log(`${'='.repeat(80)}`);
        
        for (const api of WORKING_APIS) {
            const result = await testAPI(api, prompt, promptIndex);
            results.push({
                promptIndex: promptIndex + 1,
                ...result
            });
            
            // 如果成功，可以选择跳过其他API测试同一个提示词
            if (result.success) {
                console.log(`🎉 提示词${promptIndex + 1}测试成功，继续下一个提示词`);
                break; // 跳过其他API，测试下一个提示词
            }
            
            // 添加延迟避免请求过频
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    // 输出测试总结
    console.log(`\n${'='.repeat(80)}`);
    console.log('📊 测试总结');
    console.log(`${'='.repeat(80)}`);
    
    const successResults = results.filter(r => r.success);
    const failResults = results.filter(r => !r.success);
    
    console.log(`✅ 成功: ${successResults.length} 个`);
    console.log(`❌ 失败: ${failResults.length} 个`);
    console.log(`📈 成功率: ${((successResults.length / results.length) * 100).toFixed(1)}%`);
    
    if (successResults.length > 0) {
        console.log('\n🎯 成功生成的图片:');
        successResults.forEach((r, index) => {
            console.log(`${index + 1}. 提示词${r.promptIndex} (${r.api})`);
            console.log(`   📝 ${r.prompt}`);
            console.log(`   🖼️ ${r.imageUrl}`);
            if (r.urlWarning) {
                console.log(`   ⚠️ ${r.urlWarning}`);
            }
            console.log('');
        });
    }
    
    if (failResults.length > 0) {
        console.log('\n💥 失败的测试:');
        failResults.forEach((r, index) => {
            console.log(`${index + 1}. 提示词${r.promptIndex} (${r.api}): ${typeof r.error === 'object' ? JSON.stringify(r.error) : r.error}`);
        });
    }
    
    // 保存详细测试报告
    const reportPath = 'optimized-api-test-report.json';
    const report = {
        timestamp: new Date().toISOString(),
        apiKey: YUNWU_API_KEY.substring(0, 10) + '...' + YUNWU_API_KEY.substring(-10),
        totalTests: results.length,
        successCount: successResults.length,
        failCount: failResults.length,
        successRate: ((successResults.length / results.length) * 100).toFixed(1) + '%',
        workingAPIs: WORKING_APIS.map(api => api.name),
        results: results
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 详细测试报告已保存到: ${reportPath}`);
    
    return results;
}

// 主函数
async function main() {
    try {
        await testAllPrompts();
    } catch (error) {
        console.error('❌ 测试过程中发生错误:', error);
    }
}

// 运行测试
if (require.main === module) {
    main();
}

module.exports = { testAllPrompts, WORKING_APIS };