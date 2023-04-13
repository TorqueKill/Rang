//@ts-nocheck
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


const waitForResponses = (responseEvent, callback) => {
    return new Promise((resolve) => {
      let responses = 0;
      const checkResponses = (res) => {
        if (res && callback) {
            callback(res);
        }
        responses++;
        if (responses === usersReady.length) {
            resolve();
        }
      };
      usersReady.forEach((user) => {
        clients[user.socketId].once(responseEvent, (res) => {
          checkResponses(res);
        });
      });
    });
  };
  

const waitSingleResponse = (responseEvent, socketId) => {
    return new Promise<any>((resolve) => {
        clients[socketId].once(responseEvent, (res)=>{resolve(res)})
    })
}

const pause = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds*1000)
    })
}


let numUsers = 0;
let messages:string[] = []
let usersReady:any[] = []
let deck = new Deck()
let colorOfTheGame
let round = 0
let roundLeadingColor
let userCards:any[] = []

//play order given to users with highest rank followed non team member
//if R1 has highest rank, then play order is R1, A1, R2, A2 
let playOrder:any[] = []

//team R is usersReady[0] and usersReady[2] while team A is usersReady[1] and usersReady[3]
let teams:any[] = [{name:"Team1", score:0, players:[]}, {name:"Team2", score:0, players:[]}]

let clients = {}

const makeTeams = () =>{
    teams[0].players = [usersReady[0].name, usersReady[2].name]
    teams[1].players = [usersReady[1].name, usersReady[3].name]
    let teamString = `${teams[0].name}: ${teams[0].players[0]}, ${teams[0].players[1]} and ${teams[1].name}: ${teams[1].players[0]}, ${teams[1].players[1]}`
    io.emit("message",{message:teamString})
}

const getPlayOrder = (highestRankUser) =>{
    let index = usersReady.indexOf(highestRankUser)
    playOrder = []
    for(let i = 0; i < usersReady.length; i++){
        playOrder.push(usersReady[(index+i)%usersReady.length])
    }
    return playOrder

}

const displayPlayOrder = () =>{
    let playOrderString = ""
    for(let i = 0; i < playOrder.length; i++){
        playOrderString += playOrder[i].name
        if (i !== playOrder.length-1){
            playOrderString += ", "
        }
    }
    return playOrderString
}

//returns suit number of given suit given in string
const getSuit = (suit) =>{
    switch(suit){
        case "spades":
            return 3
        case "hearts":
            return 2
        case "clubs":
            return 0
        case "diams":
            return 1
    }
}

