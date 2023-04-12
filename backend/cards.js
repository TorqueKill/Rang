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
    Rank[Rank["Ace"] = 0] = "Ace";
    Rank[Rank["Two"] = 1] = "Two";
    Rank[Rank["Three"] = 2] = "Three";
    Rank[Rank["Four"] = 3] = "Four";
    Rank[Rank["Five"] = 4] = "Five";
    Rank[Rank["Six"] = 5] = "Six";
    Rank[Rank["Seven"] = 6] = "Seven";
    Rank[Rank["Eight"] = 7] = "Eight";
    Rank[Rank["Nine"] = 8] = "Nine";
    Rank[Rank["Ten"] = 9] = "Ten";
    Rank[Rank["Jack"] = 10] = "Jack";
    Rank[Rank["Queen"] = 11] = "Queen";
    Rank[Rank["King"] = 12] = "King";
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
    return Deck;
}());
exports.Deck = Deck;
