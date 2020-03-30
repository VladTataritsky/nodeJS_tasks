const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 4000, host: "localhost"});
wss.on("connection", ws => {
  ws.on("message", message => {
    const obj = JSON.parse(message);
    console.log("client -> server", obj);

    obj["z"] = +(obj["x"]) + +(obj["y"]);
    ws.send(JSON.stringify(obj));
  });
});
wss.on("error", err => console.log("WS server error", err));
