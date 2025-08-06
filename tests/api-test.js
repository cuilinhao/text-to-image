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
        console.log('📝 使用默认测试提示词...');
        return [
            "一个咖啡杯头的芭蕾舞妈妈，表情惊恐，穿着粉色芭蕾舞裙，怀里抱着一个可爱的咖啡杯头宝宝，正在公园的小径上奔跑。她身后，一个表情邪恶的肉桂棒人手持球棒追赶。中景，正面视角，阳光明媚的公园背景。电影场景，写实风格，高清画质，细节清晰，光线充足，3D渲染。ratio 9:16",
            "一个邪恶微笑的肉桂棒人，抓着一个哇哇大哭的咖啡杯头宝宝，在公园小径上奔跑。中景，阳光明媚的公园背景。电影场景，写实风格，高清画质，细节清晰，光线充足，3D渲染。ratio 9:16"
        ];
    }
}

// 测试用的提示词
const TEST_PROMPTS = loadTestPromptsFromCSV();

// API端点列表（按优先级）
const API_ENDPOINTS = [
    'https://yunwu.ai/v1/images/generations',
    'https://yunwu.ai/api/v1/images/generations', 
    'https://yunwu.ai/v1/generate',
    'https://yunwu.ai/api/generate',
    'https://yunwu.ai/generate',
    'https://yunwu.ai/v1/chat/completions'
];

// 请求格式列表
function getRequestFormats(promptText) {
    return [
        // 格式1: OpenAI风格的图像生成
        {
            prompt: promptText,
            model: "sora_image",
            n: 1,
            size: "1024x1024"
        },
        // 格式2: 聊天完成风格
        {
            model: "sora_image",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant."
                },
                {
                    role: "user",
                    content: promptText
                }
            ]
        },
        // 格式3: 简单提示词格式
        {
            prompt: promptText,
            model: "sora_image"
        }
    ];
}

