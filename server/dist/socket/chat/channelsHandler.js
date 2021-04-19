"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (io, socket) => {
    socket.on('joinChannelRoom', (data) => {
        let room = "channel-" + data.channel;
        socket.join(room);
        console.log("joined ", room);
    });
    socket.on('newChannelCreation', (data) => {
        let room = "channel-" + data.channel;
        socket.join(room);
        console.log("joined ", room);
        io.emit('newChannelCreation', { channel: data.channel });
    });
    // New window management
    socket.on('closeWindow', (data) => {
        io.to(data.idSocket).emit('closeWindow', "child window is closed");
    });
    socket.on('leaveChannelRoom', (data) => {
        let room = "channel-" + data.channel;
        socket.leave(room);
        console.log("left ", room);
        if (data.isChannelDeleted) {
            io.emit('channelDeleted', { channel: data.channel });
        }
    });
};
