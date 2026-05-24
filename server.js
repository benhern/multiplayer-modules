import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

let count = 0;

io.on("connection", (socket) => {

    console.log("Player connected");

    // Send current count to new player
    socket.emit("updateCount", count);

    // When player clicks button
    socket.on("increaseCount", () => {

        count++;

        // Send updated count to all players
        io.emit("updateCount", count);

    });

    socket.on("disconnect", () => {
        console.log("Player disconnected");
    });

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
