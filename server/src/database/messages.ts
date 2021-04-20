const db = require('./database');





export async function getHistory(channelName : string) {
    const result = await db.query(`
    SELECT username, avatar, messageDate AS time, messageContent AS message, channelName AS room
    FROM log3900db.Message 
    INNER JOIN log3900db.Player ON Player.idplayer = Message.idplayer
    INNER JOIN log3900db.Person ON Player.idplayer = Person.idplayer
    WHERE Message.channelName = $1
    ORDER BY idmessage`,
                [channelName]); 
    return result.rows;
};

export async function deleteHistory(channelName : string) {
    let promise: Promise<boolean> = new Promise((resolve, reject) => {
        db.query(`
        DELETE FROM log3900db.message WHERE message.channelName = $1;`,
                    [channelName],(err: any) => {
                        if (err) throw err;
                        resolve(true)
                    });
    });
    promise.catch((error) => {
        console.error(error);
    });
    return promise;
};


export async function addMessage(channelName: string,idPlayer: string, messageContent: string, messageDate: string): Promise<boolean> {
    
    let promise: Promise<boolean> = new Promise((resolve, reject) => {
        db.query(
            ` INSERT INTO LOG3900DB.Message(channelName,idPlayer, messageContent, messageDate) VALUES ($1,$2,$3,$4);`
            , [channelName,idPlayer, messageContent, messageDate],(err: any, result: any) => {
                if (err) throw err;
                resolve(true)
        });
    });

    promise.catch((error) => {
        console.error(error);
      });

    return promise;
};

