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
    res.end(`You made a ${req.method} request! But you should to do POST request`);
  }
};

server.on("request", handler);
server.listen(40001, "127.0.0.1", () => {
  console.log("Сервер начал прослушивание запросов на порту 40001");
});