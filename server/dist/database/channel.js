"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doesChannelExist = exports.createChannelLobby = exports.createChannel = exports.joinChannelLobby = exports.joinChannel = exports.leaveChannelLobbyWithIdPlayer = exports.leaveChannelLobby = exports.clearHistory = exports.leaveChannel = void 0;
const db = require('./database');
async function leaveChannel(channelName, idPlayer) {
    let isDeleted = false;
    let promise = new Promise((resolve, reject) => {
        db.query(`
        DELETE FROM log3900db.ChannelConnexion WHERE ChannelConnexion.channelName = $1 AND ChannelConnexion.idplayer = $2;`, [channelName, idPlayer], (err) => {
            if (err)
                throw err;
            console.log(`Le joueur ${idPlayer} a quitter le channel ${channelName}.`);
            // check if channel is empty and delete it if empty
            db.query(`
                            SELECT COUNT (channelName) AS numUsers
                            FROM log3900db.channelConnexion
                            WHERE channelName = $1;`, [channelName], (err, result) => {
                if (err)
                    throw err;
                const isEmpty = (result.rows[0].numusers == 0) ? true : false;
                if (isEmpty) {
                    db.query(`
                                        DELETE FROM log3900db.message WHERE message.channelName = $1;`, [channelName], (err) => {
                        if (err)
                            throw err;
                        db.query(`
                                                        DELETE FROM log3900db.Channel WHERE Channel.channelName = $1;`, [channelName], (err) => {
                            if (err)
                                throw err;
                            console.log(`Le channel ${channelName} a été supprimer.`);
                            isDeleted = true;
                            resolve(true);
                        });
                    });
                }
                else {
                    resolve(false);
                }
            });
        });
    });
    promise.catch((error) => {
        console.error(error);
    });
    return promise;
}
exports.leaveChannel = leaveChannel;
;
async function clearHistory(channelName) {
    let promise = new Promise((resolve, reject) => {
        db.query(`
        DELETE FROM log3900db.message WHERE message.channelName = $1;`, [channelName], (err) => {
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
exports.clearHistory = clearHistory;
async function leaveChannelLobby(channelName, username) {
    let promise = new Promise((resolve, reject) => {
        db.query(`
        SELECT idPlayer
        FROM log3900db.Player
        WHERE username = $1`, [username], (err, result) => {
            if (err)
                throw err;
            let idPlayer = result.rows[0].idplayer;
            resolve(leaveChannelLobbyWithIdPlayer(channelName, parseInt(idPlayer)));
        });
    });
    promise.catch((error) => {
        console.error(error);
    });
    return promise;
}
exports.leaveChannelLobby = leaveChannelLobby;
;
async function leaveChannelLobbyWithIdPlayer(channelName, idPlayer) {
    let promise = new Promise((resolve, reject) => {
        db.query(`
        DELETE FROM log3900db.ChannelConnexion WHERE ChannelConnexion.channelName = $1 AND ChannelConnexion.idplayer = $2;`, [channelName, idPlayer], (err) => {
            if (err)
                throw err;
            console.log(`Le joueur ${idPlayer} a quitter le channel ${channelName}.`);
            // check if channel is empty and delete it if empty
            resolve(true);
        });
    });
    promise.catch((error) => {
        console.error(error);
    });
    return promise;
}
exports.leaveChannelLobbyWithIdPlayer = leaveChannelLobbyWithIdPlayer;
;
async function joinChannel(channelName, idPlayer) {
    await db.query(`
    INSERT INTO log3900db.ChannelConnexion(channelName, idPlayer) VALUES ($1, $2);`, [channelName, idPlayer], (err) => {
        if (err)
            throw err;
        console.log(`Le player ${idPlayer} a ete ajoute a ${channelName}.`);
    });
}
exports.joinChannel = joinChannel;
;
async function joinChannelLobby(channelName, username) {
    let promise = new Promise((resolve, reject) => {
        db.query(`
        SELECT idPlayer
        FROM log3900db.Player
        WHERE username = $1`, [username], (err, result) => {
            if (err)
                throw err;
            let idPlayer = result.rows[0].idplayer;
            db.query(`
                    SELECT *
                    FROM log3900db.ChannelConnexion
                    WHERE channelName = $1
                    AND idPlayer = $2`, [channelName, idPlayer], (err, result) => {
                if (err)
                    throw err;
                if (result.rows.length == 0) {
                    db.query(`
                                INSERT INTO log3900db.ChannelConnexion(channelName, idPlayer) VALUES ($1, $2);`, [channelName, idPlayer], (err) => {
                        if (err)
                            throw err;
                        console.log(`Le player ${idPlayer} a ete ajoute a ${channelName}.`);
                        resolve(true);
                    });
                }
                else {
                    resolve(false);
                }
            });
        });
    });
    promise.catch((error) => {
        console.error(error);
    });
    return promise;
}
exports.joinChannelLobby = joinChannelLobby;
;
async function createChannel(channelName, idPlayer) {
    await db.query(`
    INSERT INTO log3900db.Channel(channelName) VALUES ($1);`, [channelName], (err) => {
        if (err)
            throw err;
        console.log(`Le channel ${channelName} a ete cree.`);
        db.query(`
                    INSERT INTO log3900db.ChannelConnexion(channelName, idPlayer) VALUES ($1, $2);`, [channelName, idPlayer], (err) => {
            if (err)
                throw err;
            console.log(`L'utilisateur ${idPlayer} est ajoute.`);
        });
    });
}
exports.createChannel = createChannel;
;
async function createChannelLobby(channelName) {
    let channelExists = await doesChannelExist(channelName);
    let promise = new Promise((resolve, reject) => {
        if (channelExists) {
            console.log("Channel already exists");
            resolve(false);
        }
        else {
            db.query(`
            INSERT INTO log3900db.Channel(channelName, isDeletable) VALUES ($1, 'False');`, [channelName], (err) => {
                if (err)
                    throw err;
                console.log(`Le channel ${channelName} a ete cree.`);
                resolve(true);
            });
        }
    });
    promise.catch((error) => {
        console.error(error);
    });
    return promise;
}
exports.createChannelLobby = createChannelLobby;
;
async function doesChannelExist(channelName) {
    let promise = new Promise((resolve, reject) => {
        db.query(`
        SELECT *
        FROM log3900db.Channel
        WHERE channelName = $1;`, [channelName], (err, result) => {
            if (err)
                throw err;
            if (result.rows.length > 0) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
    promise.catch((error) => {
        console.error(error);
    });
    return promise;
}
exports.doesChannelExist = doesChannelExist;
;
