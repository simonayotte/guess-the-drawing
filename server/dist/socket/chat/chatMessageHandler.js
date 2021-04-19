"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../../database/messages");
const censoredWords = __importStar(require("./censoredWords.json"));
module.exports = (io, socket) => {
    const db = require('../../database/database');
    socket.on('chatMessage', async (msg) => {
        msg.time = getCurrentTime();
        let room = "channel-" + msg.room;
        msg.message = censorMessage(msg.message);
        const isMessageAdded = await messages_1.addMessage(msg.room, msg.idPlayer, msg.message, msg.time);
        if (isMessageAdded) {
            io.to(room).emit('chatMessage', msg);
            io.to(room).emit('chatNotification', { channelName: msg.room });
        }
    });
    function getCurrentTime() {
        const d = new Date();
        const h = `${d.getHours()}`.padStart(2, '0');
        const m = `${d.getMinutes()}`.padStart(2, '0');
        const s = `${d.getSeconds()}`.padStart(2, '0');
        return h + ":" + m + ":" + s;
    }
    // verifie seulement les mots individuels pas les expression
    // ajoutez mots dans censoredWords.json
    function censorMessage(message) {
        const wordList = censoredWords.words;
        let messageList = message.split(' ');
        let censoredIndexes = [];
        messageList.forEach((word, index) => {
            if (wordList.includes(word)) {
                censoredIndexes.push(index);
            }
        });
        censoredIndexes.forEach((index) => {
            const wordSize = messageList[index].length;
            const firstLetter = messageList[index][0];
            const lastLetter = messageList[index][wordSize - 1];
            const asterisk = '*';
            messageList[index] = firstLetter + asterisk.repeat(wordSize - 2) + lastLetter;
        });
        message = messageList.join(' ');
        return message;
    }
};
