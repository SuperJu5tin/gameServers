import dotenv from "dotenv";
dotenv.config();
const secret = process.env.SECRET;
// file and child process things
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
// express + socket.io
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 5000;
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
const appPosts = (info) => {
    let process;
    let currentLogs = [];
    let isRunning = false;
    const month = new Date().getMonth();
    const date = new Date().getDate();
    const year = new Date().getFullYear();
    app.post(`/${info.serverType}/${info.serverName}/start/${secret}`, (_req, res) => {
        console.log("test");
        let i = 0;
        if (!isRunning) {
            if (!(fs.existsSync(path.join("database", "server_logs", info.serverType, info.serverName)))) {
                fs.mkdirSync(path.join("database", "server_logs", info.serverType, info.serverName));
            }
            if (fs.existsSync(path.join("database", "server_logs", info.serverType, info.serverName, `${month}-${date}-${year}.log`))) {
                fs.unlink(path.join("database", "server_logs", info.serverType, info.serverName, `${month}-${date}-${year}.log`), (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
            let writeStream = fs.createWriteStream(path.join("database", "server_logs", info.serverType, info.serverName, `${month}-${date}-${year}.log`));
            process = spawn('bash', [`servers_container/${info.serverType}/start_server_scripts/${info.serverName}.sh`]);
            io.emit(`${info.serverType}-${info.serverName}-status`, { status: true });
            process.stdout.on('data', (data) => {
                writeStream.write(`${data.toString()}`);
                io.emit(`${info.serverType}-${info.name}-logs`, { currentLog: data.toString() });
                isRunning = true;
            });
            process.stderr.on('data', (data) => {
                writeStream.write(`${data.toString()}`);
                io.emit(`${info.serverType}-${info.name}-logs`, { currentLogs: data.toString() });
                console.error(data.toString());
            });
            process.on('close', (code) => {
                console.log('child process exited with code ' + code.toString());
                isRunning = false;
                io.emit(`${info.serverType}-${info.serverName}-status`, { status: true });
            });
            res.sendStatus(200);
        }
        else
            res.sendStatus(400);
    });
    app.post(`/${info.serverType}/${info.serverName}/logs/${secret}`, (_req, res) => {
        fs.readFile(path.join("database", "server_logs", info.serverType, info.serverName, `${month}-${date}-${year}.log`), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            res.send(data.toString().split(/\r?\n/));
        });
    });
    app.post(`/${info.serverType}/${info.serverName}/check/${secret}`, (_req, res) => {
        res.send(isRunning);
    });
    app.post(`/${info.serverType}/${info.serverName}/command/${secret}`, (req, res) => {
        if (isRunning) {
            console.log(req.body.response);
            process.stdin.write(`${req.body.response}\n`);
            res.sendStatus(200);
        }
        else {
            res.sendStatus(400);
        }
    });
};
// specialized server
const minecraftServer = (serverName) => {
    const info = {
        type: "minecraft",
        serverName: serverName,
    };
    appPosts(info);
};
let serverList = [{ serverName: "minecraft_hub", serverType: "minecraft" }];
for (const currentServerInfo of serverList) {
    console.log(currentServerInfo, "created");
    appPosts(currentServerInfo);
}
app.post(`add_server/${secret}`, (req, res) => {
    const info = { serverName: req.body.name, serverType: req.body.type };
    serverList.push(info);
    appPosts(info);
    res.sendStatus(400);
});
app.post(`/${secret}`, (_req, res) => {
    io.emit("hi", { content: "hi" });
    res.sendStatus(200);
});
// server startup
io.on('connection', (_socket) => {
    console.log('a user connected');
});
server.listen(port, () => {
    console.log(`listening on ${port}`);
});
//# sourceMappingURL=index.js.map