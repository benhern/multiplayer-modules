import express from "express";
import http from "http";
import os from "os";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.use(express.static("public"));

let colors = ["black", "red"];
let players = new Set();
let playersBySocket = new Map();
const moves = [];
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

let game_data = {
  players: players,
  turn: 0,
  color: " ",
  board: Array(9).fill(null),
  gameOver: false,
};

io.on("connection", (socket) => {
  socket.on("player_id", (player) => {
    console.log(`Player connected: ${player}`);
    const playerTurn = playersBySocket.size;
    const playerData = {
      id: player,
      name: player,
      turn: playerTurn,
      color: colors[playerTurn],
    };

    playersBySocket.set(socket.id, playerData);

    //Send the default data on the first user
    socket.emit("initialData", {
      turn: game_data.turn,
      playerTurn: playerData.turn,
      color: playerData.color,
    });
  });

  socket.on("namebox", (name) => {
    console.log(playersBySocket);

    //Checking to see if we are renaming socket
    const trimmedName = name.trim();
    const playerData = playersBySocket.get(socket.id);

    //If we are then delete player and socket
    if (playerData?.name) {
      game_data.players.delete(playerData.name);
    }

    //Add in the new name and the new socket
    game_data.players.add(trimmedName);
    playersBySocket.set(socket.id, {
      ...playerData,
      name: trimmedName,
    });
    console.log(game_data.players);

    if (players.size === 2) {
      // //Getting the username from the socket id that is asking
      // const username = playersBySocket.get(socket.id)
      // IO sends to every socket including the one that sent the request
      io.emit("Two players are connected", game_data);
    }
  });

  socket.on("updateTurn", (box_index) => {
    const playerData = playersBySocket.get(socket.id);

    if (game_data.gameOver) {
      return;
    }

    if (!playerData || playerData.turn !== game_data.turn) {
      socket.emit("not_your_turn", game_data.turn);
      return;
    }

    game_data.color = playerData.color;

    console.log(`turn ${game_data.turn} from ${playerData.name}`);
    console.log(`Box ${box_index} was changed`);

    game_data.board[box_index] = playerData.color;
    console.log(game_data.board);

    //Using tuples, we can get the turn and box index that was changed
    moves.push(Number(box_index));

    const winner = checkWin();
    const isDraw = !winner && moves.length === 9;
    game_data.gameOver = Boolean(winner || isDraw);

    if (!game_data.gameOver) {
      game_data.turn = game_data.turn === 0 ? 1 : 0;
      console.log(`Updated turn is: ${game_data.turn}`);
    }

    io.emit("update_boxes", game_data.turn, box_index, playerData.color, {
      isGameOver: game_data.gameOver,
      winner: winner ? playerData.name : null,
      isDraw: isDraw,
    });
  });

  socket.on("new_game", () => {
    resetGame();
    io.emit("reset_game", game_data.turn);
  });

  socket.on("disconnect", () => {
    //Grabs the current socket leaving
    const playerData = playersBySocket.get(socket.id);

    //Deletes it from our list
    if (playerData) {
      game_data.players.delete(playerData.name);
      playersBySocket.delete(socket.id);
    }

    console.log(`Player disconnected: ${playerData?.name ?? socket.id}`);
    console.log(game_data.players);
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
    console.error("Stop the other server or run this app on a different port.");
    process.exit(1);
  }

  throw error;
});

server.listen(PORT, HOST, () => {
  console.log(`Server running locally: http://localhost:${PORT}`);

  //This prints the address of possible connects from VPN, Ethernet and wifi etc...
  for (const url of getLocalNetworkUrls(PORT)) {
    console.log(`Server available on your network: ${url}`);
  }
});

//This allows us to get the network address and looks for local (IPV4) address
//then created the site from the local address with the port at end
function getLocalNetworkUrls(port) {
  const interfaces = os.networkInterfaces();
  const urls = [];

  for (const networkInterface of Object.values(interfaces)) {
    for (const address of networkInterface ?? []) {
      if (address.family === "IPv4" && !address.internal) {
        urls.push(`http://${address.address}:${port}`);
      }
    }
  }

  return urls;
}

function checkWin() {
  //We need 3 moves to be able to check
  if (moves.length < 3) {
    console.log("Less than 3 moves...Not checking win...");
    return null;
  }

  //Checks to see if there is a value on the far left first
  //continues to check if all are the same color
  for (const [left, middle, right] of wins) {
    const board = game_data.board;
    if (
      board[left] &&
      board[left] === board[middle] &&
      board[left] === board[right]
    ) {
      return board[left];
    }
  }

  return null;
}

function resetGame() {
  moves.length = 0;
  game_data.turn = 0;
  game_data.color = " ";
  game_data.board = Array(9).fill(null);
  game_data.gameOver = false;
}
