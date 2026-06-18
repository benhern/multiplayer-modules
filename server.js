import express from "express";
import { read } from "fs";
import http from "http";
import { builtinModules } from "module";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

let count = 0;
let colors = ["red","blue"]
let players = new Set()

let game_data = {
    id: "",
    turn: 0,
    win: 0,
    piece: "*"
}

io.on("connection", (socket) => {

    
    socket.on("player_id", (player) => {
        console.log(`Player connected: ${player}`);
    })

    socket.on("namebox", (name) => {
        console.log(name);
    })
    
   
    socket.on("disconnect", () => {
        console.log("Player disconnected");
    });

});

server.listen(3000, () => {
  
    console.log("Server running on port 3000");
});