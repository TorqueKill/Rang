// @ts-nocheck
import React from 'react'
import { useState,useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'

enum Suit {
  clubs,
  diams,
  hearts,
  spades
}


export default function Table({socket,names}) {

  const [turn, setTurn] = useState(false)
  const [color, setColor] = useState('')
  const [shownCards, setShownCards] = useState([])

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), [])

  
  useEffect(() => {
    socket.on("chooseColor", (data) => {
      if (data.id === socket.id){
        setTurn(true)
      }
    })
    //has {name: name, card: {rank:rank, suit:suit}} of all players
    socket.on("cardToBeShown", (data) => {
      console.log("Table comp: cardsToBeShown", data)
      //add the data to shownCards
      setShownCards(prevState => {
        if (prevState.length === 0) {
          return data
        } else {
          return prevState.concat(data)
        }
      })
    })

    socket.on('removeShownCards', () => {
      setShownCards([])
    })


    return () => {
      socket.off('chooseColor')
      socket.off('cardToBeShown')
      socket.off('removeShownCards')
    }
  }, [socket,shownCards])

  const handleColorSelect = (color) => {
    socket.emit('colorChosen',color)
    console.log(color)
    setTurn(false)
  }


  
  return (
    <div>
      <div className="heading-container">
          <h1>Rang</h1>
        </div>
        <div className="game-table-container">
          <div className="game-table">
            <div className="card-area">
              <div className="card-area-rows output-row-one">
                <>
                {shownCards.map((_card,index) => {
                      if (_card.name === names[2]){
                        let card = _card.cards
                        let rankStr = card.rank;
                        if (card.rank === 9) { rankStr = 'j' }
                        else if (card.rank === 10) { rankStr = 'q' }
                        else if (card.rank === 11) { rankStr = 'k' }
                        else if (card.rank === 12) { rankStr = 'a' }
                        else { rankStr = card.rank + 2 }
                        //console.log(`card rank-${rankStr} ${Suit[card.suit]}`)
                        return (
                          <a
                            className={`card rank-${rankStr} ${Suit[card.suit]}`}
                            key={index}
                          >
                            <span className="rank">{rankStr}</span>
                            {card.suit===3 && <span className="suit">&spades;</span>}
                            {card.suit===2 && <span className="suit">&hearts;</span>}
                            {card.suit===1 && <span className="suit">&diams;</span>}
                            {card.suit===0 && <span className="suit">&clubs;</span>}
                          </a>
                )}})}
                </>
              </div>
              <div className="card-area-rows output-row-two">
                <div>
                {shownCards.map((_card,index) => {
                    if (_card.name === names[1]){
                      let card = _card.cards
                      let rankStr = card.rank;
                      if (card.rank === 9) { rankStr = 'j' }
                      else if (card.rank === 10) { rankStr = 'q' }
                      else if (card.rank === 11) { rankStr = 'k' }
                      else if (card.rank === 12) { rankStr = 'a' }
                      else { rankStr = card.rank + 2 }
                      //console.log(`card rank-${rankStr} ${Suit[card.suit]}`)
                      return (
                        <a
                          className={`card rank-${rankStr} ${Suit[card.suit]}`}
                          key={index}
                        >
                          <span className="rank">{rankStr}</span>
                          {card.suit===3 && <span className="suit">&spades;</span>}
                          {card.suit===2 && <span className="suit">&hearts;</span>}
                          {card.suit===1 && <span className="suit">&diams;</span>}
                          {card.suit===0 && <span className="suit">&clubs;</span>}
                        </a>
                     )
                }})}
                </div>
                <div>
                {shownCards.map((_card,index) => {
                    if (_card.name === names[3]){
                      let card = _card.cards
                      let rankStr = card.rank;
                      if (card.rank === 9) { rankStr = 'j' }
                      else if (card.rank === 10) { rankStr = 'q' }
                      else if (card.rank === 11) { rankStr = 'k' }
                      else if (card.rank === 12) { rankStr = 'a' }
                      else { rankStr = card.rank + 2 }
                      //console.log(`card rank-${rankStr} ${Suit[card.suit]}`)
                      return (
                        <a
                          className={`card rank-${rankStr} ${Suit[card.suit]}`}
                          key={index}
                        >
                          <span className="rank">{rankStr}</span>
                          {card.suit===3 && <span className="suit">&spades;</span>}
                          {card.suit===2 && <span className="suit">&hearts;</span>}
                          {card.suit===1 && <span className="suit">&diams;</span>}
                          {card.suit===0 && <span className="suit">&clubs;</span>}
                        </a>
                     )
                }})}
                </div>
              </div>
              <div className="card-area-rows output-row-three">
                <>
                {shownCards.map((_card,index) => {
                    if (_card.name === names[0]){
                      let card = _card.cards
                      let rankStr = card.rank;
                      if (card.rank === 9) { rankStr = 'j' }
                      else if (card.rank === 10) { rankStr = 'q' }
                      else if (card.rank === 11) { rankStr = 'k' }
                      else if (card.rank === 12) { rankStr = 'a' }
                      else { rankStr = card.rank + 2 }
                      //console.log(`card rank-${rankStr} ${Suit[card.suit]}`)
                      return (
                        <a
                          className={`card rank-${rankStr} ${Suit[card.suit]}`}
                          key={index}
                        >
                          <span className="rank">{rankStr}</span>
                          {card.suit===3 && <span className="suit">&spades;</span>}
                          {card.suit===2 && <span className="suit">&hearts;</span>}
                          {card.suit===1 && <span className="suit">&diams;</span>}
                          {card.suit===0 && <span className="suit">&clubs;</span>}
                        </a>
                     )
                }})}
                </>
              </div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-one">{names[0]}</div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-two">{names[1]}</div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-three">{names[2]}</div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-four">{names[3]}</div>
            </div>
          </div>
        </div>
        {turn && <div className="select-rang-container">
          <h3>Select Rang:</h3>
          <button className="button-select-rang" onClick={()=>handleColorSelect("diams")}>Diamond</button>
          <button className="button-select-rang" onClick={()=>handleColorSelect("hearts")}>Hearts</button>
          <button className="button-select-rang" onClick={()=>handleColorSelect("spades")}>Spades</button>
          <button className="button-select-rang" onClick={()=>handleColorSelect("clubs")}>Clubs</button>
        </div>}
    </div>
  )
}
