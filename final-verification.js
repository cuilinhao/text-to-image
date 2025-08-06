// APICore 修复验证脚本
const https = require('https');

const API_KEY = 'sk-U1KUgGJjGdIPXhq6Lfpo9U7Zp7SkjIYis7gIN2m76YDI4sqh';

console.log('🔧 APICore 修复验证开始...');
console.log('🔑 使用API Key:', API_KEY.substring(0, 15) + '...');

// 修复后的请求数据
const requestData = {
    prompt: '一个可爱的小猫咪在花园里玩耍，阳光明媚，色彩鲜艳',
    model: 'sora_image',
    n: 1,
    size: '1024x1024',
    quality: 'hd',
    response_format: 'url'
};

const postData = JSON.stringify(requestData);

console.log('📦 修复后的请求数据:');
console.log(JSON.stringify(requestData, null, 2));

const options = {
    hostname: 'api.apicore.ai',
    port: 443,
    path: '/v1/images/generations',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'User-Agent': 'APICore-Fix/1.0',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 120000 // 2分钟超时
};

console.log('🚀 发送修复后的请求...');

const req = https.request(options, (res) => {
    console.log(`📊 响应状态: ${res.statusCode} ${res.statusMessage}`);
    console.log('📋 响应头:', JSON.stringify(res.headers, null, 2));
    
    let responseData = '';
    
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    
    res.on('end', () => {
        console.log('📄 完整响应:');
        console.log(responseData);
        
        if (res.statusCode === 200) {
            try {
                const result = JSON.parse(responseData);
                console.log('✅ 解析成功!');
                console.log('🎉 修复验证通过!');
                
                if (result.data && result.data[0] && result.data[0].url) {
                    console.log('🖼️ 图片URL:', result.data[0].url);
                    console.log('🎊 APICore调用完全成功!');
                } else {
                    console.log('⚠️ 响应格式异常，但API调用成功');
                }
            } catch (e) {
                console.log('❌ JSON解析失败:', e.message);
                console.log('📄 原始响应:', responseData);
            }
        } else {
            console.log('❌ API调用失败');
            console.log('📄 错误响应:', responseData);
            
            // 分析错误原因
            try {
                const errorData = JSON.parse(responseData);
                console.log('🔍 错误分析:', errorData.error?.message || '未知错误');
            } catch (e) {
                console.log('🔍 无法解析错误信息');
            }
        }
    });
});

req.on('error', (error) => {
    console.log('💥 请求错误:', error.message);
    console.log('🔧 可能的解决方案:');
    console.log('  1. 检查网络连接');
    console.log('  2. 验证API Key是否正确');
    console.log('  3. 确认APICore服务状态');
});

req.on('timeout', () => {
    console.log('⏰ 请求超时 (2分钟)');
    console.log('🔧 建议:');
    console.log('  1. APICore服务器响应较慢');
    console.log('  2. 可以尝试稍后重试');
    console.log('  3. 检查网络连接稳定性');
    req.destroy();
});

req.write(postData);
req.end();

console.log('⏳ 等待APICore响应...');