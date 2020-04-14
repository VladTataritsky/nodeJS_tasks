const WebSocket = require("ws");
const ws = new WebSocket("ws:/localhost:4000");

ws.on("open", () => {
  ws.on("message", message => {
    console.log("server -> client", message);
  });
});