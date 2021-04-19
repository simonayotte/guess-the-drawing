"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
// import database
const userGameHistory_1 = require("../database/UserProfile/userGameHistory");
const userLoginHistory_1 = require("../database/UserProfile/userLoginHistory");
const userIdentity_1 = require("../database/UserProfile/userIdentity");
const userStatistics_1 = require("../database/UserProfile/userStatistics");
exports.router = express_1.default.Router({
    strict: true
});
/*
The user send the player id
Request form :
{
    idplayer : 1
} */
exports.router.post('/identity', async (req, res) => {
    console.log('POST : Identity...');
    try {
        let result = await userIdentity_1.getUserIdentity(req.body.idplayer);
        const identity = {
            firstName: result.firstname,
            lastName: result.lastname,
            email: result.email,
            avatar: result.avatar
        };
        res.status(200).json(identity);
        return;
    }
    catch (err) {
        res.status(400).json(err);
    }
});
exports.router.post('/statistics', async (req, res) => {
    console.log('POST : Statistics...');
    try {
        let result = await userStatistics_1.getUserStatistics(req.body.idplayer);
        const statistics = {
            gamePlayed: result.gamesplayed,
            winRate: result.winrate,
            averageTimePerGame: result.averagetimepergame,
            totalTimePlayed: result.totaltimeplayed,
            bestScoreSprintSolo: result.bestscoresprintsolo,
            likes: result.likes,
            dislikes: result.dislikes
        };
        res.status(200).json(statistics);
        return;
    }
    catch (err) {
        res.status(400).json(err);
    }
});
exports.router.post('/gamehistory', async (req, res) => {
    console.log('POST : Game History...');
    try {
        var result = await userGameHistory_1.getUserGameHistory(req.body.idplayer);
        var gameHistoryList = new Array();
        console.log("Result of the getUserGameHistory", result);
        for (const game of result) {
            var players = await userGameHistory_1.getGamePlayers(game.idgame);
            var playersList = new Array();
            players.forEach((player) => {
                console.log("username : ", player.username);
                playersList.push(player.username);
            });
            const userGameHistory = {
                gameModeId: game.gamemodeid,
                gameDate: game.gamedate,
                gameResult: game.result,
                players: playersList,
                iswinner: game.iswinner
            };
            gameHistoryList.push(userGameHistory);
        }
        res.status(200).json(gameHistoryList);
        return;
    }
    catch (err) {
        res.status(400).json(err);
    }
});
exports.router.post('/loginhistory', async (req, res) => {
    console.log('POST : Login History...');
    try {
        let result = await userLoginHistory_1.getUserLoginHistory(req.body.idplayer);
        console.log("Result array from login... ", result);
        var loginHistory = new Array();
        result.forEach((login) => {
            const userLogin = {
                isLogin: login.islogin,
                loginDate: login.logindate
            };
            loginHistory.push(userLogin);
        });
        res.status(200).json(loginHistory);
        return;
    }
    catch (err) {
        res.status(400).json(err);
    }
});
