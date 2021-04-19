"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("../database/channel");
const index_1 = require("../index");
const index_2 = require("../index");
module.exports = (io, socket) => {
    // Saved socket id and id in the db
    const db = require('../database/database');
    socket.on('connectSocketid', (id) => {
        db.query(`
        UPDATE LOG3900DB.Person
        SET idSocket=$1
        WHERE Person.idPlayer = $2`, [socket.id, id])
            .catch((err) => {
            console.error(err);
        });
    });
    socket.on('disconnect', async () => {
        console.log('client has disconnected');
        let idplayer = await getIdPlayer();
        if (idplayer != -1) {
            let username = await getUsername(idplayer);
            db.query(`UPDATE log3900db.Person SET isconnected = false WHERE idSocket = $1`, [socket.id], (err, results) => {
                if (err)
                    console.error(`error when trying to update isconnected of idSocket ${socket.id}`);
            });
            let lobbyName = "Lobby " + index_1.lobbyList.getActiveLobby(username);
            console.log(lobbyName);
            if (lobbyName !== "Lobby -1") {
                socket.emit('leaveChannelLobby', { channelName: lobbyName });
                await channel_1.leaveChannelLobby(lobbyName, username);
                console.log(lobbyName);
            }
            index_1.lobbyList.removePlayer(username);
            index_2.gameService.playerHasLeft(idplayer);
        }
        io.emit('lobbyListRequested', index_1.lobbyList.getLobbies());
    });
    async function getIdPlayer() {
        let promise = new Promise((resolve, reject) => {
            db.query(`SELECT * from log3900db.Person WHERE idSocket = $1`, [socket.id], (err, result) => {
                if (err)
                    throw err;
                if (result.rows.length > 0) {
                    resolve(result.rows[0].idplayer);
                }
                else {
                    resolve(-1);
                }
            });
        });
        return promise;
    }
    async function getUsername(idplayer) {
        const result = await db.query(`SELECT * FROM log3900db.Player WHERE Player.idplayer = $1`, [idplayer]);
        return result.rows[0].username;
    }
    ;
};
