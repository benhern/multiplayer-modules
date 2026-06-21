const gamebox = document.getElementById("gamebox")
const submit_name = document.getElementById("submit-name")
const name = document.getElementById("name")

let player = sessionStorage.getItem("player_id")

if(!player)
{
player = crypto.randomUUID()
sessionStorage.setItem("player_id", player)
}

const socket = io()

submit_name.addEventListener("click", ()=>{
    const name = document.getElementById("namebox")
    socket.emit("namebox", name.value)
})

socket.emit("player_id", player)

socket.on("Two players are connected", (player_name) => {
    console.log("Two players are connected");
    gamebox.style.display = "grid"
    submit_name.style.display = "none"
    for(let i = 0; i<9; i++){
    const box = document.createElement("div")
    
    box.className = "boxes"

    gamebox.appendChild(box)
    console.log(player_name)

    name.innerHTML = `Player Name: ${player_name}`
  
}
})





//  gamebox.style.display = "grid"