const http = require("http");
const url = require("url");
let qs = require("querystring");

let handler = ((req, res) => {

  if (req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    const temp = `
    <form method="post" action="/">
      <input type ="text" name="x">
      <input type ="text" name="y">
      <input formaction="/SUM" type="submit" value="SUM">
      <input formaction="/SUB" type="submit" value="SUB">
      <input formaction="/CONC" type="submit" value="CONC">
      <input formaction="/CANCEL" type="submit" value="CANCEL">
    </form>
    `;
    res.end(temp);
  }
  else if (req.method === 'POST') {
    res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
    let result = '';
    req.on('data', (data) => {
      result += data;
    });
    req.on('end', () => {
      let q = qs.parse(result);
      let p = url.parse(req.url, true);
      if (p.pathname === '/SUM') {
        res.write(`x + y = ${+(q["x"]) + +(q["y"])}`);
      }
      else if (p.pathname === '/SUB') {
        res.write(`x - y = ${+(q["x"]) - +(q["y"])}`);
      }
      else if (p.pathname === '/CONC') {
        res.write(`x + y = ${q["x"]}${q["y"]}`);
      }
      else if (p.pathname === '/CANCEL'){
        res.write("CANCEL");
      }
      res.end();
    })
  } else {
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      console.log('err');
  }
});
let server = http.createServer();

server.listen(40001, "127.0.0.1", () => {
  console.log("Сервер начал прослушивание запросов на порту 40001");
}).on('request', handler);