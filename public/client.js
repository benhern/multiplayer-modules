const socket = io();

const countText = document.getElementById("count");
const button = document.getElementById("button");
const button2 = document.getElementById("button2")
const playercountText = document.getElementById("playercount")

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
