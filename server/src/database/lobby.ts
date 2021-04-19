// Queries pour les lobbies
const db = require('./database');

export async function getLobbies() {
    const result = await db.query(`
        SELECT * 
        FROM log3900db.lobby 
        `); 
    return result.rows;
};

export async function createLobby() {

} 

export async function joinLobby(idplayer: number) {

}

export async function startGame(idlobby: number) {

}