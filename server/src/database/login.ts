const db = require('./database');

export function addNewLogin(idplayer : number) : void {
    db.query(`INSERT INTO log3900db.login(idplayer) VALUES($1)`,
    [idplayer],
    (err: any, results: any) => {
        if (err) throw err;
    });
};

// Sets connection status to true
export function setIsConnected(idplayer : number) : void {
    db.query(`UPDATE log3900db.Person SET isconnected = true WHERE idplayer = $1`,
    [idplayer],
    (err: any, results: any) => {
        if (err) throw err;
    });
};