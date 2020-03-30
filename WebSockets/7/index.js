const rpcWSC = WebSocket = require("rpc-websockets").Client
let ws = new rpcWSC("ws://localhost:4000");

ws.on("open", () => {
  ws.call("sum", [11, 22]).then(r => console.log("sum = ", r));
  ws.call("mul", [7, 2, 11]).then(r => console.log("mul = ", r));

  ws.login({login: "1234", password: "1234"})
    .then (login => {
      if (login) {
        ws.call("conc", [444,555,666]).then(r => console.log("conc = ", r));
      } else {
        console.log("login error");
      }
    });
});

ws.on("error", e => console.log("error = ", e));