const countText = document.getElementById("count");
const button = document.getElementById("button");
const button2 = document.getElementById("button2")
const playercountText = document.getElementById("playercount")
const gamebox = document.getElementById("gamebox")


let player = sessionStorage.getItem("playerData")

if(player){
playerData = JSON.parse(player)
}
else{
let player_id = crypto.randomUUID()
sessionStorage.setItem("playerData",JSON.stringify(player_id))
}

const socket = io();




for(let i = 0; i<9; i++){
    const box = document.createElement("div")
    
    box.className = "boxes"

    gamebox.appendChild(box)
}







