const sql = require('mssql');
const http = require('http');
const fs = require('fs');

const config = {
  user: 'sa',
  password: '123',
  server: 'DESKTOP-N067E6Q\\MSSQLSERVER',
  database: 'TVG',
  driver: 'tedious',
};

const tableNames = {
  'faculties': 'FACULTY',
  "pulpits": 'PULPIT',
  "subjects": 'SUBJECT',
  "auditoriumstypes": 'AUDITORIUM_TYPE',
  "auditoriums": 'AUDITORIUM',
};

const server = http.createServer((req, res) => {

  if (req.method === "GET" && req.url === "/index.js") {
    const script = fs.readFileSync("./index.js");
    res.writeHead(200, {"Content-type": "text/javascript; charset=utf-8"});
    res.end(script);
  }
  else if (req.method === "GET" && req.url === "/") {
    const html = fs.readFileSync("./index.html");
    res.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
    res.end(html);
  }
  else if (req.method === "GET") {

   /* console.log('work')
    let obj = {"keek": "222", "lol": "1333"}
    res.writeHead(200, {"Content-type": "application/json; charset=utf-8"});
    res.end(JSON.stringify(obj));*/
    let url = req.url.split("/")[2];
    if(typeof url === 'undefined') url = 'pulpits';
    const connection = new sql.ConnectionPool(config);

    connection.connect((err) => {
      if (err) {
        res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
        res.end("connection error: ", err);
      }

      let match = false;
      for (let key in tableNames) {
        if (key === url) {
          match = true;
          const req = new sql.Request(connection);
          req.query(`select * from ${tableNames[url]}`, (err, recordset) => {
            if (err) {
              res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
              res.end("err: ", err);
            }
            else {
              res.writeHead(200, {"Content-type": "application/json; charset=utf-8"});
              res.end(JSON.stringify(recordset["recordset"]));
            }}
          )
        }
      }
      if (match === false) {
        console.log("err: ");
        res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
        res.end("error: Wrong url");
      }
    });
  } else if (req.method === "POST") {
    let result = "";

    req.on("data", data => {
      result += data
    });
    req.on("end", () => {
      const url = req.url.split("/")[2];
      const recievedData = JSON.parse(result);

      const keys = Object.keys(recievedData);
      let values = "";

      Object.values(recievedData).forEach(el => {
        values += `'${el}', `;
      });
      values = values.slice(0, -2);

      const connection = new sql.ConnectionPool(config);

      connection.connect((err) => {
        if (err) {
          res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
          res.end("connection error: ", err);
        }

        let match = false;
        for (let key in tableNames) {
          if (key === url) {
            match = true;
            const req = new sql.Request(connection);
            req.query(`insert ${tableNames[url]} (${keys.join(", ")}) VALUES (${values})`, (err, recordset) => {
              if (err) {
                res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
                res.end("err: ", err);
                console.log(err)
              }
              else {
                res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
                res.end("Data has been added");
              }
            });
          }
        }
        if (match === false) {
          console.log("err: ", err);
          res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
          res.end("error: Wrong url");
        }
      });
    });
  } else if (req.method === "PUT") {
    let result = "";

    req.on("data", data => {
      result += data
    });
    req.on("end", () => {
      const url = req.url.split("/")[2];
      const recievedData = JSON.parse(result);

      const keys = Object.keys(recievedData);
      let values = "";

      Object.values(recievedData).forEach(el => {
        values += `'${el}', `;
      });
      values = values.slice(0, -2);

      const connection = new sql.ConnectionPool(config);

      const foreignKey = tableNames[url];
      let str = "";

      for (key in recievedData) {
        if (key !== tableNames[url]) {
          str += `${key} = '${recievedData[key]}', `;
        }
      }
      str = str.slice(0, -2);

      connection.connect((err) => {
        if (err) {
          res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
          res.end("connection error: ", err);
        }

        let match = false;
        for (let key in tableNames) {
          if (key === url) {
            match = true;
            const req = new sql.Request(connection);
            req.query(`UPDATE ${tableNames[url]} SET ${str} WHERE ${foreignKey} = '${recievedData[foreignKey]}'`, (err, recordset) => {
              if (err) {
                res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
                res.end("err: ", err);
                console.log(err)
              }
              else {
                res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
                res.end("Data has been updated");
              }
            });
          }
        }
        if (match === false) {
          console.log("err: ", err);
          res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
          res.end("error: Wrong url");
        }
      });
    });
  } else if (req.method === "DELETE") {
    const id = req.url.split("/")[3];
    const url = req.url.split("/")[2];
    const foreignKey = tableNames[url];
    const connection = new sql.ConnectionPool(config);

    connection.connect((err) => {
      if (err) {
        console.log("err: ", err);
        res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
        res.end("connection error: ", err);
      }

      const req = new sql.Request(connection);
      req.query(`DELETE FROM ${tableNames[url]} WHERE ${foreignKey} = '${id}'`, (err, recordset) => {
        if (err) {
          console.log("err: ", err);
          res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
          res.end("error: ", err);
        }
        else {
          res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
          res.end("Data has been removed");
        }
      });
    });
  } else {
    res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
    res.end("Wrong method");
  }

}).listen(3000);

