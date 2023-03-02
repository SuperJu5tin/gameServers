const secret = "SADASDAJHKLSB"

// file and child process things

const path = require('path');
const fs = require('fs')
const { WriteStream } = require('fs');
const { spawn } = require('child_process');

// express + socket.io

const express = require('express');

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { type } = require('os');
const io = new Server(server);
const port = 5000

// mysql database

/*

const mysql = require('mysql');
const serverDatabase = mysql.createConnection({
  host: "localhost",
  user: "gamingserver",
  password: "Slacker13ags!",
})

serverDatabase.connect((err) => {
  if (err) throw err;

  console.log("Connected");

}) 

*/

// general servers

const appPosts = (info) => {

  let process
  let currentLogs = []
  let isRunning = false
  
  app.post(`/${info.type}/${info.serverName}/start`, (req, res) => {

    let i = 0

    if (!isRunning) {

      if (fs.existsSync(fs.join(__dirname, )`${__dirname}/${info.type}Logs/${info.serverName}Log.log`)) {
        fs.unlink(`${__dirname}/${info.type}Logs/${info.serverName}Log.log`, (err) => {
          if (err) {
            throw err;
          }
        });
      }

      const writeStream = fs.createWriteStream(`${__dirname}/logs/${info.type}/${info.serverName}Log.log`);

      process = spawn('bash', [`serverScripts/${info.type}/${info.serverName}.sh`]);

      io.emit(`${info.type}-${info.serverName}-status`, {status: true});

      process.stdout.on('data', (data) => {
        writeStream.write(`${data.toString()}`)
        io.emit(`${info.type}-${info.name}-logs`, {currentLog: data.toString()})
        isRunning = true
      })

      process.stderr.on('data', (data) => {
        writeStream.write(`${data.toString()}`)
        io.emit(`${info.type}-${info.name}-logs`, {currentLogs: data.toString()})
        console.error(data.toString())
      })

      process.on('close', (code) => {
        console.log('child process exited with code ' + code.toString());
        isRunning = false;
        io.emit(`${info.type}-${info.serverName}-status`, {status: true});
      })

      res.sendStatus(200)

    } else res.sendStatus(400)
  })

  app.post(`/${info.type}/${info.serverName}/logs`, (req, res) => {
    fs.readFile(`${__dirname}/logs/${info.type}/${info.serverName}Log.log`, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      res.send(data.toString().split(/\r?\n/));
    });
  })

  app.post(`/${info.type}/${info.serverName}/check`, (req, res) => {
    res.send(isRunning)
  })

  app.post(`/${info.type}/${info.serverName}/command`, (req, res) => {
    if (isRunning) {
      console.log(req.body.response)
      process.stdin.write(`${req.body.response}\n`)
      res.sendStatus(200)
    } else {
      res.sendStatus(400)
    }
  })
}

// specialized server

const minecraftServer = (serverName) => {

  info = {
    type:"minecraft",
    serverName,
  }

  appPosts(info);
  
}

// serverlist

minecraftServer("vanilla119")

app.post('/', (req, res) => {
  io.emit("hi", {content: "hi"})
  res.sendStatus(200)
});

// server startup

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`listening on ${port}`);
});