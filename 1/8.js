const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/download/ffff.xxx') {
    fs.readFile(`.${req.url}`, (err, content) => {
      res.setHeader("Content-disposition", "attachment; filename=file.txt");
      res.end(content);
    })
  } else {
    res.end('for other http-mathods not so')
  }
}).listen(40001, "127.0.0.1", () => {
  console.log("Сервер начал прослушивание запросов на порту 40001");
});
