const http = require("http");
const fs = require("fs");

let handler = ((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end('<form  method="post" action ="/" enctype="multipart/form-data">\n' +
      '    <input type="file">\n' +
      '    <input type="submit" name="upload" value="OK">\n' +
      '    <input type="submit" name="cancel" value="CANCEL">\n' +
      '</form>')
  } else if (req.method === 'POST') {
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