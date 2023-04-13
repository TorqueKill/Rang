// @ts-nocheck
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCards,clearCards,removeCard } from '../../redux/handCards';
import { useEffect, useState } from 'react';

enum Suit {
  clubs,
  diams,
  hearts,
  spades
}

export default function Cards({socket, startCards}) {
  const { cards } = useSelector((state) => state.cardsInHand);
  const dispatch = useDispatch();

  const handleClick = (card) => {
    console.log('Cards comp: clicked: ', card)
    socket.emit('cardPlayed',card)
  };

  const [turn, setTurn] = useState(true)

  useEffect(() => {
    if (startCards) {
      dispatch(addCards(startCards));
    }

    socket.on('drawCards', (data) => {
      console.log('Cards comp: cardsDrawn: ', data)
      let obj = data.filter((item) => item.id === socket.id)
      console.log(obj)
      if(obj.length > 0){
        dispatch(addCards(obj[0].cards))
      }
    })

    socket.on('removeStartCards', () => {
      dispatch(removeCard(startCards))
    })

    socket.on('removeCard', (data) => {
      console.log('Cards comp: remove card:', data)
      //match id and remove card
      if (data.id === socket.id) {
        dispatch(removeCard(data.cards))
      }
    })
    
    return () => {
      socket.off('drawCards')
      socket.off('removeCard')
      socket.off('removeStartCards')
    }
  }, [socket, startCards, dispatch])

  return (
    <div>
      <div className="right-side-container my-cards-container">
        <h1>My Cards</h1>
        <div className="my-cards-inner-container">
          <ul className="hand">
            {cards.map((card, index) => {
              let rankStr = card.rank;
              if (card.rank === 9) { rankStr = 'j' }
              else if (card.rank === 10) { rankStr = 'q' }
              else if (card.rank === 11) { rankStr = 'k' }
              else if (card.rank === 12) { rankStr = 'a' }
              else { rankStr = card.rank + 2 }

              //console.log(`card rank-${rankStr} ${Suit[card.suit]}`)
              return (
                <li key={index}>
                  <a
                    className={`card rank-${rankStr} ${Suit[card.suit]}`}
                    onClick={turn ? ()=>{handleClick(card)} : undefined}
                  >
                    <span className="rank">{rankStr}</span>
                    {card.suit===3 && <span className="suit">&spades;</span>}
                    {card.suit===2 && <span className="suit">&hearts;</span>}
                    {card.suit===1 && <span className="suit">&diams;</span>}
                    {card.suit===0 && <span className="suit">&clubs;</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
