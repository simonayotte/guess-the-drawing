import { Server, Socket } from 'socket.io';
module.exports = (io : Server, socket : Socket) => {


    socket.on('joinChannelRoom', (data: any) => {
        let room = "channel-" + data.channel;
        socket.join(room);
        console.log("joined ", room);
    }); 

    socket.on('newChannelCreation', (data: any) => {
        let room = "channel-" + data.channel;
        socket.join(room);
        console.log("joined ", room);
        io.emit('newChannelCreation', {channel: data.channel})
    }); 

    // New window management
    socket.on('closeWindow', (data: any) => {
        io.to(data.idSocket).emit('closeWindow', "child window is closed")
    });

    socket.on('reloadParentChannels', (data: any) => {
        io.to(data.idSocket).emit('reloadParentChannels', "reload Parent channel")
    });

    socket.on('leaveChannelRoom', (data: any) => {
        let room = "channel-" + data.channel;
        socket.leave(room);
        console.log("left ", room);
        if (data.isChannelDeleted){
            io.emit('channelDeleted', {channel: data.channel})
        }
    });
}