const http = require("http");
const url = require("url");

http.createServer((req, res) => {

  if (req.method === 'POST') {
    res.writeHead(200, {'Content-Type': 'application/xml; charset=utf-8'});
    res.end(`<SERVER>
xml
</SERVER>
`);
  } else {
    res.end('Is not a POST method');
  }
}).listen(40001, "localhost", () => {
  console.log("Сервер начал прослушивание запросов на порту 40001");
});