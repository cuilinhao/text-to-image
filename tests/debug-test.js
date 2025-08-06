const { chromium } = require('playwright');

async function debugTest() {
    console.log('🔍 开始调试测试...');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // 监听控制台日志
    page.on('console', msg => {
        console.log(`🖥️ Console: ${msg.text()}`);
    });
    
    // 监听页面错误
    page.on('pageerror', error => {
        console.log(`❌ Page Error: ${error.message}`);
    });
    
    try {
        await page.goto('http://localhost:8888');
        await page.waitForSelector('h1');
        
        console.log('📋 检查标签页按钮...');
        
        // 检查按钮是否存在
        const imageTabButton = await page.locator('text=图转提示词');
        const storyTabButton = await page.locator('text=故事提示词');
        
        console.log(`✅ 图转提示词按钮存在: ${await imageTabButton.count()}`);
        console.log(`✅ 故事提示词按钮存在: ${await storyTabButton.count()}`);
        
        // 检查初始状态
        const imageTab = await page.locator('#imageToPrompt');
        const storyTab = await page.locator('#storyPrompt');
        
        console.log(`📋 初始状态 - 图转提示词: ${await imageTab.getAttribute('class')}`);
        console.log(`📋 初始状态 - 故事提示词: ${await storyTab.getAttribute('class')}`);
        
        // 点击故事提示词按钮
        console.log('👆 点击故事提示词按钮...');
        await page.click('.tab-button:has-text("故事提示词")');
        
        // 等待一下
        await page.waitForTimeout(1000);
        
        // 检查点击后的状态
        console.log(`📋 点击后状态 - 图转提示词: ${await imageTab.getAttribute('class')}`);
        console.log(`📋 点击后状态 - 故事提示词: ${await storyTab.getAttribute('class')}`);
        
        // 检查故事提示词页面的元素是否可见
        const storyElements = [
            '#storyMetaPrompt',
            '#generateStoryBtn', 
            '#csvFileInput',
            '#batchImageCount'
        ];
        
        for (const selector of storyElements) {
            try {
                const element = await page.locator(selector);
                const isVisible = await element.isVisible();
                console.log(`👁️ ${selector} 可见: ${isVisible}`);
            } catch (error) {
                console.log(`❌ ${selector} 检查失败: ${error.message}`);
            }
        }
        
        // 手动执行switchTab函数
        console.log('🔧 手动执行switchTab函数...');
        await page.evaluate(() => {
            console.log('🔧 Manual switchTab execution');
            if (typeof switchTab === 'function') {
                switchTab('storyPrompt');
            } else {
                console.error('❌ switchTab function not found');
            }
        });
        
        await page.waitForTimeout(1000);
        
        console.log(`📋 手动执行后状态 - 故事提示词: ${await storyTab.getAttribute('class')}`);
        
        // 保持浏览器打开一段时间以便观察
        console.log('⏳ 保持浏览器打开10秒以便观察...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ 调试测试出错:', error.message);
    } finally {
        await browser.close();
    }
}

debugTest().catch(console.error);