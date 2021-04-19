"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLoginHistory = void 0;
// Queries pour fetch l'historique de connexion
const db = require('../database');
async function getUserLoginHistory(idplayer) {
    const result = await db.query(`
        SELECT * FROM log3900db.login
        WHERE idplayer = $1
        ORDER BY logindate DESC
        `, [idplayer]);
    return result.rows;
}
exports.getUserLoginHistory = getUserLoginHistory;
