const db = require('./database');

// Sets connection status to false
export function disconnect(idplayer : number) : void {
    db.query(`UPDATE log3900db.Person SET isconnected=false WHERE idplayer = $1`,
    [idplayer],
    (err: any, results: any) => {
        if (err) throw err;
    }); 
};

// Ajout d'une deconnexion dans la table des login
export function addNewLogout(idplayer : number) : void {
    db.query(`INSERT INTO log3900db.login(idplayer, islogin) VALUES($1, false)`,
    [idplayer],
    (err: any, results : any) => {
        if (err) throw err;
    });
};