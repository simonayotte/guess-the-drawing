// Queries pour fetch l'historique de connexion
const db = require('../database');

export async function getUserLoginHistory(idplayer : number) {
    let promise: Promise<any[]> = new Promise((resolve, reject) => {
        db.query(`SET TIMEZONE = 'America/Montreal';`,
        [], (err: any, results: any) => {
                db.query(`
                SELECT log3900db.login.isLogin, log3900db.login.loginDate AT TIME ZONE 'UTC' AS loginDate FROM log3900db.login
                WHERE idplayer = $1
                ORDER BY logindate DESC`,
                [idplayer],(err: any, result: any) => {
                    resolve(result.rows);
                });
        });
    });

    return promise;
    
}