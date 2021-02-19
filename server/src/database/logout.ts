const db = require('./database');

// Sets connection status to false
export function disconnect(idplayer : number) : void {
    db.query(`UPDATE log3900db.Person SET isconnected=false WHERE idplayer = $1`,
    [idplayer],
    (err: any, results: any) => {
        if (err) throw err;
    }); 
};