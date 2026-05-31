import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

let count = 0;

let playercount = 0;

io.on("connection", (socket) => {

    console.log("Player connected");
    // Send current count to new player
    socket.emit("updateCount", count);
    socket.emit("updatePlayerCount",);

    // When player clicks increase button
    socket.on("increaseCount", () => {

        count++;

        // Send updated count to all players
        io.emit("updateCount", count);

    });

    // When player clicks decrease button
    //Listens for click from client.js
    socket.on("decreaseCount", () => {
        count--;
//Sends message to update the count for the client.js
        io.emit("updateCount", count);
    })

    
    socket.on("updatePlayerCount", () => {
        playercount++
        io.emit("updatePlayerCount", playerCount);
    })

    socket.on("disconnect", () => {
        console.log("Player disconnected");
    });

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
