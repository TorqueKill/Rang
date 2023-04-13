"use strict";
// This file contains the classes for the card game.
exports.__esModule = true;
exports.Rank = exports.Suit = exports.Card = exports.Deck = void 0;
var Suit;
(function (Suit) {
    Suit[Suit["Clubs"] = 0] = "Clubs";
    Suit[Suit["Diamonds"] = 1] = "Diamonds";
    Suit[Suit["Hearts"] = 2] = "Hearts";
    Suit[Suit["Spades"] = 3] = "Spades";
})(Suit || (Suit = {}));
exports.Suit = Suit;
var Rank;
(function (Rank) {
    Rank[Rank["Two"] = 0] = "Two";
    Rank[Rank["Three"] = 1] = "Three";
    Rank[Rank["Four"] = 2] = "Four";
    Rank[Rank["Five"] = 3] = "Five";
    Rank[Rank["Six"] = 4] = "Six";
    Rank[Rank["Seven"] = 5] = "Seven";
    Rank[Rank["Eight"] = 6] = "Eight";
    Rank[Rank["Nine"] = 7] = "Nine";
    Rank[Rank["Ten"] = 8] = "Ten";
    Rank[Rank["Jack"] = 9] = "Jack";
    Rank[Rank["Queen"] = 10] = "Queen";
    Rank[Rank["King"] = 11] = "King";
    Rank[Rank["Ace"] = 12] = "Ace";
})(Rank || (Rank = {}));
exports.Rank = Rank;
var Card = /** @class */ (function () {
    function Card(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
    Card.prototype.toString = function () {
        return "".concat(Rank[this.rank], " of ").concat(Suit[this.suit]);
    };
    return Card;
}());
exports.Card = Card;
var Deck = /** @class */ (function () {
    function Deck() {
        this.cards = [];
        for (var suit = 0; suit < 4; suit++) {
            for (var rank = 0; rank < 13; rank++) {
                this.cards.push(new Card(suit, rank));
            }
        }
    }
    Deck.prototype.shuffle = function () {
        var currentIndex = this.cards.length;
        var temporaryValue;
        var randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            temporaryValue = this.cards[currentIndex];
            this.cards[currentIndex] = this.cards[randomIndex];
            this.cards[randomIndex] = temporaryValue;
        }
    };
    Deck.prototype.drawCard = function () {
        if (this.cards.length <= 0) {
            console.log("no more cards");
            return undefined;
        }
        return this.cards.pop();
    };
    Deck.prototype.addCard = function (card) {
        this.cards.push(card);
    };
    Deck.prototype.remakeDeck = function () {
        this.cards = [];
        for (var suit = 0; suit < 4; suit++) {
            for (var rank = 0; rank < 13; rank++) {
                this.cards.push(new Card(suit, rank));
            }
        }
    };
    Deck.prototype.cardsLeft = function () {
        return this.cards.length;
    };
    return Deck;
}());
exports.Deck = Deck;