//given suit number, give string of suit
const getColor = (suit) =>{
    switch(suit){
        case 3:
            return "spades"
        case 2:
            return "hearts"
        case 0:
            return "clubs"
        case 1:
            return "diams"
    }
}
    





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
    //shuffle deck
    deck.shuffle()
    while(!roundValid){
        drawnCards = []
        for(let i = 0; i < usersReady.length; i++){
            let card = deck.drawCard()
            drawnCards.push(card)
        }
        console.log("test")
        roundValid = validateRoundStart(drawnCards)
        //if round is not valid, put cards back in deck and shuffle
        if (!roundValid){
            deck.cards = deck.cards.concat(drawnCards)
            deck.shuffle()
        }
    }
    //send cards to users
    let toClients:any[] = []
    let highestRank
    let highestRankUser
    for(let i = 0; i < usersReady.length; i++){
        let user = usersReady[i]
        let card = drawnCards[i]
        console.log(user.name, card)
        toClients.push({id:user.socketId, cards:card, name:user.name})
        //get highest rank of drawn cards
        if (i === 0){
            highestRank = card.rank
            highestRankUser = user
        }else{
            if (card.rank > highestRank){
                highestRank = card.rank
                highestRankUser = user
            }
        }
        //clients[user.socketId].emit("drawnStartCards",card)
    }

    //send cards to clients
    await pause(1)
    io.emit('message',{message:"start round cards drawn"})
    io.emit('drawnStartCards',toClients)
    io.emit('cardToBeShown',toClients)

    //determine play order
    playOrder = getPlayOrder(highestRankUser)
    //display in the form of R1, A1, R2, A2
    let playOrderString = displayPlayOrder()
    console.log("play order: ", playOrderString)
    await pause(1)
    io.emit("message",{message:"play order: "+playOrderString})

    //give 5 cards to the highest rank user
    let highestRankUserCards = []
    for(let i = 0; i < 5; i++){
        highestRankUserCards.push(deck.drawCard())
    }
    console.log("highest rank user cards: ", highestRankUserCards)
    io.emit("drawCards",[{id:highestRankUser.socketId, cards:highestRankUserCards}])
    userCards.push({id:highestRankUser.socketId, cards:highestRankUserCards})


    //game is in color selection phase
    io.emit("chooseColor",{name:highestRankUser.name, id:highestRankUser.socketId})

    //wait for color to be chosen by highest rank user
    await pause(1)
    io.emit("message",{message:`${highestRankUser.name} is choosing a color`})
    let res = await waitSingleResponse("colorChosen", highestRankUser.socketId)
    console.log("color chosen: ", res)
    colorOfTheGame = getSuit(res)

    //send color to all clients
    await pause(1)
    io.emit("message",{message:"color chosen: "+res})
    io.emit("removeStartCards")
    io.emit("removeShownCards")

    //put the cards back in the deck and shuffle
    console.log("cards left: ", deck.cardsLeft())
    drawnCards.forEach((card)=>{
        deck.addCard(card)
    })
    console.log("cards left after putting back: ", deck.cardsLeft())
    deck.shuffle()

    //draw 5 cards and distribute to other users than the highest rank user
    let otherUsersCards:any[] = []
    for(let i = 0; i < usersReady.length; i++){
        let user = usersReady[i]
        if (user !== highestRankUser){
            let cards = []
            for(let j = 0; j < 5; j++){
                cards.push(deck.drawCard())
            }
            otherUsersCards.push({id:user.socketId, cards:cards})
        }
    }
    //console.log("other users cards: ", otherUsersCards)
    io.emit("drawCards",otherUsersCards)
    userCards.push(...otherUsersCards)



}

const removeUserCards = (user,cards) =>{
    for(let i = 0; i < userCards.length; i++){
        if (userCards[i].id === user.socketId){
            let userCardsList = userCards[i].cards
            for(let j = 0; j < cards.length; j++){
                let index = userCardsList.indexOf(cards[j])
                if (index !== -1){
                    userCardsList.splice(index,1)
                }
            }
            userCards[i].cards = userCardsList
        }
    }
} 



const validateRoundCard = (card, roundcards, user) =>{
    //if roundcards are empty then retrun true
    if (roundcards.length === 0){
        io.emit("message",{message:`${user.name} is leading with ${getColor(card.suit)}`})
        roundLeadingColor = card.suit
        return true
    }

    //playing card suit of the color of the game is allowed
    if (card.suit === colorOfTheGame){
        return true
    }

    if (card.suit === roundLeadingColor){
        return true
    }
    
    //check if user has a suit of the color of the leading card
    for(let i = 0; i < userCards.length; i++){
            if (userCards[i].id === user.socketId){
                let cards = userCards[i].cards
                console.log("cards: ", cards, "user: ",user.name, "round leading color: ", roundLeadingColor, "globalColor: ", colorOfTheGame)
                for(let j = 0; j < cards.length; j++){
                    if (cards[j].suit === roundLeadingColor){
                        return false
                    }
                }
            }
    }
    //if user does not have a suit of the color of the leading card then return true
    return true
}

const determineWinner = (roundCards) =>{
    //the highest rank of the leading round color wins
    let highestRank = 0
    let winner
    for(let i = 0; i < roundCards.length; i++){
        let card = roundCards[i].card
        if (card.suit === roundLeadingColor){
            if (card.rank > highestRank){
                highestRank = card.rank
                winner = roundCards[i].user
            }
        }
    }
    //set play order
    playOrder = getPlayOrder(winner)
    return winner
}

