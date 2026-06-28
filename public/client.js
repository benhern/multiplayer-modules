const gamebox = document.getElementById("gamebox")
const submit_name = document.getElementById("submit-name")
const name = document.getElementById("name")
const namebox = document.getElementById("namebox")

let player = sessionStorage.getItem("player_id")

if(!player)
{
player = crypto.randomUUID()
sessionStorage.setItem("player_id", player)
}

const socket = io()


socket.on("initial_data", (data) => {
sessionStorage.setItem("turn", data.turn)
})

submit_name.addEventListener("click", ()=>{
    const name = document.getElementById("namebox")
    socket.emit("namebox", name.value)
    sessionStorage.setItem("player_name", name.value)
})

socket.emit("player_id", player)

socket.on("Two players are connected", (player_name) => {
    console.log("Two players are connected");
   
    let box_list = createBoxes()
    box_list.forEach((box,index) => {
        box.addEventListener("click", changeColor)
    })

    namebox.style.display="none"
    let username = sessionStorage.getItem("player_name")
    name.innerHTML = `Player Name: ${username}`

})


function createBoxes() {
   //Creates boxes
    gamebox.style.display = "grid"
    submit_name.style.display = "none"
    for(let i = 0; i<9; i++){
    const box = document.createElement("div")
    
    box.className = "boxes"

    gamebox.appendChild(box)
}

let boxes = document.querySelectorAll(".boxes")

return boxes;
}

function changeColor(event){
    let box = event.currentTarget;
    const client_turn = sessionStorage("turn")
    
    box.style.backgroundColor = "red"
}




