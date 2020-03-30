const WebSocket = require("ws");
const fs = require("fs");

const wss = new WebSocket.Server({port: 4000, host: "localhost"});
let i = 0;
wss.on("connection", ws => {
  const duplex = WebSocket.createWebSocketStream(ws, {encoding: "utf8"});
  let wfile = fs.createWriteStream(`./file_${++i}.txt`);
  duplex.pipe(wfile);
});
wss.on("error", err => console.log("WS server error", err));