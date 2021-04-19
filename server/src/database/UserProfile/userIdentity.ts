const db = require('../database');

export async function getUserIdentity(idplayer : number) {
    const result = await db.query(`SELECT firstname, lastname, avatar, email FROM log3900db.Person WHERE Person.idplayer = $1`,
                [idplayer]); 
    return result.rows[0];
};

