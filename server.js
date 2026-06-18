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

let game_data = {
    id: "",
    turn: 0,
    win: 0,
    piece: "*"
}

io.on("connection", (socket) => {

    console.log("Player connected");
   

    socket.on("disconnect", () => {
        players.delete(playerID)
        console.log("Player disconnected");
    });


});

server.listen(3000, () => {
  
    console.log("Server running on port 3000");
});


https://prod.liveshare.vsengsaas.visualstudio.com/join?923B3A28CCF231201D8D34D30CC6944408D4