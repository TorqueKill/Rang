
const { Socket } = require( "socket.io");
const express = require("express");
const app = express();
const http = require("http");
const {Server} = require('socket.io')
const cors = require('cors')
//import classes from "./cards"
import {Card, Deck, Suit, Rank} from "./cards"

app.use(cors())
const server = http.createServer(app)
const io = new Server(
    server,{cors:{
        origin:"http://localhost:3001",
        methods: ["GET", "POST"]
    },
})

const waitForResponses = (responseEvent) => {
    return new Promise<void>((resolve) => {
        let responses = 0
        const checkResponses = (res) => {
            if (res){console.log(res)}
            responses++
            if (responses === usersReady.length) {
                resolve()
            }
        }
        usersReady.forEach((user) => {
            clients[user.socketId].once(responseEvent, (res)=>{checkResponses(res)})
        })
    })
}



let numUsers = 0;
let messages:string[] = []
let usersReady:any[] = []
let deck = new Deck()

let clients = {}




//checks if all drawn cards are not the same rank
//function is given list of drawn cards and returns true if all cards are not the same rank
const validateRoundStart = (drawnCards) => {
    console.log(drawnCards);
    let ranks = drawnCards.map((card) => {
      return card.rank;
    });
    for (let i = 0; i < ranks.length; i++) {
      for (let j = i + 1; j < ranks.length; j++) {
        if (ranks[i] === ranks[j]) {
          return false;
        }
      }
    }
    return true;
  };



const startRound = async () =>{
    //usersReady indicates order of play/draw
    //for each user, draw a card, make a list and validate, if true then send to client else draw again
    let drawnCards:any[] = []
    let roundValid = false
    while(!roundValid){
        drawnCards = []
        for(let i = 0; i < usersReady.length; i++){
            let card = deck.drawCard()
            drawnCards.push(card)
        }
        console.log("test")
        roundValid = validateRoundStart(drawnCards)
    }
    //send cards to users
    for(let i = 0; i < usersReady.length; i++){
        let user = usersReady[i]
        let card = drawnCards[i]
        console.log(user.name, card)
        clients[user.socketId].emit("startCard",card)
    }
    io.emit('message',{message:"cards drawn"})

}


// returns game over when complete
const game = async () =>{
}

/*
io.on("joinLobby", async (name, socket) => {
    console.log(name," joined lobby");
    usersReady.push({name:name, socketId:socket.id})
    console.log(usersReady.length)
    clients[socket.id] = socket
    io.emit("newUserReady",usersReady.length)
  
    //if all users are ready, start the game
    if (usersReady.length === 4){
        console.log("check")
        io.emit("startingGame")
        await waitForResponses("startGame")
        console.log("starting game")
    }
})*/



server.listen(3001, ()=>{
    console.log("SERVER IS LISTENING ON PORT 3001")
})
io.on("connection",async (socket)=>{
    numUsers++;
    console.log("user connected with a socket id", socket.id)


    //inform all users taht a new user has joined
    io.emit("newUser",{
        message:"New user has joined",
        numUsers:numUsers,
        usersReady:usersReady.length
    })

    //set name of user (which are also ready)
    //when 4 players are ready, start the game
    socket.on("joinLobby", async (name)=>{
        console.log(name," joined lobby");
        usersReady.push({name:name, socketId:socket.id})
        clients[socket.id] = socket
        io.emit("newUserReady",usersReady.length)

        //if all users are ready, start the game
        if (usersReady.length === 4){
            io.emit("startingGame")
            await waitForResponses("startGame")
            console.log("players ready")
            await startRound()
        }
    })

    socket.on("disconnect",()=>{
        numUsers--;
        //remove user from usersReady
        usersReady = usersReady.filter((user)=>{
            return user.socketId !== socket.id
        })
        clients[socket.id] = null
        io.emit("newUserReady",usersReady.length)
        io.emit("userLeft",{
            message:"User has left",
            numUsers:numUsers
        })
        console.log("user disconnected with a socket id", socket.id)
    })
    //if users are above 4, emit a message to all users
    if(numUsers > 4){
        io.emit("tooManyUsers",{
            message:"Too many users connected"
        })
    }

    //listen to messages from the client
    socket.on("message",(message:string)=>{
        console.log("message received", message, " from ", socket.id)
        messages.push(message)
        //send the message to all users
        io.emit("message",message)
    })

})



