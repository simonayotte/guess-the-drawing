"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGame = exports.joinLobby = exports.createLobby = exports.getLobbies = void 0;
// Queries pour les lobbies
const db = require('./database');
async function getLobbies() {
    const result = await db.query(`
        SELECT * 
        FROM log3900db.lobby 
        `);
    return result.rows;
}
exports.getLobbies = getLobbies;
;
async function createLobby() {
}
exports.createLobby = createLobby;
async function joinLobby(idplayer) {
}
exports.joinLobby = joinLobby;
async function startGame(idlobby) {
}
exports.startGame = startGame;
