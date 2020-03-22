const http = require("http");

http.createServer((req, res) => {
  if (req.method === 'GET' || req.method === 'POST') {
    res.writeHead(200, {'Content-Type': 'text/plane; charset=utf-8'});
    res.end(`${req.method}:${req.url}`);
  } else {
    res.end('for other http-mathods not so')
  }
}).listen(40001, "127.0.0.1", () => {
  console.log("Сервер начал прослушивание запросов на порту 40001");
});