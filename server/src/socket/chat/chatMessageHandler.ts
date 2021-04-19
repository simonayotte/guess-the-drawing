import { Server, Socket } from 'socket.io';
import { addMessage } from '../../database/messages';
import * as censoredWords from './censoredWords.json';

module.exports = (io : Server, socket : Socket) => {
    const db = require('../../database/database');
    socket.on('chatMessage', async (msg: any) => {
        msg.time = getCurrentTime();
        let room = "channel-" + msg.room 
        msg.message = censorMessage(msg.message);
        
        const isMessageAdded = await addMessage(msg.room, msg.idPlayer, msg.message, msg.time)
        if(isMessageAdded){
            io.to(room).emit('chatMessage', msg );
            io.to(room).emit('chatNotification', { channelName: msg.room});
        }
        
    }); 
    

    function getCurrentTime(){
        const d = new Date();
        const h = `${d.getHours()}`.padStart(2, '0');
        const m = `${d.getMinutes()}`.padStart(2, '0');
        const s = `${d.getSeconds()}`.padStart(2, '0');
        return h + ":" + m + ":" + s;
    }

    // verifie seulement les mots individuels pas les expression
    // ajoutez mots dans censoredWords.json
    function censorMessage(message: String): String{
        const wordList = censoredWords.words;
        let messageList = message.split(' ');
        let censoredIndexes: number[] = []
        messageList.forEach((word, index) => {
            if(wordList.includes(word)){
                censoredIndexes.push(index);
            }
        });
        censoredIndexes.forEach((index) => {
            const wordSize = messageList[index].length
            const firstLetter = messageList[index][0];
            const lastLetter = messageList[index][wordSize - 1];
            const asterisk = '*'
            messageList[index] = firstLetter + asterisk.repeat(wordSize - 2) + lastLetter;
        });
        message = messageList.join(' ');
        return message;
    }
}