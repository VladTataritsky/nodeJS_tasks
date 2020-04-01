const http = require('http');
const fs = require("fs");
const WebSocket = require("ws");
const wss = new WebSocket.Server({port: 4000, host: "localhost"});
const url = require("url");

wss.on("connection", ws => {
  fs.watch("./copyStudents/", (event, filename) => {
    if (filename) {
      ws.send(`${filename} file Changed`);
    }
  });
});
wss.on("error", err => console.log("WS server error", err));

http.createServer((req, res) => {

  if (req.method === 'GET' && req.url === '/') {
    const obj = fs.readFileSync("./StudentList.json", "utf8");
    let students = JSON.parse(obj);
    res.writeHead(200, {"Content-type": "application/json; charset=utf-8"});
    res.end(JSON.stringify(students));
  }

  else if (req.method === 'GET' && req.url !== '/backup') {
    let p = url.parse(req.url, true);
    let id = +p.pathname.split('/')[1];
    let matchId = false;
    res.writeHead(200, {"Content-type": "application/json; charset=utf-8"});
    if (typeof id === "number") {
      const obj = fs.readFileSync("./StudentList.json", "utf8");
      let students = JSON.parse(obj);
      students.forEach(el => {
        if (el.id === id) {
          res.end(JSON.stringify(students[id - 1]));
          matchId = true
        }
      });
      if (!matchId) {
        const err = {"error": 2, "message": `Студент с id равным ${id} не найден`};
        res.end(JSON.stringify(err));
      }
    } else {
      console.log('err')
    }
  }
  else if (req.method === 'GET' && req.url === '/backup') {
    const out = [];
    fs.readdir("./copyStudents/", (err, files) => {
      files.forEach(files => out.push(files));
      res.writeHead(200, {"Content-type": "application/json; charset=utf-8"});
      res.end(JSON.stringify(out));
    });
  }

  else if (req.method === 'POST' && req.url === '/') {
    // launch index.js
    wss.on("connection", ws => {
      ws.on('message', message => {
        let students;

        let recievedObj = JSON.parse(message);
        let obj = fs.readFileSync("./StudentList.json");
        students = JSON.parse(obj);
        students.push(recievedObj);

        const data = JSON.stringify(students, null);
        fs.writeFileSync('./StudentList.json', data);
        res.writeHead(200, {"Content-type": "application/json; charset=utf-8"});
        res.end(JSON.stringify(recievedObj));
      });
    });
    wss.on("error", err => console.log("WS server error", err));
    res.end('')
  }
  else if (req.method === "POST" && req.url === "/backup") {
    const dateNow = new Date();
    const year = dateNow.getFullYear();
    const month = ((dateNow.getMonth()) + 1 < 10) ? `0${(dateNow.getMonth()) + 1}` : (dateNow.getMonth()) + 1;
    const day = (dateNow.getDate() < 10) ? `0${dateNow.getDate()}` : dateNow.getDate();
    const hours = (dateNow.getHours() < 10) ? `0${dateNow.getHours()}` : dateNow.getHours();
    const minutes = (dateNow.getMinutes() < 10) ? `0${dateNow.getMinutes()}` : dateNow.getMinutes();
    const seconds = (dateNow.getSeconds() < 10) ? `0${dateNow.getSeconds()}` : dateNow.getSeconds();

    const fileName = `${year}${month}${day}${hours}${minutes}${seconds}_StudentList.json`;
    let obj = fs.readFileSync("./StudentList.json");
    students = JSON.parse(obj);
    const data = JSON.stringify(students, null, 2);
    setTimeout(() => {
      fs.writeFileSync(`./copyStudents/${fileName}`, data);
      res.end('');
    }, 2000);
  }

  else if (req.method === 'PUT' && req.url === '/') {
    wss.on("connection", ws => {
      ws.on('message', message => {
        let students;
        let recievedObj = JSON.parse(message);
        let id = recievedObj.id;
        let obj = fs.readFileSync("./StudentList.json");
        students = JSON.parse(obj);
        let matchId = false;
        students.forEach(el => {
          if (el.id === id) {
            students.splice(el.id - 1, 1, recievedObj);
            const data = JSON.stringify(students, null, 2);
            fs.writeFileSync('./StudentList.json', data);
            res.writeHead(200, {"Content-type": "application/json; charset=utf-8"});
            res.end(JSON.stringify(recievedObj));
            matchId = true;
          }
        });
        if (!matchId) {
          const err = {"error": 2, "message": `Студент с id равным ${id} не найден`};
          res.end(JSON.stringify(err));
        }
      });
    });
    wss.on("error", err => console.log("WS server error", err));
    res.end('')
  }

  else if (req.method === 'DELETE') {
    let p = url.parse(req.url, true);
    let id = +p.pathname.split('/')[1];
    let matchId = false;
    res.writeHead(200, {"Content-type": "application/json; charset=utf-8"});
    if (typeof id === "number") {
      const obj = fs.readFileSync("./StudentList.json", "utf8");
      let students = JSON.parse(obj);
      students.forEach(el => {
        if (el.id === id) {
          students.splice(el.id - 1, 1);
          fs.writeFileSync('./StudentList.json', JSON.stringify(students, null, 2));
          res.end(JSON.stringify(el));
          matchId = true;
        }
      });
      if (!matchId) {
        const err = {"error": 2, "message": `Студент с id равным ${id} не найден`};
        res.end(JSON.stringify(err));
      }
    } else {
      console.log('err')
    }
  }

  else {
    res.end('');
  }
}).listen(3000, "localhost", () => {
  console.log("Сервер начал прослушивание запросов на порту 3000");
});


