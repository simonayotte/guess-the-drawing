import e from "express";
import { WordModel } from "../models/WordModel";

const db = require('./database');

export async function updatePlayerStats(idPlayer : number, isWinner: boolean, gameModeId: number, playerResult: number, gameLength: number): Promise<void> {
    const SOLO = 0;
    const COOP = 1;
    const CLASSIC = 2;
    const BR = 3;
    let score = 0;
    
    let promise: Promise<void> = new Promise((resolve) => {
        db.query(`  SELECT bestScoreSprintSolo, bestScoreCoop, classicVictories, brVictories, gamesPlayed, (classicVictories + brVictories) AS totalVictories, totalPoints, winRate, TO_CHAR(totalTimePlayed, 'HH24:MI:SS') AS totalTimePlayed
                    FROM log3900db.Person
                    WHERE Person.idplayer = $1
                    `,
                    [idPlayer],(err: any, result: any) => {
                        if (err) throw err;
                        const gamesPlayed = result.rows[0].gamesplayed + 1;
                        let totalVictories = result.rows[0].totalvictories
                        const totalPoints = result.rows[0].totalpoints + playerResult;
                        let winRate = result.rows[0].winrate
                        const totalTimePlayed: string = result.rows[0].totaltimeplayed
                        let times: string[] = totalTimePlayed.split(':')
                        let seconds  = gameLength + parseInt(times[0]) * 3600 + parseInt(times[1]) * 60 + parseInt(times[2])
                    
                        const newTotalTimePlayed = seconds + "S";
                        
                        let averageTimePerGame = Math.round(seconds/gamesPlayed) + "S";

                        switch(gameModeId){
                            case SOLO: {
                                score = result.rows[0].bestscoresprintsolo
                                if(playerResult > score){
                                    score = playerResult
                                }
                                db.query(`  UPDATE log3900db.Person
                                            SET bestScoreSprintSolo = $2, gamesPlayed = $3, totalPoints = $4, averageTimePerGame = $5, totalTimePlayed = $6
                                            WHERE idplayer = $1
                                    `,
                                    [idPlayer, score, gamesPlayed, totalPoints, averageTimePerGame, newTotalTimePlayed],(err: any, result: any) => {
                                        if (err) throw err;
                                        resolve()
                                    });
                                break;
                            }
                            case COOP: {
                                score = result.rows[0].bestscorecoop
                                if(playerResult > score){
                                    score = playerResult
                                }
                                db.query(`  UPDATE log3900db.Person
                                            SET bestScoreCoop = $2, gamesPlayed = $3, totalPoints = $4, averageTimePerGame = $5, totalTimePlayed = $6
                                            WHERE idplayer = $1
                                    `,
                                    [idPlayer, score, gamesPlayed, totalPoints, averageTimePerGame, newTotalTimePlayed],(err: any, result: any) => {
                                        if (err) throw err;
                                        resolve()
                                    });
                                break;
                            }
                            case CLASSIC: {
                                score = result.rows[0].classicvictories
                                if(isWinner){
                                    score++
                                    totalVictories++;
                                    winRate = totalVictories/gamesPlayed;
                                }
                                db.query(` UPDATE log3900db.Person
                                            SET classicVictories = $2, gamesPlayed = $3, totalPoints = $4, winRate = $5, averageTimePerGame = $6, totalTimePlayed = $7
                                            WHERE idplayer = $1
                                    `,
                                    [idPlayer, score, gamesPlayed, totalPoints, winRate, averageTimePerGame, newTotalTimePlayed],(err: any, result: any) => {
                                        if (err) throw err;
                                        resolve()
                                    });  
                                break;
                            }
                            case BR: {
                                score = result.rows[0].brvictories 
                                if(isWinner){
                                    score++
                                    totalVictories++;
                                    winRate = totalVictories/gamesPlayed;
                                }   
                                db.query(` UPDATE log3900db.Person
                                            SET brVictories = $2, gamesPlayed = $3, totalPoints = $4, winRate = $5, averageTimePerGame = $6, totalTimePlayed = $7
                                            WHERE idplayer = $1
                                    `,
                                    [idPlayer, score, gamesPlayed, totalPoints, winRate, averageTimePerGame, newTotalTimePlayed],(err: any, result: any) => {
                                        if (err) throw err;
                                        resolve()
                                    });  
                                break;
                            }
                            default:{
                                console.log("Mode incompatible")
                                break;
                            }
                    
                        }
                });
    });

    promise.catch((error) => {
        console.error(error);
    });
   
    return promise;
};

export async function addNewPlayerGame(idGame: number, idPlayer: number, isWinner: boolean, result: number): Promise<void> {
    let promise: Promise<void> = new Promise((resolve) => {
        db.query(`INSERT INTO log3900db.PlayerGame(idGame, idPlayer, isWinner, result) VALUES ($1, $2, $3, $4);
               `,
                           [idGame, idPlayer, isWinner, result],(err: any, result: any) => {
                               if (err) throw err;
                               resolve()
                           });
    });

    promise.catch((error) => {
        console.error(error);
    });
   
    return promise;
};

export async function addNewGame(gameModeId: number, difficultyLevel: number, gameLength: number): Promise<number> {
    const gameTime: string = gameLength + "S"
    let promise: Promise<number> = new Promise((resolve) => {
        db.query(`INSERT INTO log3900db.Game(gameModeId, difficultyLevel, gameLength) VALUES ($1, $2, $3) RETURNING idGame;
               `,
                           [gameModeId, difficultyLevel, gameTime],(err: any, result: any) => {
                               if (err) throw err;
                               console.log("la game " + result.rows[0].idgame + " a été ajouté")
                               resolve(result.rows[0].idgame)
                           });
    });

    promise.catch((error) => {
        console.error(error);
    });
   
    return promise;
};


export async function getNewWord(oldWord : string, difficultyLevel: number): Promise<WordModel> {
    let promise: Promise<WordModel> = new Promise((resolve) => {
        db.query(`
               SELECT idDrawing, drawingName, indice, isRandom
               FROM pair_mot_image.Drawing
               WHERE difficultyLevel = $1;`,
                            [difficultyLevel],(err: any, result: any) => {
                               if (err) throw err;
                               if(result.rows.length > 0){
                                    let size = result.rows.length;
                                    let newWord = result.rows[0];

                                    do {
                                        let randomNumber = Math.floor((Math.random()*100))%size;
                                        newWord = result.rows[randomNumber]
                                    } while (newWord.drawingname == oldWord);
                                    let returnWord: WordModel = {idDrawing: newWord.iddrawing,
                                        drawingName: newWord.drawingname,
                                        indice: newWord.indice,
                                        isRandom: newWord.israndom} 
                                   resolve(returnWord);
                               }
                           });
    });

    promise.catch((error) => {
        console.error(error);
    });
   
    return promise;
};

export async function getLine(idDrawing: number) {
    return new Promise((resolve, reject) => {
        db.query(`
        SELECT point, thickness, color, pathorder
        FROM pair_mot_image.Line
        WHERE Line.idDrawing = $1
        `, [idDrawing], (err2: any, returnData: any) => {
            if (err2) throw err2;
            resolve(returnData.rows);
        });
    });
};