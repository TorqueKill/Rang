// @ts-nocheck
import React from 'react'
//import types
import { MouseEvent } from 'react'
import { useState, useEffect } from 'react';


//cards are handed out to players by the server
//this component will be used to display the cards that the player has
//the player will be able to click on the cards to play them only if it is their turn
//player turn is given by the server by the turn token
//turn token is a toggled state variable that is set to true when it is the player's turn
//and set to false when player has played a card
export default function Cards({socket}) {
  const handleClick = (e:MouseEvent) => {
    e.preventDefault()
    console.log('clicked')
  }
  const [cards, setCards] = useState([])
  const [turn, setTurn] = useState(false)
  useEffect(() => {
    socket.on("startCard", (card) => {
      console.log(card)
      setCards(card)
    })
    
    return () => {
      socket.off('startCard')
    }
  }, [socket])



  return (
    <div>
        <div className="right-side-container my-cards-container">
          <h1>My Cards</h1>
          <div className="my-cards-inner-container">
            <ul className="hand">
              <li>
                <a className="card rank-7 spades" onClick={handleClick}>
                  <span className="rank">7</span>
                  <span className="suit">&spades;</span>
                </a>
              </li>
              <li>
                <a className="card rank-q hearts">
                  <span className="rank">Q</span>
                  <span className="suit">&hearts;</span>
                </a>
              </li>
              <li>
                <a className="card rank-2 diams">
                  <span className="rank">2</span>
                  <span className="suit">&diam;</span>
                </a>
              </li>
              <li>
                <a className="card rank-a spades">
                  <span className="rank">A</span>
                  <span className="suit">&clubs;</span>
                </a>
              </li>
              <li>
                <a className="card rank-6 diams">
                  <span className="rank">6</span>
                  <span className="suit">&diams;</span>
                </a>
              </li>
            </ul>
        
          </div>
        </div>
    </div>
  )
}
