import React from 'react'

export default function Table() {
  return (
    <div>
      <div className="heading-container">
          <h1>Rang</h1>
        </div>
        <div className="game-table-container">
          <div className="game-table">
            <div className="card-area">
              <div className="card-area-rows output-row-one">
                <div className="card rank-7 spades">
                  <span className="rank">7</span>
                  <span className="suit">&spades;</span>
                </div>
              </div>
              <div className="card-area-rows output-row-two">
                <div className="card rank-7 spades">
                  <span className="rank">7</span>
                  <span className="suit">&spades;</span>
                </div>
                <div className="card rank-7 spades">
                  <span className="rank">7</span>
                  <span className="suit">&spades;</span>
                </div>
              </div>
              <div className="card-area-rows output-row-three">
                <div className="card rank-7 spades">
                  <span className="rank">7</span>
                  <span className="suit">&spades;</span>
                </div>
              </div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-one">Esha</div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-two">Saood</div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-three">Ahmed</div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-four">Mahd</div>
            </div>
          </div>
        </div>
        <div className="select-rang-container">
          <h3>Select Rang:</h3>
          <button className="button-select-rang">Diamond</button>
          <button className="button-select-rang">Hearts</button>
          <button className="button-select-rang">Spades</button>
          <button className="button-select-rang">Clubs</button>
        </div>
    </div>
  )
}
