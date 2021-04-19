"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewLogout = exports.disconnect = void 0;
const db = require('./database');
// Sets connection status to false
function disconnect(idplayer) {
    db.query(`UPDATE log3900db.Person SET isconnected=false WHERE idplayer = $1`, [idplayer], (err, results) => {
        if (err)
            throw err;
    });
}
exports.disconnect = disconnect;
;
// Ajout d'une deconnexion dans la table des login
function addNewLogout(idplayer) {
    db.query(`INSERT INTO log3900db.login(idplayer, islogin) VALUES($1, false)`, [idplayer], (err, results) => {
        if (err)
            throw err;
    });
}
exports.addNewLogout = addNewLogout;
;
