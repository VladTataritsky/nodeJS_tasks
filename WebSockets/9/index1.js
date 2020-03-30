const rpcWSC = WebSocket = require("rpc-websockets").Client
let ws = new rpcWSC("ws://localhost:4000");
let k = 0;

ws.on("open", () => {
  const timer = setInterval(() => ws.notify("notify1", {n: ++k}), 1000);

  setTimeout(() => {
    clearInterval(timer);
  }, 10000);
});
ws.on("error", e => console.log("error = ", e));