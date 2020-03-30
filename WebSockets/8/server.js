const rpcWSS = require("rpc-websockets").Server

let server = new rpcWSS({port: 4000, host: "localhost"});

server.event("AAA");
server.event("BBB");
server.event("CCC");

process.stdin.setEncoding('utf8');
console.log("Введите название события: ");
process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
  if (chunk !== null) {
    if (chunk.indexOf("AAA") !== -1) {
      server.emit("AAA", 1);
      console.log("событие 'AAA'");
    }
    else if (chunk.indexOf("BBB") !== -1) {
      server.emit("BBB", 2);
      console.log("событие 'BBB'");
    }
    else if (chunk.indexOf("CCC") !== -1) {
      server.emit("CCC", 3);
      console.log("событие 'CCC'");
    }
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});