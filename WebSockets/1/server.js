const http = require("http");
const WebSocket = require('ws');

http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    let temp = `<!DOCTYPE html>
      <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>Title</title>
      </head>
      <body>
        <h1>WS</h1>
        <script>
            let k = 0;
            let socket;
            const startWS = () => {
              socket = new WebSocket('ws:/localhost:4000/ws');
              socket.onopen = () => {document.documentElement.innerHTML += '<br>socket.onopen';
                setInterval(() => {socket.send(++k)}, 2000)
                };
                socket.onclose = (e) => {document.documentElement.innerHTML += '<br> socket.onclose' + e};

              socket.onmessage = (e) => {document.documentElement.innerHTML += '<br> message: ' + e.data };
              socket.onerror = (error) => {alert('error: ' + error.message)};
            };
            const stopWS = () => {
              socket.close();
            }
        </script>
        <button onclick="startWS()">startWS</button>
        <button onclick="stopWS()">stopWS</button>
      </body>
      </html>`;
    res.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
    res.end(temp);
  } else {
    res.end('for other http-mathods not so')
  }
}).listen(3000, "localhost", () => {
  console.log("Сервер начал прослушивание запросов на порту 3000");
});

let k = 0;
const wsserver = new WebSocket.Server({port: 4000, host: 'localhost', path: '/ws'});
wsserver.on('connection', (ws) => {
  ws.on('message', message => {
    console.log(`Recieved message => ${message}`)
  });
  setInterval(() => {
    ws.send(`server ${++k}`)
  }, 3000);
});

wsserver.on('error', (e) => {
  console.log('ws error', e)
});
console.log(`ws server host: ${wsserver.options.host},port: ${wsserver.options.port}, path: ${wsserver.options.path}`);