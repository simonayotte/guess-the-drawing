import { Socket, Server } from 'socket.io';
import { leaveChannelLobby } from '../database/channel';
import { getUsername } from '../database/login';
import { addNewLogout, disconnect } from '../database/logout';
import { lobbyList } from '../index';
import { gameService } from '../index'
module.exports = (io : Server, socket : Socket) => {
    // Saved socket id and id in the db
    const db = require('../database/database');
    socket.on('connectSocketid', (id: any) => {
        db.query(`
        UPDATE LOG3900DB.Person
        SET idSocket=$1
        WHERE Person.idPlayer = $2`, [socket.id,id])
        .catch((err: any) => {
            console.error(err); 
        });
    }); 

    socket.on('disconnect', async () => {
        let idplayer: number = await getIdPlayer();
        if (idplayer != -1){
            try{
                await disconnect(idplayer);
                await addNewLogout(idplayer);
            } catch(err) {
                console.log(err)
            }
            
            let username = await getUsername(idplayer);
            let lobbyName = "Lobby " + lobbyList.getActiveLobby(username)
            if(lobbyName !== "Lobby -1"){
                socket.emit('leaveChannelLobby', {channelName: lobbyName})
                await leaveChannelLobby(lobbyName, username);
            }
            lobbyList.removePlayer(username)
            gameService.playerHasLeft(idplayer)
        }
        
        io.emit('lobbyListRequested', lobbyList.getLobbies());
    });

    async function getIdPlayer() {
        let promise: Promise<number> = new Promise((resolve, reject) => {
            db.query(`SELECT * from log3900db.Person WHERE idSocket = $1`,
            [socket.id], (err: any, result: any) => {
                if (err) throw err;
                if(result.rows.length > 0){
                    resolve(result.rows[0].idplayer)
                } else {
                    resolve(-1)
                }
            });
        });
        return promise;
    }

    async function getUsername(idplayer : number) {
        const result = await db.query(`SELECT * FROM log3900db.Player WHERE Player.idplayer = $1`,
                    [idplayer]); 
        return result.rows[0].username;
    };


}