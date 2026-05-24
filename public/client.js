const socket = io();

const countText = document.getElementById("count");
const button = document.getElementById("button");

// Receive updated count
socket.on("updateCount", (count) => {

    countText.textContent = count;

});

// Button click
button.addEventListener("click", () => {

    socket.emit("increaseCount");

});
