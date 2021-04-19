"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessage = exports.deleteHistory = exports.getHistory = void 0;
const db = require('./database');
async function getHistory(channelName) {
    const result = await db.query(`
    SELECT username, avatar, messageDate AS time, messageContent AS message, channelName AS room
    FROM log3900db.Message 
    INNER JOIN log3900db.Player ON Player.idplayer = Message.idplayer
    INNER JOIN log3900db.Person ON Player.idplayer = Person.idplayer
    WHERE Message.channelName = $1
    ORDER BY idmessage`, [channelName]);
    return result.rows;
}
exports.getHistory = getHistory;
;
async function deleteHistory(channelName) {
    let promise = new Promise((resolve, reject) => {
        db.query(`
        DELETE FROM log3900db.message WHERE message.channelName = $1;`, [channelName], (err) => {
            if (err)
                throw err;
            console.log("history deleted for " + channelName);
            resolve(true);
        });
    });
    promise.catch((error) => {
        console.error(error);
    });
    return promise;
}
exports.deleteHistory = deleteHistory;
;
async function addMessage(channelName, idPlayer, messageContent, messageDate) {
    let promise = new Promise((resolve, reject) => {
        db.query(` INSERT INTO LOG3900DB.Message(channelName,idPlayer, messageContent, messageDate) VALUES ($1,$2,$3,$4);`, [channelName, idPlayer, messageContent, messageDate], (err, result) => {
            if (err)
                throw err;
            resolve(true);
        });
    });
    promise.catch((error) => {
        console.error(error);
    });
    return promise;
}
exports.addMessage = addMessage;
;
