const { chromium } = require('playwright');

async function testSoraImageDemo() {
    console.log('🚀 开始测试 Sora Image Demo...');
    
    // 启动浏览器
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // 访问页面
        console.log('📱 访问页面...');
        await page.goto('http://localhost:8888');
        
        // 等待页面加载
        await page.waitForSelector('h1', { timeout: 5000 });
        
        // 检查页面标题
        const title = await page.textContent('h1');
        console.log(`✅ 页面标题: ${title}`);
        
        // 测试标签页切换功能
        console.log('🔄 测试标签页切换...');
        
        // 检查初始状态 - 图转提示词应该是激活的
        const imageToPromptTab = await page.locator('.tab-content#imageToPrompt');
        const storyPromptTab = await page.locator('.tab-content#storyPrompt');
        
        const isImageTabActive = await imageToPromptTab.getAttribute('class');
        console.log(`📋 图转提示词标签页状态: ${isImageTabActive}`);
        
        // 点击故事提示词标签
        console.log('👆 点击故事提示词标签...');
        await page.click('.tab-button:has-text("故事提示词")');
        
        // 等待一下让切换完成
        await page.waitForTimeout(500);
        
        // 检查切换后的状态
        const isStoryTabActive = await storyPromptTab.getAttribute('class');
        console.log(`📋 故事提示词标签页状态: ${isStoryTabActive}`);
        
        if (isStoryTabActive.includes('active')) {
            console.log('✅ 故事提示词标签页切换成功！');
        } else {
            console.log('❌ 故事提示词标签页切换失败！');
        }
        
        // 切换回图转提示词
        console.log('👆 切换回图转提示词标签...');
        await page.click('.tab-button:has-text("图转提示词")');
        await page.waitForTimeout(500);
        
        const isImageTabActiveAgain = await imageToPromptTab.getAttribute('class');
        if (isImageTabActiveAgain.includes('active')) {
            console.log('✅ 图转提示词标签页切换成功！');
        } else {
            console.log('❌ 图转提示词标签页切换失败！');
        }
        
        // 测试调试日志功能
        console.log('🔍 测试调试日志功能...');
        
        // 检查调试日志区域是否存在
        const debugArea = await page.locator('#debug');
        const debugText = await debugArea.textContent();
        console.log(`📝 调试日志内容: ${debugText.substring(0, 50)}...`);
        
        // 测试清空日志按钮
        console.log('🧹 测试清空日志按钮...');
        await page.click('text=清空日志');
        await page.waitForTimeout(500);
        
        const debugTextAfterClear = await debugArea.textContent();
        console.log(`📝 清空后日志内容: ${debugTextAfterClear}`);
        
        if (debugTextAfterClear.includes('日志已清空')) {
            console.log('✅ 清空日志功能正常！');
        } else {
            console.log('❌ 清空日志功能异常！');
        }
        
        // 测试网络诊断功能
        console.log('🌐 测试网络诊断功能...');
        await page.click('text=网络诊断');
        
        // 等待诊断完成
        await page.waitForTimeout(3000);
        
        const debugTextAfterDiagnose = await debugArea.textContent();
        if (debugTextAfterDiagnose.includes('开始网络诊断')) {
            console.log('✅ 网络诊断功能启动成功！');
        } else {
            console.log('❌ 网络诊断功能启动失败！');
        }
        
        // 测试API连接测试功能
        console.log('🔑 测试API连接测试功能...');
        
        // 输入一个测试API Key
        await page.fill('#apiKey', 'test-api-key-12345');
        
        // 点击测试连接按钮
        await page.click('#testYunwuBtn');
        
        // 等待测试完成
        await page.waitForTimeout(5000);
        
        const debugTextAfterApiTest = await debugArea.textContent();
        if (debugTextAfterApiTest.includes('开始测试云雾API连接')) {
            console.log('✅ API连接测试功能启动成功！');
        } else {
            console.log('❌ API连接测试功能启动失败！');
        }
        
        // 检查页面上的主要元素
        console.log('🔍 检查页面主要元素...');
        
        const elements = [
            { selector: '#openrouterKey', name: 'OpenRouter API Key输入框' },
            { selector: '#modelSelect', name: '模型选择下拉框' },
            { selector: '#metaPrompt', name: '元提示词文本框' },
            { selector: '#generatePromptBtn', name: '生成Prompts按钮' },
            { selector: '#generateBtn', name: '批量生成图片按钮' },
            { selector: '#imageCount', name: '生成数量输入框' }
        ];
        
        for (const element of elements) {
            try {
                await page.waitForSelector(element.selector, { timeout: 1000 });
                console.log(`✅ ${element.name} 存在`);
            } catch (error) {
                console.log(`❌ ${element.name} 不存在或不可见`);
            }
        }
        
        // 测试故事提示词页面的元素
        console.log('📖 切换到故事提示词页面测试元素...');
        await page.click('.tab-button:has-text("故事提示词")');
        await page.waitForTimeout(500);
        
        const storyElements = [
            { selector: '#storyMetaPrompt', name: '故事元提示词文本框', shouldBeVisible: true },
            { selector: '#generateStoryBtn', name: '生成故事脚本按钮', shouldBeVisible: true },
            { selector: '#csvFileInput', name: 'CSV文件输入', shouldBeVisible: false }, // 隐藏的文件输入
            { selector: '#batchImageCount', name: '批量生成数量输入框', shouldBeVisible: false } // 在隐藏的编辑器区域中
        ];
        
        for (const element of storyElements) {
            try {
                const elementExists = await page.locator(element.selector).count() > 0;
                if (elementExists) {
                    if (element.shouldBeVisible) {
                        const isVisible = await page.locator(element.selector).isVisible();
                        if (isVisible) {
                            console.log(`✅ ${element.name} 存在且可见`);
                        } else {
                            console.log(`⚠️ ${element.name} 存在但不可见`);
                        }
                    } else {
                        console.log(`✅ ${element.name} 存在 (预期隐藏)`);
                    }
                } else {
                    console.log(`❌ ${element.name} 不存在`);
                }
            } catch (error) {
                console.log(`❌ ${element.name} 检查失败: ${error.message}`);
            }
        }
        
        console.log('🎉 测试完成！');
        
    } catch (error) {
        console.error('❌ 测试过程中发生错误:', error.message);
    } finally {
        // 关闭浏览器
        await browser.close();
    }
}

// 运行测试
testSoraImageDemo().catch(console.error);