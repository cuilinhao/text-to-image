#!/usr/bin/env node

/**
 * 安全检查脚本 - 检查项目中是否还有硬编码的API Key
 */

const fs = require('fs');
const path = require('path');

// API Key 模式
const API_KEY_PATTERNS = [
    /sk-[A-Za-z0-9]{48}/g,  // OpenAI/APICore 格式
    /sk-[A-Za-z0-9]{40,}/g, // 通用 sk- 格式
];

// 需要检查的文件扩展名
const FILE_EXTENSIONS = ['.html', '.js', '.md', '.json', '.ts', '.jsx', '.tsx'];

// 排除的目录
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build'];

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            if (!EXCLUDED_DIRS.includes(file)) {
                getAllFiles(filePath, fileList);
            }
        } else {
            const ext = path.extname(file);
            if (FILE_EXTENSIONS.includes(ext)) {
                fileList.push(filePath);
            }
        }
    });
    
    return fileList;
}

function checkFileForApiKeys(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const findings = [];
        
        API_KEY_PATTERNS.forEach((pattern, index) => {
            const matches = content.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    const lines = content.split('\n');
                    lines.forEach((line, lineNumber) => {
                        if (line.includes(match)) {
                            findings.push({
                                file: filePath,
                                line: lineNumber + 1,
                                match: match,
                                context: line.trim()
                            });
                        }
                    });
                });
            }
        });
        
        return findings;
    } catch (error) {
        console.error(`❌ 读取文件失败: ${filePath} - ${error.message}`);
        return [];
    }
}

function main() {
    console.log('🔍 开始安全检查...\n');
    
    const projectRoot = process.cwd();
    const allFiles = getAllFiles(projectRoot);
    
    console.log(`📁 检查 ${allFiles.length} 个文件...\n`);
    
    let totalFindings = 0;
    const fileFindings = {};
    
    allFiles.forEach(file => {
        const findings = checkFileForApiKeys(file);
        if (findings.length > 0) {
            fileFindings[file] = findings;
            totalFindings += findings.length;
        }
    });
    
    if (totalFindings === 0) {
        console.log('✅ 安全检查通过！');
        console.log('🔐 未发现硬编码的API Key');
        console.log(`📊 已检查 ${allFiles.length} 个文件`);
    } else {
        console.log(`❌ 发现 ${totalFindings} 个潜在的API Key！\n`);
        
        Object.entries(fileFindings).forEach(([file, findings]) => {
            console.log(`📄 文件: ${file}`);
            findings.forEach(finding => {
                console.log(`   第 ${finding.line} 行: ${finding.match}`);
                console.log(`   上下文: ${finding.context}`);
            });
            console.log('');
        });
        
        console.log('🔧 请手动清除这些API Key！');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { checkFileForApiKeys, getAllFiles };