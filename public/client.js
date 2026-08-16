const gamebox = document.getElementById("gamebox");
const submit_name = document.getElementById("submit-name");
const new_game = document.getElementById("new-game");
const display_username = document.getElementById("name");
const user_input_box = document.getElementById("namebox");
let boxes = [];
let gameStarted = false;

let player = sessionStorage.getItem("player_id");

if (!player) {
  player = createPlayerId();
  sessionStorage.setItem("player_id", player);
}

const socket = io();

function createPlayerId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `player-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

//Grabbing the inital data when connected
socket.on("initialData", (data) => {
  //This will let us know whose turn it is and color
  sessionStorage.setItem("currentTurn", data.turn);
  sessionStorage.setItem("playerTurn", data.playerTurn);
  sessionStorage.setItem("color", data.color);
});

submit_name.addEventListener("click", () => {
  const name = document.getElementById("namebox");
  socket.emit("namebox", name.value);
  sessionStorage.setItem("PlayerName", name.value);
});

new_game.addEventListener("click", () => {
  socket.emit("new_game");
});

//Associates the socket connection to the username they input
socket.emit("player_id", player);

//Game only begins when 2 players are connected.
socket.on("Two players are connected", (game_data) => {
  console.log(`Players are connected here is the Game Data: ${game_data.turn}`);

  if (gameStarted) {
    return;
  }

  gameStarted = true;

  //Creating the tic tac toe boxes
  boxes = createGameBoxes();

  boxes.forEach((box, box_index) => {
    box.addEventListener("click", (e) => {
      changeBoxColor(e, box_index);
    });
  });

  //Grabbing and formatting the username to be displayed after submitting
  const username = sessionStorage.getItem("PlayerName");

  user_input_box.style.display = "none";
  submit_name.style.display = "none";
  display_username.textContent = `Player Name: ${username}`;
});

//This will update the board with the correct color, turn for the other client waiting for their turn.
socket.on("update_boxes", (turn, box_index, client_color, gameOverData) => {
  console.log(`turn is now: ${turn}`);
  sessionStorage.setItem("currentTurn", turn);

  //Updating the box from other player
  box_index = Number(box_index);
  boxes[box_index].style.backgroundColor = client_color;
  boxes[box_index].dataset.filled = "true";

  if (gameOverData?.isGameOver) {
    gamebox.classList.add("disable-box");
    new_game.style.display = "block";

    if (gameOverData.isDraw) {
      display_username.textContent = "Game Over: Draw";
    } else {
      display_username.textContent = `Game Over: ${gameOverData.winner} wins`;
    }
  }
});

socket.on("not_your_turn", (turn) => {
  sessionStorage.setItem("currentTurn", turn);
});

socket.on("reset_game", (turn) => {
  sessionStorage.setItem("currentTurn", turn);
  gamebox.classList.remove("disable-box");
  new_game.style.display = "none";

  boxes.forEach((box) => {
    box.style.backgroundColor = "";
    delete box.dataset.filled;
  });

  const username = sessionStorage.getItem("PlayerName");
  display_username.textContent = `Player Name: ${username}`;
});

//Creating the Tic Tac Toe board
function createGameBoxes() {
  //Creating the boxes 9x9
  gamebox.style.display = "grid";

  for (let i = 0; i < 9; i++) {
    const box = document.createElement("div");
    box.className = "boxes";
    gamebox.appendChild(box);
  }
  const boxes = document.querySelectorAll(".boxes");
  return boxes;
}

function changeBoxColor(event, box_index) {
  const box = event.currentTarget; //gets the current box that was clicked
  const current_turn = Number(sessionStorage.getItem("currentTurn")); //converting to a number
  const player_turn = Number(sessionStorage.getItem("playerTurn"));
  const player_color = sessionStorage.getItem("color");

  //Checking if its the clients turn and updating turn, color box and sending index of changed box
  //disables the ability to double click your square
  if (box.dataset.filled === "true") {
    return;
  }

  if (player_turn === current_turn) {
    box.classList.remove("disable-box");
    socket.emit("updateTurn", box_index);

    console.log(
      `${player}'s turn is ${current_turn}\n Changed box number: ${box_index}`,
    );
  } else {
    console.log("Not your turn!!");
    box.classList.add("shake");
    box.addEventListener(
      "animationend",
      () => {
        box.classList.remove("shake");
      },
      { once: true },
    );
  }
}
