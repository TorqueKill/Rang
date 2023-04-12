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
var waitForResponses = function (responseEvent) {
    return new Promise(function (resolve) {
        var responses = 0;
        var checkResponses = function (res) {
            if (res) {
                console.log(res);
            }
            responses++;
            if (responses === usersReady.length) {
                resolve();
            }
        };
        usersReady.forEach(function (user) {
            clients[user.socketId].once(responseEvent, function (res) { checkResponses(res); });
        });
    });
};
var numUsers = 0;
var messages = [];
var usersReady = [];
var deck = new cards_1.Deck();
var clients = {};
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
    var drawnCards, roundValid, i, card, i, user, card;
    return __generator(this, function (_a) {
        drawnCards = [];
        roundValid = false;
        while (!roundValid) {
            drawnCards = [];
            for (i = 0; i < usersReady.length; i++) {
                card = deck.drawCard();
                drawnCards.push(card);
            }
            console.log("test");
            roundValid = validateRoundStart(drawnCards);
        }
        //send cards to users
        for (i = 0; i < usersReady.length; i++) {
            user = usersReady[i];
            card = drawnCards[i];
            console.log(user.name, card);
            clients[user.socketId].emit("startCard", card);
        }
        io.emit('message', { message: "cards drawn" });
        return [2 /*return*/];
    });
}); };
// returns game over when complete
var game = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); };
/*
io.on("joinLobby", async (name, socket) => {
    console.log(name," joined lobby");
    usersReady.push({name:name, socketId:socket.id})
    console.log(usersReady.length)
    clients[socket.id] = socket
    io.emit("newUserReady",usersReady.length)
  
    //if all users are ready, start the game
    if (usersReady.length === 4){
        console.log("check")
        io.emit("startingGame")
        await waitForResponses("startGame")
        console.log("starting game")
    }
})*/
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
                        if (!(usersReady.length === 4)) return [3 /*break*/, 3];
                        io.emit("startingGame");
                        return [4 /*yield*/, waitForResponses("startGame")];
                    case 1:
                        _a.sent();
                        console.log("players ready");
                        return [4 /*yield*/, startRound()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on("disconnect", function () {
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
            //send the message to all users
            io.emit("message", message);
        });
        return [2 /*return*/];
    });
}); });
