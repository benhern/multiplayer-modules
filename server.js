import express from "express";
import http from "http";
import os from "os";
import { networkInterfaces } from "os";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let count = 0;
// let colors = ["red", "blue"];
let players = new Set();
let playersBySocket = new Map();

let colors = ["black", "red"]
let game_data = {
  players: players,
  turn: 1,
  color: "red",
  board: Array(9).fill(null),
};

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

io.on("connection", (socket) => {
  socket.on("player_id", (player) => {
    // console.log(`Player connected: ${player}`);
const player_turn = playersBySocket.size +1
const player_data = {
  id: player,
  name: player,
  turn: player_turn,
  color: colors[player_turn -1]
}

playersBySocket.set(socket.id,player_data)

socket.emit("initial_data", {
  turn: game_data.turn,
  player_turn: player_data.turn,
  color: player_data.color
})




  });

socket.on("Update_Turn", (box_index) => {
  const player_data = playersBySocket.get(socket.id);

  if (!player_data || player_data.turn !== game_data.turn) {
    socket.emit("notyourturn", game_data.turn);
    return;
  }

  box_index = Number(box_index);

  if (game_data.board[box_index] !== null) return;

  game_data.board[box_index] = player_data.color;
  game_data.turn = game_data.turn === 1 ? 2 : 1;

  io.emit(
    "Update_Boxes",
    box_index,
    player_data.color,
    game_data.turn,
  );
});

socket.on("namebox", (name) => {
  const trimmedName = name.trim();
  const player_data = playersBySocket.get(socket.id);

  if (!player_data) return;

  player_data.name = trimmedName;
  game_data.players.add(player_data);

  if (game_data.players.size === 2) {
    io.emit("Two players are connected");
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

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use`);
      console.error(
        "Stop the other server or run this app on a different port",
      );
      process.exit(1);
    }
    throw error;
  });
});

server.listen(PORT, () => {
  console.log("Server running on port 3000");
  for (const url of getLocalNetworkUrls(PORT)) {
    console.log(`Server available on your network ${url}`);
  }
});

function getLocalNetworkUrls(port) {
  const interfaces = os.networkInterfaces();
  const urls = [];
  for (const networkInterfaces of Object.values(interfaces)) {
    for (const address of networkInterfaces ?? []) {
      if (address.family === "IPv4" && !address.internal) {
        urls.push(`http://${address.address}:${port}`);
      }
    }
  }
  return urls;
}
