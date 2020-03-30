const WebSocket = require("ws");
const ws = new WebSocket("ws:/localhost:4000/wsserver");
const duplex = new WebSocket.createWebSocketStream(ws, {encoding: "utf8"});

ws.on("open", () => {
  duplex.pipe(process.stdout);
  process.stdin.pipe(duplex);
});

process.stdout.write("Your message: \n");
