import express from 'express';
import { leaveChannel, createChannel, doesChannelExist, joinChannel} from '../database/channel';
import { getAppChannels } from '../database/login';

export const router = express.Router({
    strict: true
});

router.post('/leave', async (req, res) => {
    let channelExists: boolean = await doesChannelExist(req.body.channel)
    if (channelExists) {
        let isChannelDeleted = await leaveChannel(req.body.channel, req.body.idplayer);
        res.status(200).json({ isChannelDeleted: isChannelDeleted, message : "L'utilisateur a ete retire du channel"});
        return;
    } else {
        res.status(401).json({ message : "Le channel existe deja"});
        return;
    }
});

router.post('/create', async (req, res) => {

    let channelExists: boolean = await doesChannelExist(req.body.channel)

    if(channelExists){
        res.status(401).json({ message : "Le channel existe deja"});
        return;
    } else {
        try {
            await createChannel(req.body.channel, req.body.idplayer);
        } catch (err) {
            res.status(500).json({message: "Erreur lors de la création du channel"});
        }
        res.status(200).json({ message : "Le channel a ete créé avec l'utilisateur"});
        return;
    }
});
    
router.post('/join', async (req, res) => {
    let channelExists: boolean = await doesChannelExist(req.body.channel)
    if (channelExists) {
        try {
            await joinChannel(req.body.channel, req.body.idplayer);
            res.status(200).json({ message : "L'utilisateur join le channel"});
        } catch(err) {
            res.status(500).json({ message : "Erreur lors de la connexion au channel"});
        }
    } else {
        res.status(401).json({ message : "Le channel n'existe pas"});
    }
    
});

router.post('/getAllChannels', async (req, res) => {
    const allChannelsRes = await getAppChannels();
    let appChannels: string[] = new Array<string>();
    for (let channel of allChannelsRes) {
        appChannels.push(channel.channelname)
    }
    res.send({appChannels: appChannels});
});