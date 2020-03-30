const rpcWSC = WebSocket = require("rpc-websockets").Client
let ws = new rpcWSC("ws://localhost:4000");

ws.on("open", () => {
  ws.subscribe("CCC");
  ws.on("CCC", p => console.log("CCC:", p));
});
ws.on("error", e => console.log("error = ", e));