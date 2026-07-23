const gamebox = document.getElementById("gamebox");
const submit_name = document.getElementById("submit-name");
const name = document.getElementById("name");
const namebox = document.getElementById("namebox");

let player = sessionStorage.getItem("player_id");

if (!player) {
  player = createPLayerId();
  sessionStorage.setItem("player_id", player);
}

const socket = io();

socket.on("initial_data", (data) => {
  sessionStorage.setItem("turn", data.turn);
  sessionStorage.setItem("color", data.color);
  sessionStorage.setItem("player_turn", data.playerTurn);
  console.log(data);
});

submit_name.addEventListener("click", () => {
  const name = document.getElementById("namebox");
  socket.emit("namebox", name.value);
  sessionStorage.setItem("player_name", name.value);
});

socket.emit("player_id", player);

socket.on("Two players are connected", (player_name) => {
  console.log("Two players are connected");

  let box_list = createBoxes();
  box_list.forEach((box, index) => {
    box.addEventListener("click", changeColor);
  });

  socket.on("New_Turn", (current_turn) => {
    console.log(current_turn);
    sessionStorage.setItem("turn", current_turn);
  });

  namebox.style.display = "none";
  let username = sessionStorage.getItem("player_name");
  name.innerHTML = `Player Name: ${username}`;

  socket.on("message", (message) => {
    name.innerHTML = `Player Name: ${username} <p> You should ${message}</p>`;
  });
});

function createBoxes() {
  //Creates boxes
  gamebox.style.display = "grid";
  submit_name.style.display = "none";
  for (let i = 0; i < 9; i++) {
    const box = document.createElement("div");

    box.className = "boxes";

    gamebox.appendChild(box);
  }

  let boxes = document.querySelectorAll(".boxes");

  return boxes;
}

function changeColor(event) {
  let box = event.currentTarget;
  const client_turn = Number(sessionStorage.getItem("turn"));
  const client_color = sessionStorage.getItem("color");
  const current_turn = Number(sessionStorage.getItem("player_turn"));

  console.log(client_turn);
  console.log(current_turn);

  if (client_turn === current_turn) {
    box.style.backgroundColor = client_color;
    box.removeEventListener("click", changeColor);
    socket.emit("Update_Turn", current_turn);
    console.log(`Player ${current_turn} can go. It is ${client_color}'s turn.`);
  } else {
    console.log("It is not your turn.");
  }
}

function createPLayerId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `player ${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
