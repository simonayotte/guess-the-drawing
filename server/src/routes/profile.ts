import express, { Request, Response } from 'express'

// import database
import { getUserGameHistory, getGamePlayers } from '../database/UserProfile/userGameHistory'
import { getUserLoginHistory } from '../database/UserProfile/userLoginHistory'
import { getUserIdentity } from '../database/UserProfile/userIdentity'
import { getUserStatistics } from '../database/UserProfile/userStatistics'
import { getUsername } from '../database/login'

// import models
import { UserGameHistory } from '../models/UserProfile/game-history'
import { UserLoginHistory } from '../models/UserProfile/login-history'
import { UserIdentity } from '../models/UserProfile/user-identity'
import { UserStatistics } from '../models/UserProfile/statistics'

export const router = express.Router({
    strict: true
});

/*
The user send the player id
Request form :
{
    idplayer : 1
} */

router.post('/identity', async (req, res) => {
    try {
        let result = await getUserIdentity(req.body.idplayer);
        const identity: UserIdentity = {
            firstName: result.firstname,
            lastName: result.lastname,
            email: result.email,
            avatar: result.avatar
        }
        res.status(200).json(identity);
        return;
    } catch(err) {
        res.status(400).json(err);
    }
});

router.post('/statistics', async (req, res) => {
    try {
        let result = await getUserStatistics(req.body.idplayer);
        const statistics: UserStatistics = {
            gamePlayed: result.gamesplayed,
            winRate: result.winrate,
            averageTimePerGame: result.averagetimepergame,
            totalTimePlayed: result.totaltimeplayed,
            bestScoreSprintSolo: result.bestscoresprintsolo,
            likes: result.likes,
            dislikes: result.dislikes
        }
        res.status(200).json(statistics);
        return;
    } catch(err) {
        res.status(400).json(err);
    }
});

router.post('/gamehistory', async (req, res) => {
    try {
        var result = await getUserGameHistory(req.body.idplayer);
        var gameHistoryList = new Array<UserGameHistory>();

        for (const game of result) {
            var players = await getGamePlayers(game.idgame);
            var playersList = new Array<string>();

            players.forEach((player : any) => {
                playersList.push(player.username)
            })
            const userGameHistory : UserGameHistory = {
                gameModeId: game.gamemodeid,
                gameDate: game.gamedate,
                gameResult: game.result,
                players: playersList, 
                iswinner: game.iswinner 
            }
            
            gameHistoryList.push(userGameHistory);
        }
        
        res.status(200).json(gameHistoryList);
        return;
    } catch(err) {
        res.status(400).json(err);
    }
});


router.post('/loginhistory', async (req, res) => {
    try {
        let result = await getUserLoginHistory(req.body.idplayer);
        var loginHistory = new Array<UserLoginHistory>();
        result.forEach((login : any) => {
            const userLogin : UserLoginHistory = {
                isLogin: login.islogin, 
                loginDate: login.logindate
            }
            loginHistory.push(userLogin)
        }); 
        res.status(200).json(loginHistory);
        return;
    } catch(err) {
        res.status(400).json(err);
    } 
});