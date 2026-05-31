//import { json } from "stream/consumers";



const countText = document.getElementById("count");
const button = document.getElementById("button");
const button2 = document.getElementById("button2")
const playercountText = document.getElementById("playercount")
const gamebox = document.getElementById("gamebox")

// let player_data = {
//     id: "",
//     turn: 0,
//     win: 0,
//     piece: 0
// }


// let player = sessionStorage.getItem("playerData")

// if(player){
// player_data = JSON.parse(player)
// }
// else{
// player_data.id = crypto.randomUUID()
// sessionStorage.setItem("playerData",JSON.stringify(playerData))
// }

for(let i = 0; i<9; i++){
const box = document.createElement("div")
box.className = "boxes"
gamebox.appendChild(box)
}


const socket = io();

// Receive updated count
socket.on("updateCount", (count) => {

    countText.textContent = count;

});

socket.on("updatePlayerCount", (playercount) => {
    playercountText.textContent = `Players Connected: ${playercount}`;
})
// Increase Button click
button.addEventListener("click", () => {

    socket.emit("increaseCount");

});
// Decrease Button click
button2.addEventListener("click", () =>{
    //Sends message to server decreaseCount()
    socket.emit("decreaseCount");
})
