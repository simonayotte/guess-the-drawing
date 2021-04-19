"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStatistics = void 0;
// Queries pour fetch le data par rapport aux statistics d'un user pour la fonctionnalite du profil
const db = require('../database');
/*
Retourne un array contenant les statistiques
Pour prendre un statistiques particulier ex : winRate
getUserStatistics(1)[winRate]
*/
async function getUserStatistics(idplayer) {
    const result = await db.query(`SELECT gamesplayed, winrate, averagetimepergame::text,
         totaltimeplayed::text, bestscoresprintsolo, likes, dislikes
         FROM log3900db.Person WHERE idplayer = $1`, [idplayer]);
    return result.rows[0];
}
exports.getUserStatistics = getUserStatistics;
;
