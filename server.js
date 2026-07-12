import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

let count = 0;
// let colors = ["red", "blue"];
let players = new Set();
let playersBySocket = new Map();

let game_data = {
    players: players,
    turn: 1,
    color: "red"
};

io.on("connection", (socket) => {

    socket.on("player_id", (player) => {
        console.log(`Player connected: ${player}`);
    
        playersBySocket.set(socket.id, player);
        const player_turn = playersBySocket.size
        
        socket.emit("initial_data", {...game_data, 
        playerTurn: player_turn})
        game_data.color = "black";

    });


    socket.on("Update_Turn", (current_turn) => {

        current_turn = Number(current_turn)

        if(current_turn===1){
            current_turn++
        }
        else if (current_turn == 2){
            current_turn--
        }
        console.log("Updating")
        game_data.turn = current_turn
        io.emit("New_Turn", current_turn)
    })


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
                // IO sends to every socket including the one that sent the request
    io.emit("Two players are connected", username)
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
