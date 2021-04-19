// Queries pour fetch l'historique de connexion
const db = require('../database');

export async function getUserLoginHistory(idplayer : number) {
    const result = await db.query(`
        SELECT * FROM log3900db.login
        WHERE idplayer = $1
        ORDER BY logindate DESC
        `,
        [idplayer]);
    return result.rows; 
}