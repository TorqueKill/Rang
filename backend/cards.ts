// This file contains the classes for the card game.

enum Suit {
    Clubs,
    Diamonds,
    Hearts,
    Spades
  }
  
enum Rank {
    Ace,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King
}
  
class Card {
    suit: Suit;
    rank: Rank;
  
    constructor(suit: Suit, rank: Rank) {
      this.suit = suit;
      this.rank = rank;
    }
  
    toString(): string {
      return `${Rank[this.rank]} of ${Suit[this.suit]}`;
    }
}
  
class Deck {
    cards: Card[];
  
    constructor() {
      this.cards = [];
  
      for (let suit = 0; suit < 4; suit++) {
        for (let rank = 0; rank < 13; rank++) {
          this.cards.push(new Card(suit, rank));
        }
      }
    }
  
    shuffle(): void {
      let currentIndex = this.cards.length;
      let temporaryValue: Card;
      let randomIndex: number;
  
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
  
        temporaryValue = this.cards[currentIndex];
        this.cards[currentIndex] = this.cards[randomIndex];
        this.cards[randomIndex] = temporaryValue;
      }
    }
  
    drawCard(): Card | undefined {
      return this.cards.pop();
    }


    addCard(card:Card):void{
        this.cards.push(card)
    }

    remakeDeck():void{
        this.cards = [];
        for (let suit = 0; suit < 4; suit++) {
            for (let rank = 0; rank < 13; rank++) {
              this.cards.push(new Card(suit, rank));
            }
          }
    }
}

export {Deck, Card, Suit, Rank}