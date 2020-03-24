const http = require("http");
const fs = require("fs");

let handler = ((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    let temp = `<form  method="post" action ="/" enctype="multipart/form-data">
                    <input type="file">
                    <input type="submit" name="upload" value="OK"> 
                    <input type="submit" name="cancel" value="CANCEL">
                </form>`;
    res.end(temp)
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
  } else {
    res.end('for other http-mathods not so')
  }
});
let server = http.createServer();

server.listen(40001, "127.0.0.1", () => {
  console.log("Сервер начал прослушивание запросов на порту 40001");
}).on('request', handler);