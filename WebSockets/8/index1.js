const rpcWSC = WebSocket = require("rpc-websockets").Client
let ws = new rpcWSC("ws://localhost:4000");

ws.on("open", () => {
  ws.subscribe("AAA");
  ws.subscribe("BBB");

  ws.on("AAA", p => console.log("AAA:", p));
  ws.on("BBB", p => console.log("BBB:", p));
});
ws.on("error", e => console.log("error = ", e));