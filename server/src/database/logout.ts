const db = require('./database');

// Sets connection status to false
export async function disconnect(idplayer : number) : Promise<void> {
    await db.query(`UPDATE log3900db.Person SET isconnected=false WHERE idplayer = $1`,
    [idplayer],
    (err: any, results: any) => {
        if (err) throw err;
    }); 
};

// Ajout d'une deconnexion dans la table des login
export async function addNewLogout(idplayer : number) : Promise<void> {
    await db.query(`SET TIMEZONE = 'America/Montreal';`,
    [],
    (err: any, results: any) => {
        db.query(`INSERT INTO log3900db.login(idplayer, islogin) VALUES($1, false)`,
        [idplayer],
        (err: any, results : any) => {
            if (err) throw err;
        });
    });
};