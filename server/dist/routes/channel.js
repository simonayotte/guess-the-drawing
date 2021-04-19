"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const channel_1 = require("../database/channel");
const login_1 = require("../database/login");
exports.router = express_1.default.Router({
    strict: true
});
exports.router.post('/leave', async (req, res) => {
    let channelExists = await channel_1.doesChannelExist(req.body.channel);
    if (channelExists) {
        let isChannelDeleted = await channel_1.leaveChannel(req.body.channel, req.body.idplayer);
        console.log(isChannelDeleted);
        res.status(200).json({ isChannelDeleted: isChannelDeleted, message: "L'utilisateur a ete retire du channel" });
        return;
    }
    else {
        res.status(401).json({ message: "Le channel existe deja" });
        return;
    }
});
exports.router.post('/create', async (req, res) => {
    let channelExists = await channel_1.doesChannelExist(req.body.channel);
    if (channelExists) {
        res.status(401).json({ message: "Le channel existe deja" });
        return;
    }
    else {
        try {
            await channel_1.createChannel(req.body.channel, req.body.idplayer);
        }
        catch (err) {
            res.status(500).json({ message: "Erreur lors de la création du channel" });
        }
        res.status(200).json({ message: "Le channel a ete créé avec l'utilisateur" });
        return;
    }
});
exports.router.post('/join', async (req, res) => {
    let channelExists = await channel_1.doesChannelExist(req.body.channel);
    if (channelExists) {
        try {
            await channel_1.joinChannel(req.body.channel, req.body.idplayer);
            res.status(200).json({ message: "L'utilisateur join le channel" });
        }
        catch (err) {
            res.status(500).json({ message: "Erreur lors de la connexion au channel" });
        }
    }
    else {
        res.status(401).json({ message: "Le channel n'existe pas" });
    }
});
exports.router.post('/getAllChannels', async (req, res) => {
    const allChannelsRes = await login_1.getAppChannels();
    let appChannels = new Array();
    for (let channel of allChannelsRes) {
        appChannels.push(channel.channelname);
    }
    res.send({ appChannels: appChannels });
});
