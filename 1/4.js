const http = require("http");
const url = require("url");

http.createServer((req, res) => {
  if (req.method === 'POST') {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('any text');
  } else{
    res.end('Is not a POST method');

  }
}).listen(40001, "127.0.0.1", () => {
  console.log("Сервер начал прослушивание запросов на порту 40001");
});