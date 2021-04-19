const db = require('./database');

export async function thumbsUp(idPlayer: number) {
    const result = await db.query(`
    SELECT likes
    FROM log3900db.Person
    WHERE Person.idplayer = $1`,
                [idPlayer]);
    
    db.query(`
    UPDATE log3900db.Person
    SET likes = $1
    WHERE idplayer = $2`,
                [result.rows[0].likes + 1, idPlayer]); 
    
};

export async function thumbsDown(idPlayer: number) {
    const result = await db.query(`
    SELECT dislikes
    FROM log3900db.Person
    WHERE Person.idplayer = $1`,
                [idPlayer]); 
    
    db.query(`
    UPDATE log3900db.Person
    SET dislikes = $1
    WHERE idplayer = $2`,
                [result.rows[0].dislikes + 1, idPlayer]); 
    
};