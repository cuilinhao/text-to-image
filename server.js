const express = require('express');
const path = require('path');
const app = express();
const port = 8888;

// 静态文件服务
app.use(express.static('.'));

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'sora_image.html'));
});

app.listen(port, () => {
  console.log(`🚀 服务器运行在 http://localhost:${port}`);
  console.log('📱 Sora Image Demo 已启动');
});