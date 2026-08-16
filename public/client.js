const gamebox = document.getElementById("gamebox");
const submit_name = document.getElementById("submit-name");
const name = document.getElementById("name");
const namebox = document.getElementById("namebox");

let player = sessionStorage.getItem("player_id");

if (!player) {
  player = createPlayerId();
  sessionStorage.setItem("player_id", player);
}

const socket = io();

socket.on("initial_data", (data) => {
  sessionStorage.setItem("turn", data.turn);
  sessionStorage.setItem("color", data.color);
  sessionStorage.setItem("player_turn", data.player_turn);
  console.log(data);
});

submit_name.addEventListener("click", () => {
  const name = document.getElementById("namebox");
  socket.emit("namebox", name.value);
  sessionStorage.setItem("player_name", name.value);
});

socket.emit("player_id", player);

socket.on("Two players are connected", (current_player_name) => {
  console.log("Two players are connected");

  let box_list = createBoxes();
  box_list.forEach((box, box_index) => {
    box.addEventListener("click", (e) => {
      changeColor(e, box_index);
    });
  });

  namebox.style.display = "none";
  name.textContent = `It is ${current_player_name}'s turn`;

  socket.on("Update_Boxes", (box_index, client_color, current_turn, current_player_name) => {
    name.textContent = `It is ${current_player_name}'s turn`;
    sessionStorage.setItem("turn", current_turn);

    box_index = Number(box_index);
    box_list[box_index].style.backgroundColor = client_color;
    box_list[box_index].dataset.filled = "true";

    box_list.forEach((box) => {
      if (box.dataset.filled !== "true") {
        box.classList.remove("disable-box");
      }
    });
  });

  socket.on("notyourturn", (turn) => {
    sessionStorage.setItem("turn", turn);
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

function changeColor(event, box_index) {
  let box = event.currentTarget;
  const client_turn = Number(sessionStorage.getItem("player_turn"));
  const client_color = sessionStorage.getItem("color");
  const current_turn = Number(sessionStorage.getItem("turn"));

  console.log(client_turn);
  console.log(current_turn);

  if (box.dataset.filled === "true") {
    return;
  }

  if (client_turn === current_turn) {
    box.classList.remove("disable-box");
    socket.emit("Update_Turn", box_index);
    console.log(`Player ${current_turn} can go. It is ${client_color}'s turn.`);
  } else {
    console.log("It is not your turn.");
    box.classList.add("disable-box");
  }
}

function createPlayerId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `player ${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
