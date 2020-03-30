let http = require("http");

let server = http.createServer();

let handler = (req, res) => {
  if (req.method === "GET") {
    if (req.url === '/') {
      let temp = `<!DOCTYPE html>
      <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <link rel="stylesheet" href="9.css">
        <script src="9.js" defer></script>
      </head>
      <body>
      <form>
      <input name="x">
        <input name="y">
        <input type="button" value="SUM">
        <input type="button" value='SUB'>
        <input type="button" value="CONC">
        <input type="button" value="CANCEL">
        </form>
        <p id="result"></p>
        </body>
        </html>`;
      res.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
      res.end(temp);
    }
    else if (req.url === '/9.css') {
      let css = `body {background-color: gainsboro;}`;
      res.writeHead(200, {"Content-type": "text/css; charset=utf-8"});
      res.end(css);
    }

    else if (req.url === '/9.js') {
      let js = `
      let x = document.getElementsByTagName('input')[0];
      let y = document.getElementsByTagName('input')[1];
      let result = document.getElementById('result');
      document.addEventListener('click', () => {
        if (event.target.value === 'SUM') {
          result.innerHTML = Number(x.value) + Number(y.value);
        }
        if (event.target.value === 'SUB') {
          result.innerHTML = Number(x.value) - Number(y.value);
        }
        if (event.target.value === 'CONC') {
          result.innerHTML = x.value + y.value;
        }
        if (event.target.value === 'CANCEL') {
          result.innerHTML = 'CANCEL';
        }
      });`;
      res.writeHead(200, {"Content-type": "text/javascript; charset=utf-8"});
      res.end(js);
    }
  }
};

server.on("request", handler);
server.listen(40001, "127.0.0.http", () => {
  console.log("Сервер начал прослушивание запросов на порту 40001");
});

