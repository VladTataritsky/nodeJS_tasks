const http = require('http');
const fs = require('fs');
const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = new Sequelize("seq", "sa", "123", {
  dialect: "mssql",
  host: "localhost",
  port: "1433"
});


class FACULTY extends Model {
};
FACULTY.init(
  {
    FACULTY: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
    FACULTY_NAME: {type: Sequelize.STRING, allowNull: false}
  },
  {
    sequelize,
    modelName: 'FACULTY',
    tableName: 'FACULTY',
    timestamps: false
  }
)

class PULPIT extends Model {
};
PULPIT.init(
  {
    PULPIT: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
    PULPIT_NAME: {type: Sequelize.STRING, allowNull: false},
    FACULTY: {
      type: Sequelize.STRING, allowNull: false,
      references: {model: FACULTY, key: 'FACULTY'}
    },
  },
  {
    sequelize,
    modelName: 'PULPIT',
    tableName: 'PULPIT',
    timestamps: false
  }
)

class SUBJECT extends Model {
};
SUBJECT.init(
  {
    SUBJECT: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
    SUBJECT_NAME: {type: Sequelize.STRING, allowNull: false},
    PULPIT: {
      type: Sequelize.STRING, allowNull: false,
      references: {model: PULPIT, key: 'PULPIT'}
    },
  },
  {
    sequelize,
    modelName: 'SUBJECT',
    tableName: 'SUBJECT',
    timestamps: false
  }
)

class AUDITORIUM_TYPE extends Model {
};
AUDITORIUM_TYPE.init(
  {
    AUDITORIUM_TYPE: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
    AUDITORIUM_TYPENAME: {type: Sequelize.STRING, allowNull: false},
  },
  {
    sequelize,
    modelName: 'AUDITORIUM_TYPE',
    tableName: 'AUDITORIUM_TYPE',
    timestamps: false
  }
)

class AUDITORIUM extends Model {
};
AUDITORIUM.init(
  {
    AUDITORIUM: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
    AUDITORIUM_NAME: {type: Sequelize.STRING, allowNull: false},
    AUDITORIUM_CAPACITY: {type: Sequelize.STRING, allowNull: false},
    AUDITORIUM_TYPE: {type: Sequelize.STRING, allowNull: false, references: {model: AUDITORIUM_TYPE, key: 'AUDITORIUM_TYPE'}},
  },
  {
    sequelize,
    modelName: 'AUDITORIUM',
    tableName: 'AUDITORIUM',
    timestamps: false
  }
)

const tableNames = {
  'faculties': FACULTY,
  "pulpits": PULPIT,
  "subjects": SUBJECT,
  "auditoriumstypes": AUDITORIUM_TYPE,
  "auditoriums": AUDITORIUM,
};


/*sequelize.sync().then(() => console.log('connecting success'))
  .catch(err => console.log('connection error:', err));*/

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
    sequelize.sync().then(() => {
      let url = req.url.split("/")[2];

      tableNames[url].findAll().then(faculties => {
        console.log(faculties);
        res.writeHead(200, {"Content-type": "application/json; charset=utf-8"});
        res.end(JSON.stringify(faculties))
      }).catch(err => console.log(err));
    })
      .catch(err => {
        res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
        res.end('connection error:', err)
      })
  } else if (req.method === "POST") {
    sequelize.sync().then(() => {
      let result = "";

      req.on("data", data => {
        result += data
      });
      req.on("end", () => {
        const url = req.url.split("/")[2];
        const recievedData = JSON.parse(result);
        tableNames[url].create(recievedData).then(res => {
          console.log(res);
        }).catch(err => console.log(err));
        res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
        res.end("Data has been added");
      });
    })
      .catch(err => {
        res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
        res.end('connection error:', err)
      })
  }

  else if (req.method === "PUT") {
    sequelize.sync().then(() => {
      let result = "";

      req.on("data", data => {
        result += data
      });
      req.on("end", () => {
        const url = req.url.split("/")[2];
        const recievedData = JSON.parse(result);
        console.log(recievedData)
        let keyObj = Object.keys(recievedData)[0]
        let keyVal = recievedData[tableNames[url]];
        console.log(recievedData.keyObj)
        console.log({keyObj: keyVal})
        tableNames[url].update({FACULTY_NAME: "22228"},
          {where: {PULPIT: "111"}}
        ).then(res => {
          console.log(res);
        })
      }).catch(err => console.log(err));
      res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
      res.end("Data has been updated");
    })
      .catch(err => {
        res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
        res.end('connection error:', err)
      })
  } else if (req.method === "DELETE") {
    sequelize.sync().then(() => {
      const id = req.url.split("/")[3];
      const url = req.url.split("/")[2];
      tableNames[url].destroy({where: {PULPIT: "111"}})
      res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
      res.end("Data has been removed");
    })
      .catch(err => {
        res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
        res.end('connection error:', err)
      })
  } else {
    res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
    res.end("wrong method");
  }
}).listen(3000);