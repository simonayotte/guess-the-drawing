const db = require('./database');

export function addNewLogin(idplayer : number) : void {
    db.query(`INSERT INTO log3900db.login(idplayer) VALUES($1)`,
    [idplayer],
    (err: any, results: any) => {
        if (err) throw err;
    });
};

// Sets connection status to true
export function connect(idplayer : number) : void {
    db.query(`UPDATE log3900db.Person SET isconnected = true WHERE idplayer = $1`,
    [idplayer],
    (err: any, results: any) => {
        if (err) throw err;
        console.log(`L'utilisateur ${idplayer} est connecte.`);
    });
};


export async function isConnected(idplayer : number) {
    const result = await db.query(`SELECT * FROM log3900db.Person WHERE Person.idplayer = $1`,
                [idplayer]); 
    return result.rows[0].isconnected;
};