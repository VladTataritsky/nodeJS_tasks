const WebSocket = require("ws");
const ws = new WebSocket("ws:/localhost:4000/wsserver");

let k = 0;
const id = process.argv[2];


ws.on("open", () => {
  setInterval(() => {
    ws.send(`client: ${id},message: ${++k}`);
  }, 3000);

  ws.on("message", message => {
    if (message.indexOf("Clients quantity:") === -1) {
      console.log(`${message}`);
    }
  });

  ws.on("ping", data => console.log("on ping:", data.toString()));
});