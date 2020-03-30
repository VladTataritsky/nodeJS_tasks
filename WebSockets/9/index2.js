const rpcWSC = WebSocket = require("rpc-websockets").Client
let ws = new rpcWSC("ws://localhost:4000");
let k = 0;

ws.on("open", () => {
  const timer = setInterval(() => ws.notify("notify2", {n: ++k}), 500);

  setTimeout(() => {
    clearInterval(timer);
    console.log("Client has stopped generate notify");
  }, 10000);
});
ws.on("error", e => console.log("error = ", e));