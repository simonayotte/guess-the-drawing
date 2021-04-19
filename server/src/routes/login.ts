import express, { Request, Response } from 'express';
import {addNewLogin, connect, isConnected, getAvatar, getUserChannels, getAppChannels, getUsername, getIdSocket } from '../database/login';
import passport from 'passport';
import { leaveChannelLobbyWithIdPlayer } from '../database/channel';

export const router = express.Router({
    strict: true
});

/* Request form for login in JSON
{
    username: "simon",
    password: "simonpassword"
}
*/

router.post('/', (req, res, next) => {
    passport.authenticate('local-login', async (err, idplayer,info) => {
        if (err) { return next(err); }
        if (!idplayer) {
            res.status(401).json(info); // Status Unauthorized
            return;
        }
        const connectionStatus = await isConnected(idplayer);
        if (connectionStatus) {
            res.status(401).json({message : "L'utilisateur est déjà connecté ailleurs."});
            return;
        }
        try {
            connect(idplayer); 
            addNewLogin(idplayer);
        } catch(err) {
            console.error(err);
            return next(err);
        }
        const avatar = await getAvatar(idplayer);
        const userChannelsRes = await getUserChannels(idplayer);
        let userChannels: string[] = new Array<string>();
        
        for (let channel of userChannelsRes) {
            if(channel.channelname.slice(0, 6) !== "Lobby "){
                userChannels.push(channel.channelname)
            } else {
                await leaveChannelLobbyWithIdPlayer(channel.channelname, idplayer);
            }
        }
        const appChannelsRes = await getAppChannels();

        
        let appChannels: string[] = new Array<string>();
        for (let channel of appChannelsRes) {
            appChannels.push(channel.channelname)
        }
        res.status(200).json({ idplayer : idplayer, avatar: avatar, userChannels: userChannels, appChannels: appChannels,  message : info.message }); // changer aussi dans signup
        return;
    })(req, res, next);
});

router.post('/createWindow', async (req, res, next) => { 
    const avatar = await getAvatar(req.body.idplayer);
    const username = await getUsername(req.body.idplayer);
    const userChannelsRes = await getUserChannels(req.body.idplayer);
    let userChannels: string[] = new Array<string>();
    for (let channel of userChannelsRes) {
        userChannels.push(channel.channelname)
    }
    const appChannelsRes = await getAppChannels();
    const idSocket = await getIdSocket(req.body.idplayer);
    let appChannels: string[] = new Array<string>();
    for (let channel of appChannelsRes) {
        appChannels.push(channel.channelname)
    }
    console.log(userChannels);
    console.log(appChannels);
    
    res.status(200).json({ idplayer : req.body.idplayer, avatar: avatar, userChannels: userChannels, appChannels: appChannels, username: username, idSocket: idSocket}); // changer aussi dans signup
    return;
});

router.get('/', (req, res) => {
    res.send({message : 'Login failed'});
});