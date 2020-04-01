const WebSocket = require("ws");
const ws = new WebSocket("ws:/localhost:4000");

ws.on("open", () => {
  ws.on("message", message => {
    const obj = JSON.parse(message);
    console.log("server -> client", obj);
  });
  let obj = {"id": 4, "name": "Комаров А.А.", "bday": "2000-04-02", "specility":"ПОИТ"};
  ws.send(JSON.stringify(obj))
});