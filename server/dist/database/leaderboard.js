"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const db = require('./database');
// {name: username, points: totalPoints, victories: sumOf (vicModes), classicModeVictories: classicModeVictories, playedGames: gamePlayed}
async function getStats() {
    let promise = new Promise((resolve, reject) => {
        db.query(`SELECT username, totalPoints, (classicVictories + brVictories) AS victories, classicVictories, brVictories, bestScoreSprintSolo, bestScoreCoop, gamesPlayed, likes, dislikes
                FROM log3900db.person
                INNER JOIN log3900db.player ON person.idplayer = player.idplayer
                ORDER BY victories DESC, totalPoints DESC, gamesPlayed ASC;`, [], (err, result) => {
            if (err)
                throw err;
            resolve(result.rows);
        });
    });
    promise.catch((error) => {
        console.error(error);
    });
    return promise;
}
exports.getStats = getStats;
;
