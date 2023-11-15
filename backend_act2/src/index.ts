import dotenv  from "dotenv"
dotenv.config()
const secret = process.env.SECRET

// file and child process things



import path from 'path';
import fs from 'fs';
import { WriteStream } from 'fs';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

// express + socket.io

import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const port = 5000

// logging server

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

const appPosts = (info: serverTyping) => {

  let process: ChildProcessWithoutNullStreams
  let isRunning: boolean = false
  let revalidateTimer: ReturnType<typeof setTimeout>
  
  const minute: number = new Date().getMinutes()
  const month: number = new Date().getMonth()
  const date: number = new Date().getDate()
  const year: number = new Date().getFullYear()

  const log_dir_path = path.join("database", "server_logs", info.serverType, info.serverName)
  const log_file_path = path.join("database", "server_logs", info.serverType, info.serverName, `${month}-${date}-${year}.log`)

  if (!(fs.existsSync(log_dir_path))) {
    fs.mkdirSync(log_dir_path)
  }

  const activateRevalidateTimer = () => {
    clearTimeout(revalidateTimer)
    revalidateTimer = setTimeout(() => {
      fetch(`http://localhost:3000/api/servers/${info.serverType}/${info.serverName}/revalidate`)
    }, 5000)
  }

  app.post(`/${info.serverType}/${info.serverName}/start/${secret}`, (_req, res) => {

    console.log("test")

    let i = 0

    if (!isRunning) {

      if (fs.existsSync(log_file_path)) {
        fs.unlink(log_file_path, (err) => {
          if (err) {
            throw err;
          }
        });
      }

      let writeStream = fs.createWriteStream(log_file_path);

      process = spawn('bash', [`servers_container/${info.serverType}/start_server_scripts/${info.serverName}.sh`]);

      io.emit(`${info.serverType}-${info.serverName}-status`, {status: true});

      process.stdout.on('data', (data) => {
        writeStream.write(`${data.toString()}`)
        io.emit(`${info.serverType}-${info.serverName}-logs`, {currentLog: data.toString()})
        isRunning = true
      })

      process.stderr.on('data', (data: { toString: () => any; }) => {
        writeStream.write(`${data.toString()}`)
        io.emit(`${info.serverType}-${info.serverName}-logs`, {currentLogs: data.toString()})
        console.error(data.toString())
      })

      process.on('close', (code: { toString: () => string; }) => {
        console.log('child process exited with code ' + code.toString());
        isRunning = false;
        io.emit(`${info.serverType}-${info.serverName}-status`, {status: true});
      })

      res.sendStatus(200)

    } else res.sendStatus(400)
  })

  app.post(`/${info.serverType}/${info.serverName}/logs/${secret}`, (_req, res) => {
    
    fs.readFile(log_file_path, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      res.send(data.toString().split(/\r?\n/));
    });
  })

  app.post(`/${info.serverType}/${info.serverName}/check/${secret}`, (_req, res) => {
    res.send(isRunning)
  })

  app.post(`/${info.serverType}/${info.serverName}/command/${secret}`, jsonParser, (req, res) => {
    if (isRunning) {
      process.stdin.write(`${req.body.response}\n`)
      res.sendStatus(200)
    } else {
      res.sendStatus(400)
    }
    
  })
}

// specialized server

// serverlist
type serverTyping = {
  serverName:string,
  serverType:string,
  id:number
}

let serverList: Array<serverTyping> = [{serverName: "minecraft_hub", serverType: "minecraft", id: 1,}]
let serverNameList: Array<string> = []

for (const currentServerInfo of serverList) {
  serverNameList.push(currentServerInfo.serverName)
}

for (const currentServerInfo of serverList) {
  console.log(currentServerInfo.serverName, "created")
  appPosts(currentServerInfo)
}

app.post(`/server_list/${secret}`, (req, res) => {
  res.send(serverList)
})

app.post(`/add_server/${secret}`, (req, res) => {
  const info = {serverName:req.body.name, serverType:req.body.type, id:serverList.length+1}
  serverList.push(info)
  serverNameList
  appPosts(info)
  res.sendStatus(400)
})

app.post(`/${secret}`, (_req, res) => {
  io.emit("hi", {content: "hi"})
  res.sendStatus(200)
});

// server startup


server.listen(port, () => {
  console.log(`listening on ${port}`);
});