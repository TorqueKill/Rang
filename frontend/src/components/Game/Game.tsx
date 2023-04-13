// @ts-nocheck
import React from 'react'
import { Socket } from "socket.io-client" 
import { DefaultEventsMap } from "socket.io/dist/typed-events"
//has all the game components
import Messages from '../Messages/Messages'
import Cards from '../CardsContainer/Cards'
import Table from '../Table/Table'
import { useEffect,useState } from 'react'
import { useNavigate } from "react-router-dom";

interface GameProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> //this is the type for sockets
}


export default function Game({socket}:GameProps) {
    const navigate = useNavigate();
    const [_startCards, setCards] = useState([])
    const [names, setNames] = useState([])
    // users.value is below 4, navigate to home page
    useEffect(() => {
        socket.emit('startGame')
        // listen to userLeft event
        socket.on('userLeft', ({numUsers}) => {
            // if numUsers is less than 4, navigate to home page
            if (numUsers < 4) {
                navigate('/');
            }
        });

        //array of objects in the form of {id:socketid, cards: [card1, card2, card3, card4], name: name}
        socket.on("drawnStartCards", (data) => {
            //save the start cards for the user with the same socket id
            let startCards = []
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === socket.id) {
                    startCards = data[i].cards
                    break
                }
            }
            console.log(data)
            setCards(startCards)
            console.log("game component: ",_startCards)
            

            //save the names of the players
            let names = []
            for (let i = 0; i < data.length; i++) {
                names.push(data[i].name)
            }
            setNames(names)
        })

        socket.on("ALERT", (data) => {
            //check if the user is the one who is being alerted
            if (data.id === socket.id) {
                alert(data.message)
            }
        })

        // Clean up the socket event listener when the component unmounts
        return () => {
            socket.off('userLeft');
            socket.off('drawnStartCards');
            socket.off('ALERT');
        }
    }, []);
    



  return (
    <div className="main-container playingCards">
        <div className="game-container">
            <Table socket={socket} names={names} />
        </div>
        
        <div className="messages-and-cards-container">
            <Messages socket={socket} />
            <Cards socket={socket} startCards={_startCards} />
        </div>
    </div>
  )
}
