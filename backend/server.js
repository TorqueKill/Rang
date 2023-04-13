"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
//@ts-nocheck
var Socket = require("socket.io").Socket;
var express = require("express");
var app = express();
var http = require("http");
var Server = require('socket.io').Server;
var cors = require('cors');
//import classes from "./cards"
var cards_1 = require("./cards");
app.use(cors());
var server = http.createServer(app);
var io = new Server(server, { cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});
var waitForResponses = function (responseEvent, callback) {
    return new Promise(function (resolve) {
        var responses = 0;
        var checkResponses = function (res) {
            if (res && callback) {
                callback(res);
            }
            responses++;
            if (responses === usersReady.length) {
                resolve();
            }
        };
        usersReady.forEach(function (user) {
            clients[user.socketId].once(responseEvent, function (res) {
                checkResponses(res);
            });
        });
    });
};
var waitSingleResponse = function (responseEvent, socketId) {
    return new Promise(function (resolve) {
        clients[socketId].once(responseEvent, function (res) { resolve(res); });
    });
};
var pause = function (seconds) {
    return new Promise(function (resolve) {
        setTimeout(resolve, seconds * 1000);
    });
};
var numUsers = 0;
var messages = [];
var usersReady = [];
var deck = new cards_1.Deck();
var colorOfTheGame;
var round = 0;
var roundLeadingColor;
var userCards = [];
//play order given to users with highest rank followed non team member
//if R1 has highest rank, then play order is R1, A1, R2, A2 
var playOrder = [];
//team R is usersReady[0] and usersReady[2] while team A is usersReady[1] and usersReady[3]
var teams = [{ name: "Team1", score: 0, players: [] }, { name: "Team2", score: 0, players: [] }];
var clients = {};
var makeTeams = function () {
    teams[0].players = [usersReady[0].name, usersReady[2].name];
    teams[1].players = [usersReady[1].name, usersReady[3].name];
    var teamString = "".concat(teams[0].name, ": ").concat(teams[0].players[0], ", ").concat(teams[0].players[1], " and ").concat(teams[1].name, ": ").concat(teams[1].players[0], ", ").concat(teams[1].players[1]);
    io.emit("message", { message: teamString });
};
var getPlayOrder = function (highestRankUser) {
    var index = usersReady.indexOf(highestRankUser);
    playOrder = [];
    for (var i = 0; i < usersReady.length; i++) {
        playOrder.push(usersReady[(index + i) % usersReady.length]);
    }
    return playOrder;
};
var displayPlayOrder = function () {
    var playOrderString = "";
    for (var i = 0; i < playOrder.length; i++) {
        playOrderString += playOrder[i].name;
        if (i !== playOrder.length - 1) {
            playOrderString += ", ";
        }
    }
    return playOrderString;
};
//returns suit number of given suit given in string
var getSuit = function (suit) {
    switch (suit) {
        case "spades":
            return 3;
        case "hearts":
            return 2;
        case "clubs":
            return 0;
        case "diams":
            return 1;
    }
};
//given suit number, give string of suit
var getColor = function (suit) {
    switch (suit) {
        case 3:
            return "spades";
        case 2:
            return "hearts";
        case 0:
            return "clubs";
        case 1:
            return "diams";
    }
};
//checks if all drawn cards are not the same rank
//function is given list of drawn cards and returns true if all cards are not the same rank
var validateRoundStart = function (drawnCards) {
    console.log(drawnCards);
    var ranks = drawnCards.map(function (card) {
        return card.rank;
    });
    for (var i = 0; i < ranks.length; i++) {
        for (var j = i + 1; j < ranks.length; j++) {
            if (ranks[i] === ranks[j]) {
                return false;
            }
        }
    }
    return true;
};
var startRound = function () { return __awaiter(void 0, void 0, void 0, function () {
    var drawnCards, roundValid, i, card, toClients, highestRank, highestRankUser, i, user, card, playOrderString, highestRankUserCards, i, res, otherUsersCards, i, user, cards, j;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                drawnCards = [];
                roundValid = false;
                //shuffle deck
                deck.shuffle();
                while (!roundValid) {
                    drawnCards = [];
                    for (i = 0; i < usersReady.length; i++) {
                        card = deck.drawCard();
                        drawnCards.push(card);
                    }
                    console.log("test");
                    roundValid = validateRoundStart(drawnCards);
                    //if round is not valid, put cards back in deck and shuffle
                    if (!roundValid) {
                        deck.cards = deck.cards.concat(drawnCards);
                        deck.shuffle();
                    }
                }
                toClients = [];
                for (i = 0; i < usersReady.length; i++) {
                    user = usersReady[i];
                    card = drawnCards[i];
                    console.log(user.name, card);
                    toClients.push({ id: user.socketId, cards: card, name: user.name });
                    //get highest rank of drawn cards
                    if (i === 0) {
                        highestRank = card.rank;
                        highestRankUser = user;
                    }
                    else {
                        if (card.rank > highestRank) {
                            highestRank = card.rank;
                            highestRankUser = user;
                        }
                    }
                    //clients[user.socketId].emit("drawnStartCards",card)
                }
                //send cards to clients
                return [4 /*yield*/, pause(1)];
            case 1:
                //send cards to clients
                _a.sent();
                io.emit('message', { message: "start round cards drawn" });
                io.emit('drawnStartCards', toClients);
                io.emit('cardToBeShown', toClients);
                //determine play order
                playOrder = getPlayOrder(highestRankUser);
                playOrderString = displayPlayOrder();
                console.log("play order: ", playOrderString);
                return [4 /*yield*/, pause(1)];
            case 2:
                _a.sent();
                io.emit("message", { message: "play order: " + playOrderString });
                highestRankUserCards = [];
                for (i = 0; i < 5; i++) {
                    highestRankUserCards.push(deck.drawCard());
                }
                console.log("highest rank user cards: ", highestRankUserCards);
                io.emit("drawCards", [{ id: highestRankUser.socketId, cards: highestRankUserCards }]);
                userCards.push({ id: highestRankUser.socketId, cards: highestRankUserCards });
                //game is in color selection phase
                io.emit("chooseColor", { name: highestRankUser.name, id: highestRankUser.socketId });
                //wait for color to be chosen by highest rank user
                return [4 /*yield*/, pause(1)];
            case 3:
                //wait for color to be chosen by highest rank user
                _a.sent();
                io.emit("message", { message: "".concat(highestRankUser.name, " is choosing a color") });
                return [4 /*yield*/, waitSingleResponse("colorChosen", highestRankUser.socketId)];
            case 4:
                res = _a.sent();
                console.log("color chosen: ", res);
                colorOfTheGame = getSuit(res);
                //send color to all clients
                return [4 /*yield*/, pause(1)];
            case 5:
                //send color to all clients
                _a.sent();
                io.emit("message", { message: "color chosen: " + res });
                io.emit("removeStartCards");
                io.emit("removeShownCards");
                //put the cards back in the deck and shuffle
                console.log("cards left: ", deck.cardsLeft());
                drawnCards.forEach(function (card) {
                    deck.addCard(card);
                });
                console.log("cards left after putting back: ", deck.cardsLeft());
                deck.shuffle();
                otherUsersCards = [];
                for (i = 0; i < usersReady.length; i++) {
                    user = usersReady[i];
                    if (user !== highestRankUser) {
                        cards = [];
                        for (j = 0; j < 5; j++) {
                            cards.push(deck.drawCard());
                        }
                        otherUsersCards.push({ id: user.socketId, cards: cards });
                    }
                }
                //console.log("other users cards: ", otherUsersCards)
                io.emit("drawCards", otherUsersCards);
                userCards.push.apply(userCards, otherUsersCards);
                return [2 /*return*/];
        }
    });
}); };
var removeUserCards = function (user, cards) {
    for (var i = 0; i < userCards.length; i++) {
        if (userCards[i].id === user.socketId) {
            var userCardsList = userCards[i].cards;
            for (var j = 0; j < cards.length; j++) {
                var index = userCardsList.indexOf(cards[j]);
                if (index !== -1) {
                    userCardsList.splice(index, 1);
                }
            }
            userCards[i].cards = userCardsList;
        }
    }
};
var validateRoundCard = function (card, roundcards, user) {
    //if roundcards are empty then retrun true
    if (roundcards.length === 0) {
        io.emit("message", { message: "".concat(user.name, " is leading with ").concat(getColor(card.suit)) });
        roundLeadingColor = card.suit;
        return true;
    }
    //playing card suit of the color of the game is allowed
    if (card.suit === colorOfTheGame) {
        return true;
    }
    if (card.suit === roundLeadingColor) {
        return true;
    }
    //check if user has a suit of the color of the leading card
    for (var i = 0; i < userCards.length; i++) {
        if (userCards[i].id === user.socketId) {
            var cards = userCards[i].cards;
            console.log("cards: ", cards, "user: ", user.name, "round leading color: ", roundLeadingColor, "globalColor: ", colorOfTheGame);
            for (var j = 0; j < cards.length; j++) {
                if (cards[j].suit === roundLeadingColor) {
                    return false;
                }
            }
        }
    }
    //if user does not have a suit of the color of the leading card then return true
    return true;
};
var determineWinner = function (roundCards) {
    //the highest rank of the leading round color wins
    var highestRank = 0;
    var winner;
    for (var i = 0; i < roundCards.length; i++) {
        var card = roundCards[i].card;
        if (card.suit === roundLeadingColor) {
            if (card.rank > highestRank) {
                highestRank = card.rank;
                winner = roundCards[i].user;
            }
        }
    }
    //set play order
    playOrder = getPlayOrder(winner);
    return winner;
};
var gameRound = function () { return __awaiter(void 0, void 0, void 0, function () {
    var roundCards, i, res, winner, toClients, i, cards, j, i, j;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pause(1)];
            case 1:
                _a.sent();
                roundCards = [];
                io.emit("message", { message: "Round: ".concat(round + 1) });
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < playOrder.length)) return [3 /*break*/, 12];
                return [4 /*yield*/, pause(1)];
            case 3:
                _a.sent();
                io.emit("message", { message: "".concat(playOrder[i].name, "'s turn") });
                return [4 /*yield*/, waitSingleResponse("cardPlayed", playOrder[i].socketId)];
            case 4:
                res = _a.sent();
                console.log("card played: ", res, " by ", playOrder[i].name);
                return [4 /*yield*/, pause(0.1)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (!!validateRoundCard(res, roundCards, playOrder[i])) return [3 /*break*/, 8];
                //send error message to client
                io.emit("ALERT", { message: "invalid card played", id: playOrder[i].socketId });
                return [4 /*yield*/, waitSingleResponse("cardPlayed", playOrder[i].socketId)];
            case 7:
                //replay a card
                res = _a.sent();
                console.log("card played: ", res);
                return [3 /*break*/, 6];
            case 8:
                roundCards.push({ card: res, user: playOrder[i] });
                //send card to all clients
                io.emit("cardToBeShown", [{ id: playOrder[i].socketId, cards: res, name: playOrder[i].name }]);
                return [4 /*yield*/, pause(0.01)
                    //if suit is same as color of the game then change the color of the round
                    //if color of round is same as played card then dont change the color of the round
                ];
            case 9:
                _a.sent();
                //if suit is same as color of the game then change the color of the round
                //if color of round is same as played card then dont change the color of the round
                if (res.suit === colorOfTheGame && res.suit !== roundLeadingColor) {
                    roundLeadingColor = colorOfTheGame;
                    io.emit("message", { message: "color changed to " + getColor(colorOfTheGame) });
                }
                //remove card from user
                io.emit("removeCard", { id: playOrder[i].socketId, cards: res });
                //remove card from userCards
                removeUserCards(playOrder[i], [res]);
                return [4 /*yield*/, pause(0.05)];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11:
                i++;
                return [3 /*break*/, 2];
            case 12: return [4 /*yield*/, pause(1)
                //determine winner
            ];
            case 13:
                _a.sent();
                winner = determineWinner(roundCards);
                console.log("winner: ", winner.name);
                io.emit("message", { message: "".concat(winner.name, " won the round") });
                //remove all cards from the table
                io.emit("removeShownCards");
                //increment team scores
                teams.forEach(function (team) {
                    if (team.players.includes(winner.name)) {
                        team.score += 1;
                    }
                });
                //show team scores
                return [4 /*yield*/, pause(1)];
            case 14:
                //show team scores
                _a.sent();
                io.emit("message", { message: "".concat(teams[0].name, ": ").concat(teams[0].score, " ").concat(teams[1].name, ": ").concat(teams[1].score) });
                round += 1;
                if (!(round === 1)) return [3 /*break*/, 17];
                toClients = [];
                return [4 /*yield*/, pause(1)];
            case 15:
                _a.sent();
                io.emit("message", { message: "drawing 8 cards" });
                return [4 /*yield*/, pause(1)];
            case 16:
                _a.sent();
                for (i = 0; i < usersReady.length; i++) {
                    cards = [];
                    for (j = 0; j < 8; j++) {
                        cards.push(deck.drawCard());
                    }
                    toClients.push({ id: usersReady[i].socketId, cards: cards });
                }
                io.emit("drawCards", toClients);
                //add cards to userCards
                for (i = 0; i < toClients.length; i++) {
                    for (j = 0; j < userCards.length; j++) {
                        if (userCards[j].id === toClients[i].id) {
                            userCards[j].cards = userCards[j].cards.concat(toClients[i].cards);
                        }
                    }
                }
                _a.label = 17;
            case 17: return [2 /*return*/];
        }
    });
}); };
var determineTeamWinner = function () {
    var team1Score = 0;
    var team2Score = 0;
    teams.forEach(function (team) {
        if (team.name === "Team1") {
            team1Score = team.score;
        }
        else {
            team2Score = team.score;
        }
    });
    if (team1Score > team2Score) {
        io.emit("message", { message: "".concat(teams[0].name, " won the game") });
    }
    else if (team2Score > team1Score) {
        io.emit("message", { message: "".concat(teams[1].name, " won the game") });
    }
    else {
        io.emit("message", { message: "game tied" });
    }
    io.emit("message", { message: "game over" });
};
// returns game over when complete
var game = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                io.emit("startingGame");
                //wait for client to load game
                return [4 /*yield*/, waitForResponses("startGame")];
            case 1:
                //wait for client to load game
                _a.sent();
                console.log("players ready");
                //assign teams
                makeTeams();
                return [4 /*yield*/, pause(1)
                    //start round
                ];
            case 2:
                _a.sent();
                //start round
                return [4 /*yield*/, startRound()];
            case 3:
                //start round
                _a.sent();
                console.log("starting game");
                _a.label = 4;
            case 4:
                if (!(round < 6)) return [3 /*break*/, 6];
                return [4 /*yield*/, gameRound()];
            case 5:
                _a.sent();
                return [3 /*break*/, 4];
            case 6:
                //determine team winner
                determineTeamWinner();
                return [2 /*return*/];
        }
    });
}); };
server.listen(3001, function () {
    console.log("SERVER IS LISTENING ON PORT 3001");
});
io.on("connection", function (socket) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        numUsers++;
        console.log("user connected with a socket id", socket.id);
        //inform all users taht a new user has joined
        io.emit("newUser", {
            message: "New user has joined",
            numUsers: numUsers,
            usersReady: usersReady.length
        });
        //set name of user (which are also ready)
        //when 4 players are ready, start the game
        socket.on("joinLobby", function (name) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(name, " joined lobby");
                        usersReady.push({ name: name, socketId: socket.id });
                        clients[socket.id] = socket;
                        io.emit("newUserReady", usersReady.length);
                        if (!(usersReady.length === 4)) return [3 /*break*/, 2];
                        return [4 /*yield*/, game()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        socket.on("disconnect", function () {
            if (usersReady.length === 4) {
                //remake deck
                deck.remakeDeck();
            }
            numUsers--;
            //remove user from usersReady
            usersReady = usersReady.filter(function (user) {
                return user.socketId !== socket.id;
            });
            clients[socket.id] = null;
            io.emit("newUserReady", usersReady.length);
            io.emit("userLeft", {
                message: "User has left",
                numUsers: numUsers
            });
            console.log("user disconnected with a socket id", socket.id);
        });
        //if users are above 4, emit a message to all users
        if (numUsers > 4) {
            io.emit("tooManyUsers", {
                message: "Too many users connected"
            });
        }
        //listen to messages from the client
        socket.on("message", function (message) {
            console.log("message received", message, " from ", socket.id);
            messages.push(message);
            //send the message to all users with given name
            var sender = usersReady.find(function (user) {
                return user.socketId === socket.id;
            });
            io.emit("message", "".concat(sender.name, ": message"));
        });
        return [2 /*return*/];
    });
}); });
