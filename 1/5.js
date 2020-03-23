const http = require("http");
const url = require("url");

http.createServer((req, res) => {

  if (req.method === 'POST') {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    let obj = {
      name: 'Alex',
      age: 22,
      number: 12345678,
      country: 'Poland'
    };
    res.end(`SERVER: ${JSON.stringify(obj)}`);
  } else{
    res.end('Is not a POST method');
  }

}).listen(40001, "127.0.0.1", () => {
  console.log("Сервер начал прослушивание запросов на порту 40001");
});