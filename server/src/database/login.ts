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

export async function getAvatar(idplayer : number) {
    const result = await db.query(`SELECT * FROM log3900db.Person WHERE Person.idplayer = $1`,
                [idplayer]); 
    return result.rows[0].avatar;
};

export async function getUsername(idplayer : number) {
    const result = await db.query(`SELECT * FROM log3900db.Player WHERE Player.idplayer = $1`,
                [idplayer]); 
    return result.rows[0].username;
};
export async function getId(username : string) {
    const result = await db.query(`SELECT * FROM log3900db.Player WHERE Player.username = $1`,
                [username]); 
    return result.rows[0].idplayer;
};
export async function getIdSocket(idplayer : number) {
    const result = await db.query(`SELECT * FROM log3900db.Person WHERE Person.idplayer = $1`,
                [idplayer]); 
    return result.rows[0].idsocket;
};

export async function getUserChannels(idplayer : number) {
    const result = await db.query(`
        SELECT channelname
        FROM log3900db.channelconnexion INNER JOIN log3900db.person ON person.idplayer = channelconnexion.idplayer
        WHERE channelconnexion.idplayer = $1`,
                [idplayer]); 
    return result.rows;
};

export async function getAppChannels() {
    const result = await db.query(`
        SELECT channelname
        FROM log3900db.channel
        WHERE isDeletable = 'true';`); 
    return result.rows;
};