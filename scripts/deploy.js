#!/usr/bin/env node

// 部署脚本
const fs = require('fs');
const path = require('path');

console.log('🚀 开始部署 Sora Image Demo...\n');

// 检查必要文件
const requiredFiles = [
  'sora_image.html',
  'server.js',
  'package.json',
  'src/fix-fetch-error.js'
];

console.log('📋 检查必要文件...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 文件缺失`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ 部署失败：缺少必要文件');
  process.exit(1);
}

// 检查依赖
console.log('\n📦 检查依赖...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`✅ 项目名称: ${packageJson.name}`);
  console.log(`✅ 版本: ${packageJson.version}`);
  console.log(`✅ 依赖数量: ${Object.keys(packageJson.dependencies || {}).length}`);
} catch (error) {
  console.log('❌ package.json 读取失败');
  process.exit(1);
}

// 检查修复状态
console.log('\n🔧 检查修复状态...');
const htmlContent = fs.readFileSync('sora_image.html', 'utf8');

const fixChecks = [
  {
    name: 'Failed to fetch 修复',
    test: htmlContent.includes('Failed to fetch 错误修复补丁已加载')
  },
  {
    name: '自动重试机制',
    test: htmlContent.includes('maxRetries = 3')
  },
  {
    name: '超时控制',
    test: htmlContent.includes('AbortSignal.timeout(60000)')
  }
];

fixChecks.forEach(check => {
  console.log(`${check.test ? '✅' : '❌'} ${check.name}`);
});

// 生成部署信息
const deployInfo = {
  timestamp: new Date().toISOString(),
  version: JSON.parse(fs.readFileSync('package.json', 'utf8')).version,
  files: requiredFiles.filter(file => fs.existsSync(file)),
  fixes: fixChecks.filter(check => check.test).map(check => check.name),
  status: 'ready'
};

fs.writeFileSync('deploy-info.json', JSON.stringify(deployInfo, null, 2));

console.log('\n🎉 部署检查完成！');
console.log('📄 部署信息已保存到 deploy-info.json');
console.log('\n🚀 启动命令:');
console.log('   npm start  或  npm run dev');
console.log('\n📱 访问地址:');
console.log('   http://localhost:8888');