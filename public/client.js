const gamebox = document.getElementById("gamebox")
const submit_name = document.getElementById("submit-name")

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






// for(let i = 0; i<9; i++){
//     const box = document.createElement("div")
    
//     box.className = "boxes"

//     gamebox.appendChild(box)
// }






