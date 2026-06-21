const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3035;

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'dist', 'index.html');
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(500);
      res.end('Error loading page');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Customer Web running on: http://localhost:${PORT}`);
});
