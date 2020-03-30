const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
    res.end(fs.readFileSync("./index.html"));
  }
});
server.listen(3000);

let clients = 0;
const wsServer = new WebSocket.Server({port: 4000, host: "localhost", path: "/wsserver"});
wsServer.on("connection", ws => {
  clients++;

  wsServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`Clients quantity: ${clients}`);
    }
  });

  ws.on("message", message => {
    wsServer.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`"message": ${message}`);
      }
    });
  });

  ws.on("close", () => {
    clients--;

    wsServer.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Clients quantity: ${clients}`);
      }
    });
  });

  setInterval(() => {
    console.log("server: ping");
    ws.ping("server: ping");
  }, 5000);
});
wsServer.on("error", err => console.log("WS server error", err));