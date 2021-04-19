const db = require('./database');


export async function leaveChannel(channelName : string, idPlayer: string): Promise<boolean> {
    let isDeleted = false;

    let promise: Promise<boolean> = new Promise((resolve, reject) => {
        db.query(`
        DELETE FROM log3900db.ChannelConnexion WHERE ChannelConnexion.channelName = $1 AND ChannelConnexion.idplayer = $2;`,
                    [channelName, idPlayer],(err: any) => {
                        if (err) throw err;
                        console.log(`Le joueur ${idPlayer} a quitter le channel ${channelName}.`);
                        // check if channel is empty and delete it if empty
                        db.query(`
                            SELECT COUNT (channelName) AS numUsers
                            FROM log3900db.channelConnexion
                            WHERE channelName = $1;`,
                                [channelName],(err: any, result: any) => {
                                    if (err) throw err;
                                    const isEmpty = (result.rows[0].numusers == 0) ? true : false;
                                    if (isEmpty){
                                        db.query(`
                                        DELETE FROM log3900db.message WHERE message.channelName = $1;`,
                                            [channelName],(err: any) => {
                                                if (err) throw err;
                                                db.query(`
                                                        DELETE FROM log3900db.Channel WHERE Channel.channelName = $1;`,
                                                    [channelName],(err: any) => {
                                                        if (err) throw err;
                                                        console.log(`Le channel ${channelName} a été supprimer.`);
                                                        isDeleted = true;
                                                        resolve(true);
                                                });
                                        });
                                        
                                    } else {
                                        resolve(false)
                                    }   
                        });
                        
                        
        });
    });

    promise.catch((error) => {
        console.error(error);
      });

    return promise;
    
    
};

export async function clearHistory(channelName : string): Promise<boolean> {
    let promise: Promise<boolean> = new Promise((resolve, reject) => {
        db.query(`
        DELETE FROM log3900db.message WHERE message.channelName = $1;`,
            [channelName],(err: any) => {
                if (err) throw err;
                resolve(true);
        });
    });

    promise.catch((error) => {
        console.error(error);
      });

    return promise;
}

export async function leaveChannelLobby(channelName : string, username: string): Promise<boolean> {
    
    let promise: Promise<boolean> = new Promise((resolve, reject) => {
        db.query(`
        SELECT idPlayer
        FROM log3900db.Player
        WHERE username = $1`,
                    [username],(err: any, result: any) => {
                        if (err) throw err;
                        let idPlayer = result.rows[0].idplayer;
                        resolve(leaveChannelLobbyWithIdPlayer(channelName, parseInt(idPlayer)));         
        });          
    });

    promise.catch((error) => {
        console.error(error);
    });

    return promise;
    
    
};


export async function leaveChannelLobbyWithIdPlayer(channelName : string, idPlayer: number): Promise<boolean> {

    let promise: Promise<boolean> = new Promise((resolve, reject) => {
        db.query(`
        DELETE FROM log3900db.ChannelConnexion WHERE ChannelConnexion.channelName = $1 AND ChannelConnexion.idplayer = $2;`,
                    [channelName, idPlayer],(err: any) => {
                        if (err) throw err;
                        console.log(`Le joueur ${idPlayer} a quitter le channel ${channelName}.`);
                        // check if channel is empty and delete it if empty
                        resolve(true);         
        });          
    });

    promise.catch((error) => {
        console.error(error);
    });

    return promise;

};


export async function joinChannel(channelName : string, idPlayer: string) {
    await db.query(`
    INSERT INTO log3900db.ChannelConnexion(channelName, idPlayer) VALUES ($1, $2);`,
                [channelName, idPlayer],(err: any) => {
                    if (err) throw err;
                    console.log(`Le player ${idPlayer} a ete ajoute a ${channelName}.`);
                });
};

export async function joinChannelLobby(channelName : string, username: string): Promise<boolean>{
    let promise: Promise<boolean> = new Promise((resolve, reject) => {
        db.query(`
        SELECT idPlayer
        FROM log3900db.Player
        WHERE username = $1`,
                    [username],(err: any, result: any) => {
                        if (err) throw err;
                        let idPlayer = result.rows[0].idplayer;
                        db.query(`
                    SELECT *
                    FROM log3900db.ChannelConnexion
                    WHERE channelName = $1
                    AND idPlayer = $2`,
                        [channelName, idPlayer],(err: any, result: any) => {
                            if (err) throw err;
                            if(result.rows.length == 0){
                                db.query(`
                                INSERT INTO log3900db.ChannelConnexion(channelName, idPlayer) VALUES ($1, $2);`,
                                    [channelName, idPlayer],(err: any) => {
                                        if (err) throw err;
                                        console.log(`Le player ${idPlayer} a ete ajoute a ${channelName}.`);
                                        resolve(true)
                                    });
                            } else {
                                resolve(false);
                            }
                            
                        });

                        
        });          
    });

    promise.catch((error) => {
        console.error(error);
    });

    return promise;
};



export async function createChannel(channelName : string, idPlayer: string) {
    await db.query(`
    INSERT INTO log3900db.Channel(channelName) VALUES ($1);`,
                [channelName],
                (err: any) => {
                    if (err) throw err;
                    console.log(`Le channel ${channelName} a ete cree.`);
                    db.query(`
                    INSERT INTO log3900db.ChannelConnexion(channelName, idPlayer) VALUES ($1, $2);`,
                                [channelName, idPlayer],
                                (err: any) => {
                                    if (err) throw err;
                                    console.log(`L'utilisateur ${idPlayer} est ajoute.`);
                                });
                });
};

export async function createChannelLobby(channelName : string): Promise<boolean> {
    let channelExists = await doesChannelExist(channelName);
    let promise: Promise<boolean> = new Promise((resolve, reject) => {
        if (channelExists){
            console.log("Channel already exists");
            resolve(false);
        } else {
            db.query(`
            INSERT INTO log3900db.Channel(channelName, isDeletable) VALUES ($1, 'False');`,
                        [channelName],
                        (err: any) => {
                            if (err) throw err;
                            console.log(`Le channel ${channelName} a ete cree.`);
                            resolve(true);
                        });
        }
        
    });

    promise.catch((error) => {
        console.error(error);
    });
            
    return promise
};

export async function doesChannelExist(channelName : string): Promise<boolean> {
    let promise: Promise<boolean> = new Promise((resolve, reject) => {
       
        db.query(`
        SELECT *
        FROM log3900db.Channel
        WHERE channelName = $1;`,
                    [channelName],(err: any, result: any) => {
                        if (err) throw err;
                        if(result.rows.length > 0){
                            resolve(true);
                        } else {
                            resolve(false)
                        }
                    });
        
        
    });

    promise.catch((error) => {
        console.error(error);
    });
    
    return promise;
};