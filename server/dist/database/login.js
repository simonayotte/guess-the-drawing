"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppChannels = exports.getUserChannels = exports.getIdSocket = exports.getId = exports.getUsername = exports.getAvatar = exports.isConnected = exports.connect = exports.addNewLogin = void 0;
const db = require('./database');
function addNewLogin(idplayer) {
    db.query(`INSERT INTO log3900db.login(idplayer) VALUES($1)`, [idplayer], (err, results) => {
        if (err)
            throw err;
    });
}
exports.addNewLogin = addNewLogin;
;
// Sets connection status to true
function connect(idplayer) {
    db.query(`UPDATE log3900db.Person SET isconnected = true WHERE idplayer = $1`, [idplayer], (err, results) => {
        if (err)
            throw err;
        console.log(`L'utilisateur ${idplayer} est connecte.`);
    });
}
exports.connect = connect;
;
async function isConnected(idplayer) {
    const result = await db.query(`SELECT * FROM log3900db.Person WHERE Person.idplayer = $1`, [idplayer]);
    return result.rows[0].isconnected;
}
exports.isConnected = isConnected;
;
async function getAvatar(idplayer) {
    const result = await db.query(`SELECT * FROM log3900db.Person WHERE Person.idplayer = $1`, [idplayer]);
    return result.rows[0].avatar;
}
exports.getAvatar = getAvatar;
;
async function getUsername(idplayer) {
    const result = await db.query(`SELECT * FROM log3900db.Player WHERE Player.idplayer = $1`, [idplayer]);
    return result.rows[0].username;
}
exports.getUsername = getUsername;
;
async function getId(username) {
    const result = await db.query(`SELECT * FROM log3900db.Player WHERE Player.username = $1`, [username]);
    return result.rows[0].idplayer;
}
exports.getId = getId;
;
async function getIdSocket(idplayer) {
    const result = await db.query(`SELECT * FROM log3900db.Person WHERE Person.idplayer = $1`, [idplayer]);
    return result.rows[0].idsocket;
}
exports.getIdSocket = getIdSocket;
;
async function getUserChannels(idplayer) {
    const result = await db.query(`
        SELECT channelname
        FROM log3900db.channelconnexion INNER JOIN log3900db.person ON person.idplayer = channelconnexion.idplayer
        WHERE channelconnexion.idplayer = $1`, [idplayer]);
    return result.rows;
}
exports.getUserChannels = getUserChannels;
;
async function getAppChannels() {
    const result = await db.query(`
        SELECT channelname
        FROM log3900db.channel
        WHERE isDeletable = 'true';`);
    return result.rows;
}
exports.getAppChannels = getAppChannels;
;
