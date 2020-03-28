let http = require("http");

let server = http.createServer();

let handler = (req, res) => {
  if (req.method === "POST") {
    res.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
    let result = "SERVER:";
    req.on("data", data => {result += data});
    req.on("end", () => {
        res.write(result);
      res.end();
    });
  }
  else {
    res.end('Is not a POST method');
  }
};

server.on("request", handler);
server.listen(40001, "localhost", () => {
  console.log("Сервер начал прослушивание запросов на порту 40001");
});