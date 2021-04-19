import express from 'express';
import {addNewLogin, connect, getAvatar, getUserChannels, getAppChannels, getIdSocket } from '../database/login';
import passport from 'passport';


export const router = express.Router({
    strict: true
});

/* Request form for signup in JSON
{
    username: "simon",
    email: "simon@mail.com",
    password: "simonpassword"
}
*/

router.post('/', (req, res, next) => {
    passport.authenticate('local-signup', async (err, idplayer , info) => {
        if (err) { return next(err); }
        if (!idplayer) {
            res.status(401).json(info); // Status Unauthorized
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
            userChannels.push(channel.channelname)
        }
        const appChannelsRes = await getAppChannels();
        let appChannels: string[] = new Array<string>();
        for (let channel of appChannelsRes) {
            appChannels.push(channel.channelname)
        }
        res.status(200).json({idplayer: idplayer, avatar: avatar, userChannels: userChannels, appChannels: appChannels,  message : info.message}); //changer aussi dans signin
        return;
    })(req, res, next);
});

router.get('/', (req, res) => {
    res.send({message : 'Sign up failed'});
})
