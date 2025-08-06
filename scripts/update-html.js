const fs = require('fs');

// 读取原始HTML文件
let htmlContent = fs.readFileSync('sora_image.html', 'utf8');

// 读取优化补丁
const patchContent = fs.readFileSync('yunwu-api-patch.js', 'utf8');

// 在HTML文件的</body>标签前插入优化补丁
const insertPosition = htmlContent.lastIndexOf('</body>');
if (insertPosition !== -1) {
    const beforeBody = htmlContent.substring(0, insertPosition);
    const afterBody = htmlContent.substring(insertPosition);
    
    const optimizedHtml = beforeBody + 
        '\n    <!-- 云雾API优化补丁 -->\n' +
        '    <script>\n' +
        patchContent +
        '\n    </script>\n' +
        '\n    <script>\n' +
        '        // 替换原有的测试连接函数\n' +
        '        if (typeof testYunwuConnection !== "undefined") {\n' +
        '            window.testYunwuConnectionOriginal = testYunwuConnection;\n' +
        '        }\n' +
        '        window.testYunwuConnection = testYunwuConnectionOptimized;\n' +
        '        \n' +
        '        // 替换原有的生成函数\n' +
        '        if (typeof generateSingleImage !== "undefined") {\n' +
        '            window.generateSingleImageOriginal = generateSingleImage;\n' +
        '        }\n' +
        '        window.generateSingleImage = generateSingleImageOptimized;\n' +
        '        \n' +
        '        console.log("✅ 云雾API已优化，使用基于测试结果的高成功率端点");\n' +
        '    </script>\n' +
        afterBody;
    
    // 写入优化后的HTML文件
    fs.writeFileSync('sora_image_optimized.html', optimizedHtml);
    console.log('✅ 已创建优化版本: sora_image_optimized.html');
    
    // 备份原文件并替换
    fs.writeFileSync('sora_image_backup.html', htmlContent);
    fs.writeFileSync('sora_image.html', optimizedHtml);
    console.log('✅ 已更新原文件，备份保存为: sora_image_backup.html');
    
} else {
    console.error('❌ 无法找到</body>标签');
}