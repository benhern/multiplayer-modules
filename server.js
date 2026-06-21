import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

let count = 0;
let colors = ["red", "blue"];
let players = new Set();
let playersBySocket = new Map();

let game_data = {
    players: players,
    turn: 0,
    win: 0,
    piece: "*"
};

io.on("connection", (socket) => {

    socket.on("player_id", (player) => {
        console.log(`Player connected: ${player}`);
        playersBySocket.set(socket.id, player);
    });

    socket.on("namebox", (name) => {
        console.log(playersBySocket)

        //Checking to see if we are renaming socket
        const trimmedName = name.trim();
        const previousPlayer = playersBySocket.get(socket.id);

        //If we are then delete player and socket
        if (previousPlayer) {
            game_data.players.delete(previousPlayer);
        }

        //Add in the new name and the new socket 
        game_data.players.add(trimmedName);
        playersBySocket.set(socket.id, trimmedName);
        console.log(game_data.players);


            if(players.size===2){
                const username = playersBySocket.get(socket.id)
    socket.emit("Two players are connected", username)
    }
    });
   
    socket.on("disconnect", () => {

        //Grabs the current socket leaving
        const player = playersBySocket.get(socket.id);

        //Deletes it from our list 
        if (player) {
            game_data.players.delete(player);
            playersBySocket.delete(socket.id);
        }

        console.log(`Player disconnected: ${player ?? socket.id}`);
        console.log(game_data.players);
    });


});

server.listen(3000, () => {
  
    console.log("Server running on port 3000");
});
