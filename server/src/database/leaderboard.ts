const db = require('./database');

// {name: username, points: totalPoints, victories: sumOf (vicModes), classicModeVictories: classicModeVictories, playedGames: gamePlayed}
export async function getStats(): Promise<any[]> {
    let promise: Promise<any[]> = new Promise((resolve, reject) => {
        db.query(`SELECT username, totalPoints, (classicVictories + brVictories) AS victories, classicVictories, brVictories, bestScoreSprintSolo, bestScoreCoop, gamesPlayed, likes, dislikes
                FROM log3900db.person
                INNER JOIN log3900db.player ON person.idplayer = player.idplayer
                ORDER BY victories DESC, totalPoints DESC, gamesPlayed ASC;`,
                    [],(err: any, result: any) => {
                        if (err) throw err;
                        resolve(result.rows)
        });
    });

    promise.catch((error) => {
        console.error(error);
      });

    return promise;
    
    
};