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
    // users.value is below 4, navigate to home page
    useEffect(() => {
        // listen to userLeft event
        socket.on('userLeft', ({numUsers}) => {
            // if numUsers is less than 4, navigate to home page
            if (numUsers < 4) {
                navigate('/');
            }
        });

        // Clean up the socket event listener when the component unmounts
        return () => {
            socket.off('userLeft');
        }
    }, [socket]);
    



  return (
    <div className="main-container playingCards">
        <div className="game-container">
            <Table />
        </div>
        
        <div className="messages-and-cards-container">
            <Messages socket={socket} />
            <Cards socket={socket} />
        </div>
    </div>
  )
}