const gameRound = async () =>{
    await pause(1)
    let roundCards:any[] = []
    io.emit("message",{message:`Round: ${round+1}`})

    for(let i = 0; i < playOrder.length; i++){
        await pause(1)
        io.emit("message",{message:`${playOrder[i].name}'s turn`})
        
        //wait for user to play a card and validate played card
        let res = await waitSingleResponse("cardPlayed", playOrder[i].socketId)
        console.log("card played: ", res, " by ", playOrder[i].name)

        await pause(0.1)
        while(!validateRoundCard(res, roundCards, playOrder[i])){

            //send error message to client
            io.emit("ALERT",{message:"invalid card played", id:playOrder[i].socketId})
            //replay a card
            res = await waitSingleResponse("cardPlayed", playOrder[i].socketId)
            console.log("card played: ", res)
        }
        roundCards.push({card:res, user:playOrder[i]})
        //send card to all clients
        io.emit("cardToBeShown",[{id:playOrder[i].socketId, cards:res, name:playOrder[i].name}])
        await pause(0.01)

        //if suit is same as color of the game then change the color of the round
        //if color of round is same as played card then dont change the color of the round
        if (res.suit === colorOfTheGame && res.suit !== roundLeadingColor){
            roundLeadingColor = colorOfTheGame
            io.emit("message",{message:"color changed to "+getColor(colorOfTheGame)})
        }

        //remove card from user
        io.emit("removeCard",{id:playOrder[i].socketId, cards:res})
        //remove card from userCards
        removeUserCards(playOrder[i], [res])
        await pause(0.05)
    }

    await pause(1)
    //determine winner
    let winner = determineWinner(roundCards)
    console.log("winner: ", winner.name)
    io.emit("message",{message:`${winner.name} won the round`})
    //remove all cards from the table
    io.emit("removeShownCards")
    //increment team scores
    teams.forEach((team)=>{
        if (team.players.includes(winner.name)){
            team.score += 1
        }
    })
    //show team scores
    await pause(1)
    io.emit("message",{message:`${teams[0].name}: ${teams[0].score} ${teams[1].name}: ${teams[1].score}`})

    round += 1;

    //if round 2 then draw 8 cards for each player
    if (round === 1){
        let toClients:any[] = []
        await pause(1)
        io.emit("message",{message:"drawing 8 cards"})
        await pause(1)
        for(let i = 0; i < usersReady.length; i++){
            let cards = []
            for(let j = 0; j < 8; j++){
                cards.push(deck.drawCard())
            }
            toClients.push({id:usersReady[i].socketId, cards:cards})
        }
        io.emit("drawCards",toClients)
        //add cards to userCards
        for(let i = 0; i < toClients.length; i++){
            for(let j = 0; j < userCards.length; j++){
                if (userCards[j].id === toClients[i].id){
                    userCards[j].cards = userCards[j].cards.concat(toClients[i].cards)
                }
            }
        }

    }

}

const determineTeamWinner = () =>{
    let team1Score = 0
    let team2Score = 0
    teams.forEach((team)=>{
        if (team.name === "Team1"){
            team1Score = team.score
        }else{
            team2Score = team.score
        }
    })
    if (team1Score > team2Score){
        io.emit("message",{message:`${teams[0].name} won the game`})
    }else if (team2Score > team1Score){
        io.emit("message",{message:`${teams[1].name} won the game`})
    }else{
        io.emit("message",{message:`game tied`})
    }
    io.emit("message",{message:"game over"})

}


// returns game over when complete
const game = async () =>{
    io.emit("startingGame")
    //wait for client to load game
    await waitForResponses("startGame")
    console.log("players ready")
    //assign teams
    makeTeams()
    await pause(1)
    //start round
    await startRound()
    console.log("starting game")
    //game loop until round = 6
    while(round < 6){
        await gameRound()
    }
    //determine team winner
    determineTeamWinner()


}





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
            await game();
        }
    })

    socket.on("disconnect",()=>{
        if (usersReady.length === 4){
            //remake deck
            deck.remakeDeck()
        }
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
        //send the message to all users with given name
        let sender = usersReady.find((user)=>{
            return user.socketId === socket.id
        })
        io.emit("message",`${sender.name}: message`)
    })

})



