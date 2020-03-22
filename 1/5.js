const http = require("http");
const url = require("url");

http.createServer((req, res) => {

  if (req.method === 'POST') {
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(`{
      name: 'Alex',
      age: 22,
      number: 12345678,
      country: 'Poland'
    }`);
  } else{
    res.end('Is not a POST method');
  }

}).listen(40001, "127.0.0.1", () => {
  console.log("Сервер начал прослушивание запросов на порту 40001");
});