// Queries pour fetch le game History d'un utilisateur pour la fonctionnalite de profil
const db = require('../database');

export async function getUserGameHistory(idplayer : number) {
    // Get the game id of all the games the user played
    const games = await db.query(`
        SELECT log3900db.game.idgame, log3900db.playergame.iswinner, log3900db.playergame.result, log3900db.game.gamedate, log3900db.game.gamemodeid, log3900db.game.difficultylevel
        FROM log3900db.playergame
        INNER JOIN log3900db.player
            ON log3900db.playergame.idplayer = log3900db.player.idplayer
        INNER JOIN log3900db.game
            ON log3900db.playergame.idgame = log3900db.game.idgame
        WHERE log3900db.playergame.idplayer = $1
        `,
    [idplayer]);
    return games.rows;
}

// Donne les usernames pour un un gameid specifier
export async function getGamePlayers(idgame : number) {
    const players = await db.query(`
        SELECT log3900db.player.username
        FROM log3900db.playergame
        INNER JOIN log3900db.player
            ON log3900db.player.idplayer = log3900db.playergame.idplayer
        WHERE log3900db.playergame.idgame = $1
    `,
    [idgame]);
    return players.rows;
}