// 测试单个API调用
async function testSingleAPI(endpoint, requestBody, promptIndex, formatIndex) {
    console.log(`\n🔍 测试: ${endpoint} + 格式${formatIndex + 1} + 提示词${promptIndex + 1}`);
    console.log(`📦 请求体:`, JSON.stringify(requestBody, null, 2));
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${YUNWU_API_KEY}`,
                'User-Agent': 'Sora-Image-Demo/1.0'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
        console.log(`📋 响应头:`, Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ 成功响应:`, JSON.stringify(data, null, 2));
            
            // 尝试提取图片URL
            let imageUrl = null;
            
            // 方法1: 检查choices格式
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                const content = data.choices[0].message.content;
                const urlMatch = content.match(/https?:\/\/[^\s"'\],}]+(?:\.png|\.jpg|\.jpeg|\.gif|\.webp)/i);
                if (urlMatch) {
                    imageUrl = urlMatch[0];
                }
            }
            
            // 方法2: 检查data数组格式
            if (!imageUrl && data.data && Array.isArray(data.data) && data.data.length > 0) {
                if (data.data[0].url) {
                    imageUrl = data.data[0].url;
                } else if (data.data[0].b64_json) {
                    imageUrl = `data:image/png;base64,${data.data[0].b64_json}`;
                }
            }
            
            // 方法3: 检查直接字段
            if (!imageUrl) {
                if (data.image_url) {
                    imageUrl = data.image_url;
                } else if (data.url) {
                    imageUrl = data.url;
                } else if (data.result && data.result.url) {
                    imageUrl = data.result.url;
                }
            }
            
            if (imageUrl) {
                console.log(`🖼️ 提取到图片URL: ${imageUrl.substring(0, 100)}...`);
                return { success: true, imageUrl, endpoint, format: formatIndex + 1 };
            } else {
                console.log(`⚠️ 无法从响应中提取图片URL`);
                return { success: false, error: '无法提取图片URL', data };
            }
            
        } else {
            const errorText = await response.text();
            console.log(`❌ 错误响应: ${errorText}`);
            
            try {
                const errorData = JSON.parse(errorText);
                console.log(`📄 结构化错误:`, JSON.stringify(errorData, null, 2));
                return { success: false, error: errorData, status: response.status };
            } catch (e) {
                return { success: false, error: errorText, status: response.status };
            }
        }
        
    } catch (error) {
        console.log(`💥 请求异常: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// 测试所有组合
async function testAllCombinations() {
    console.log('🚀 开始测试云雾API...');
    console.log(`🔑 使用API Key: ${YUNWU_API_KEY.substring(0, 10)}...${YUNWU_API_KEY.substring(-10)}`);
    
    const results = [];
    
    for (let promptIndex = 0; promptIndex < TEST_PROMPTS.length; promptIndex++) {
        const prompt = TEST_PROMPTS[promptIndex];
        const requestFormats = getRequestFormats(prompt);
        
        console.log(`\n📝 测试提示词 ${promptIndex + 1}: ${prompt.substring(0, 50)}...`);
        
        for (let endpointIndex = 0; endpointIndex < API_ENDPOINTS.length; endpointIndex++) {
            const endpoint = API_ENDPOINTS[endpointIndex];
            
            for (let formatIndex = 0; formatIndex < requestFormats.length; formatIndex++) {
                const requestBody = requestFormats[formatIndex];
                
                const result = await testSingleAPI(endpoint, requestBody, promptIndex, formatIndex);
                results.push({
                    promptIndex: promptIndex + 1,
                    endpoint,
                    format: formatIndex + 1,
                    ...result
                });
                
                // 如果成功，记录并继续测试下一个提示词
                if (result.success) {
                    console.log(`🎉 找到可用组合: ${endpoint} + 格式${formatIndex + 1}`);
                    break;
                }
                
                // 添加延迟避免请求过频
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    
    // 输出测试总结
    console.log('\n📊 测试总结:');
    console.log('='.repeat(80));
    
    const successResults = results.filter(r => r.success);
    const failResults = results.filter(r => !r.success);
    
    console.log(`✅ 成功: ${successResults.length} 个`);
    console.log(`❌ 失败: ${failResults.length} 个`);
    
    if (successResults.length > 0) {
        console.log('\n🎯 成功的组合:');
        successResults.forEach(r => {
            console.log(`  - 提示词${r.promptIndex}: ${r.endpoint} + 格式${r.format}`);
        });
    }
    
    if (failResults.length > 0) {
        console.log('\n💥 失败的组合:');
        failResults.forEach(r => {
            console.log(`  - 提示词${r.promptIndex}: ${r.endpoint} + 格式${r.format} - ${r.error}`);
        });
        
        // 分析错误类型
        const errorTypes = {};
        failResults.forEach(r => {
            const errorKey = typeof r.error === 'object' ? r.error.message || r.error.type : r.error;
            errorTypes[errorKey] = (errorTypes[errorKey] || 0) + 1;
        });
        
        console.log('\n📈 错误类型统计:');
        Object.entries(errorTypes).forEach(([error, count]) => {
            console.log(`  - ${error}: ${count} 次`);
        });
    }
    
    return results;
}

// 网络诊断
async function diagnoseNetwork() {
    console.log('\n🔍 开始网络诊断...');
    
    // 1. 检查基本网络连接
    try {
        console.log('1️⃣ 检查基本网络连接...');
        const response = await fetch('https://www.google.com/favicon.ico', { 
            method: 'HEAD', 
            signal: AbortSignal.timeout(5000)
        });
        console.log('✅ 基本网络连接正常');
    } catch (e) {
        console.log('❌ 基本网络连接异常:', e.message);
    }
    
    // 2. 检查云雾域名解析
    try {
        console.log('2️⃣ 检查云雾域名解析...');
        const start = Date.now();
        const response = await fetch('https://yunwu.ai', { 
            method: 'HEAD',
            signal: AbortSignal.timeout(10000)
        });
        const time = Date.now() - start;
        console.log(`✅ yunwu.ai 域名解析正常 (${time}ms, 状态: ${response.status})`);
    } catch (e) {
        console.log('❌ yunwu.ai 域名解析失败:', e.message);
    }
    
    // 3. 检查API端点可达性
    console.log('3️⃣ 检查API端点可达性...');
    for (const endpoint of API_ENDPOINTS) {
        try {
            const start = Date.now();
            const response = await fetch(endpoint, { 
                method: 'OPTIONS',
                signal: AbortSignal.timeout(10000)
            });
            const time = Date.now() - start;
            console.log(`✅ ${endpoint} 可达 (${time}ms, 状态: ${response.status})`);
        } catch (e) {
            console.log(`❌ ${endpoint} 不可达: ${e.message}`);
        }
    }
}

// 主函数
async function main() {
    console.log('🎯 云雾API测试工具');
    console.log('='.repeat(80));
    
    // 先进行网络诊断
    await diagnoseNetwork();
    
    // 然后进行API测试
    const results = await testAllCombinations();
    
    // 保存测试结果
    const reportPath = 'api-test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        apiKey: YUNWU_API_KEY.substring(0, 10) + '...' + YUNWU_API_KEY.substring(-10),
        results
    }, null, 2));
    
    console.log(`\n📄 测试报告已保存到: ${reportPath}`);
}

// 运行测试
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testAllCombinations, diagnoseNetwork };