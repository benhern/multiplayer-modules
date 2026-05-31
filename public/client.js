const countText = document.getElementById("count");
const button = document.getElementById("button");
const button2 = document.getElementById("button2")
const playercountText = document.getElementById("playercount")
const gamebox = document.getElementById("gamebox")

let playerData = {
    id: "",
    turn: 0,
    win: 0,
    piece: ""
}


let player = sessionStorage.getItem("playerData")

if(player){
playerData = JSON.parse(player)
}
else{
playerData.id = crypto.randomUUID()
sessionStorage.setItem("playerData",JSON.stringify(playerData))
}

for(let i = 0; i<9; i++){
const box = document.createElement("div")
box.className = "boxes"
gamebox.appendChild(box)
}


const socket = io({
    auth: { playerData }
});

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
