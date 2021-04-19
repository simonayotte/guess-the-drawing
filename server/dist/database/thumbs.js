"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thumbsDown = exports.thumbsUp = void 0;
const db = require('./database');
async function thumbsUp(idPlayer) {
    const result = await db.query(`
    SELECT likes
    FROM log3900db.Person
    WHERE Person.idplayer = $1`, [idPlayer]);
    db.query(`
    UPDATE log3900db.Person
    SET likes = $1
    WHERE idplayer = $2`, [result.rows[0].likes + 1, idPlayer]);
}
exports.thumbsUp = thumbsUp;
;
async function thumbsDown(idPlayer) {
    const result = await db.query(`
    SELECT dislikes
    FROM log3900db.Person
    WHERE Person.idplayer = $1`, [idPlayer]);
    db.query(`
    UPDATE log3900db.Person
    SET dislikes = $1
    WHERE idplayer = $2`, [result.rows[0].dislikes + 1, idPlayer]);
}
exports.thumbsDown = thumbsDown;
;
