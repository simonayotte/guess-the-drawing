"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPointsFromPlayer = void 0;
const db = require('./database');
// TODO mettre a jour quand les stats vont exister
async function getPointsFromPlayer(idplayer) {
    let promise = new Promise((resolve, reject) => {
        db.query(`SELECT totalpoints FROM log3900db.Person WHERE Person.idplayer = $1`, [idplayer], (err, result) => {
            if (err)
                throw err;
            resolve(result.rows[0].totalpoints);
        });
    });
    promise.catch((error) => {
        console.error(error);
    });
    return promise;
}
exports.getPointsFromPlayer = getPointsFromPlayer;
;
