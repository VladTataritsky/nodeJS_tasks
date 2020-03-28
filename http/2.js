const http = require("http");
const url = require("url");

http.createServer((req, res) => {
  let result;
  if (req.method === 'GET') {
    let q = url.parse(req.url, true).query;
    let p = url.parse(req.url, true);
    if (p.pathname === '/SUM') {
      result = `x + y = ${Number(q.x) + Number(q.y)}`;
    }
    if (p.pathname === '/SUB') {
      result = `x - y = ${Number(q.x) - Number(q.y)}`;
    }
    else if (p.pathname === '/CONC') {
      result = `x + y = ${q.x + q.y}`;
    }
    res.writeHead(200, {'Content-Type': 'text/plane; charset=utf-8'});
    res.end(result);
  }
  else {
    res.writeHead(200, {'Content-Type': 'text/plane; charset=utf-8'});
    res.end('for other http-mathods not so')
  }
}).listen(40001, "localhost", () => {
  console.log("Сервер начал прослушивание запросов на порту 40001");
});