const WebSocket = require("ws");
const ws = new WebSocket("ws:/localhost:4000");

ws.on("open", () => {
  ws.on("message", message => {
    const obj = JSON.parse(message);
    console.log("server -> client", obj);
  });
  const obj = {"x": 5, "y": 10};

  const timer = setInterval(() => {
    obj.x *= 2;
    obj.y += 15;
    ws.send(JSON.stringify(obj));
  }, 2000);

  setTimeout(() => {
    clearInterval(timer);
  }, 10000);

  setTimeout(() => {
    ws.close();
  }, 20000);
});