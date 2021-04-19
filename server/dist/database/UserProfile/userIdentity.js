"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdentity = void 0;
const db = require('../database');
async function getUserIdentity(idplayer) {
    const result = await db.query(`SELECT firstname, lastname, avatar, email FROM log3900db.Person WHERE Person.idplayer = $1`, [idplayer]);
    return result.rows[0];
}
exports.getUserIdentity = getUserIdentity;
;
