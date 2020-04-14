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
      let students;

      try {
        const studentsData = fs.readFileSync("./StudentList.json", "utf8");
        students = JSON.parse(studentsData);
      } catch (err) {
        const objError = {"error": 1, "message": "Ошибка чтения файла StudentList.json"};
        res.end(JSON.stringify(objError));
      }

      res.writeHead(200, {"Content-type": "application/json; charset=utf-8"});
      res.end(JSON.stringify(students));
    }

    else if (req.method === 'GET' && req.url !== '/backup') {
      let p = url.parse(req.url, true);
      let id = +p.pathname.split('/')[1];
      let matchId = false;
      let students;

      try {
        const studentsData = fs.readFileSync("./StudentList.json", "utf8");
        students = JSON.parse(studentsData);
      } catch (err) {
        const error = {"error": 1, "message": "Ошибка чтения файла StudentList.json"};
        res.end(JSON.stringify(error));
      }

      students.forEach(student => {
        if (student.id === +id) {
          matchId = student;
        }
      });

      res.writeHead(200, {"Content-type": "application/json; charset=utf-8"});
      if (matchId) {
        res.end(JSON.stringify(matchId));
      } else {
        const err = {"error": 2, "message": `Студент с id равным ${studentId} не найден`};
        res.end(JSON.stringify(err));
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
      let result = '';
      let students;

      try {
        const studentsData = fs.readFileSync("./StudentList.json");
        students = JSON.parse(studentsData);
      } catch (err) {
        const objError = {"error": 1, "message": "Ошибка чтения файла StudentList.json"};
        res.end(JSON.stringify(objError));
      }

      req.on("data", data => {
        result += data
      });
      req.on("end", () => {
        let recievedObj = JSON.parse(result);
        let existStudent = false;

        students.forEach(student => {
          if (student.id === recievedObj.id) {
            existStudent = true;
          }
        });

        if (!existStudent) {
          students.push(recievedObj);
          const data = JSON.stringify(students, null, 2);
          fs.writeFileSync('./StudentList.json', data);
          res.end(JSON.stringify(recievedObj));
        } else {
          const err = {"error": 3, "message": `Студент с id равным ${recievedObj.id} уже есть`};
          res.end(JSON.stringify(err));
        }
      })
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
      let students;
      let result = '';

      try {
        const studentsData = fs.readFileSync("./StudentList.json");
        students = JSON.parse(studentsData);
      } catch (err) {
        const objError = {"error": 1, "message": "Ошибка чтения файла StudentList.json"};
        res.end(JSON.stringify(objError));
      }

      req.on("data", data => {
        result += data
      });
      req.on("end", () => {
        let recievedObj = JSON.parse(result);
        let existStudent = false;
        let currentStudent;

        students.forEach(student => {
          if (student.id === recievedObj.id) {
            existStudent = true;
            currentStudent = student;
          }
        });

        if (existStudent) {
          for (let key in recievedObj) {
            if (currentStudent[key]) {
              currentStudent[key] = recievedObj[key];
            }
          }
          const data = JSON.stringify(students, null, 2);
          fs.writeFileSync('./StudentList.json', data);

          res.writeHead(200, {"Content-type": "application/json; charset=utf-8"});
          res.end(JSON.stringify(recievedObj));
        } else {
          const err = {"error": 2, "message": `Студент с id равным ${recievedObj.id} не найден`};
          res.end(JSON.stringify(err));
        }
      });
    }

    else if (req.method === 'DELETE') {
      let p = url.parse(req.url, true);
      let id = +p.pathname.split('/')[1];
      let matchId = false;
      let students;

      try {
        const studentsData = fs.readFileSync("./StudentList.json", "utf8");
        students = JSON.parse(studentsData);
      } catch (err) {
        const objError = {"error": 1, "message": "Ошибка чтения файла StudentList.json"};
        res.end(JSON.stringify(objError));
      }

      students = students.filter(student => {
        if (student.id === id) {
          matchId = student;
          return false;
        }
        return true;
      });

      res.writeHead(200, {"Content-type": "application/json; charset=utf-8"});

      if (matchId) {
        const data = JSON.stringify(students, null, 2);
        fs.writeFileSync('./StudentList.json', data);
        res.end(JSON.stringify(matchId));
      } else {
        const err = {"error": 2, "message": `Студент с id равным ${studentId} не найден`};
        res.end(JSON.stringify(err));
      }
    }
  }
).listen(3000, "localhost", () => {
  console.log("Сервер начал прослушивание запросов на порту 3000");
});


