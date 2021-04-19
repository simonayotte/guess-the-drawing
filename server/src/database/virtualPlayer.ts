const db = require('./database');

// TODO mettre a jour quand les stats vont exister
export async function getPointsFromPlayer(idplayer : number): Promise<string> {
    let promise: Promise<string> = new Promise((resolve, reject) => {
        db.query(`SELECT totalpoints FROM log3900db.Person WHERE Person.idplayer = $1`,
        [idplayer],(err: any, result: any) => {
            if (err) throw err;
            resolve(result.rows[0].totalpoints)
        });
    }); 
    promise.catch((error) => {
        console.error(error);
    });
    return promise;
};