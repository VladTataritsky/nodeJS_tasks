const http = require("http");
const url = require("url");

let handler = ((req, res) => {

  if (req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end('<form method=’post’ action ="/" enctype="multipart/form-data"><input name="x"><input name="y"><button formaction="/SUM">SUM</button><button formaction="/SUB">SUB</button><button formaction="/CONC">CONC</button><button formaction="/CANCEL">CANCEL</button></form>');
  }
  else if (req.method === 'POST') {
   /* let result = '---';
    let q = url.parse(req.url, true).query;
    let p = url.parse(req.url, true);
    if (p.pathname === '/SUM') {
      result = `x + y = ${Number(q.x) + Number(q.y)}`;
    }
    if (p.pathname === '/SUB') {
      result = `x - y = ${Number(q.x) - Number(q.y)}`;
    }
    if (p.pathname === '/CONC') {
      result = `x + y = ${q.x + q.y}`;
    }
    res.writeHead(200, {'Content-Type': 'text/plane; charset=utf-8'});
    res.end(result);*/
    let result = '';
    req.on('data', (data) => {
      result += data;
    });
    req.on('end', () => {
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      console.log('файл получен');
      res.end(result)
    })
  }
});
let server = http.createServer();

server.listen(40001, "127.0.0.1", () => {
  console.log("Сервер начал прослушивание запросов на порту 40001");
}).on('request', handler);