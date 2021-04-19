"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const login_1 = require("../database/login");
const passport_1 = __importDefault(require("passport"));
const channel_1 = require("../database/channel");
exports.router = express_1.default.Router({
    strict: true
});
/* Request form for login in JSON
{
    username: "simon",
    password: "simonpassword"
}
*/
exports.router.post('/', (req, res, next) => {
    passport_1.default.authenticate('local-login', async (err, idplayer, info) => {
        if (err) {
            return next(err);
        }
        if (!idplayer) {
            res.status(401).json(info); // Status Unauthorized
            return;
        }
        const connectionStatus = await login_1.isConnected(idplayer);
        if (connectionStatus) {
            res.status(401).json({ message: "L'utilisateur est déjà connecté ailleurs." });
            return;
        }
        try {
            login_1.connect(idplayer);
            login_1.addNewLogin(idplayer);
        }
        catch (err) {
            console.error(err);
            return next(err);
        }
        const avatar = await login_1.getAvatar(idplayer);
        const userChannelsRes = await login_1.getUserChannels(idplayer);
        let userChannels = new Array();
        for (let channel of userChannelsRes) {
            if (channel.channelname.slice(0, 6) !== "Lobby ") {
                userChannels.push(channel.channelname);
            }
            else {
                await channel_1.leaveChannelLobbyWithIdPlayer(channel.channelname, idplayer);
            }
        }
        const appChannelsRes = await login_1.getAppChannels();
        let appChannels = new Array();
        for (let channel of appChannelsRes) {
            appChannels.push(channel.channelname);
        }
        res.status(200).json({ idplayer: idplayer, avatar: avatar, userChannels: userChannels, appChannels: appChannels, message: info.message }); // changer aussi dans signup
        return;
    })(req, res, next);
});
exports.router.post('/createWindow', async (req, res, next) => {
    const avatar = await login_1.getAvatar(req.body.idplayer);
    const username = await login_1.getUsername(req.body.idplayer);
    const userChannelsRes = await login_1.getUserChannels(req.body.idplayer);
    let userChannels = new Array();
    for (let channel of userChannelsRes) {
        userChannels.push(channel.channelname);
    }
    const appChannelsRes = await login_1.getAppChannels();
    const idSocket = await login_1.getIdSocket(req.body.idplayer);
    let appChannels = new Array();
    for (let channel of appChannelsRes) {
        appChannels.push(channel.channelname);
    }
    res.status(200).json({ idplayer: req.body.idplayer, avatar: avatar, userChannels: userChannels, appChannels: appChannels, username: username, idSocket: idSocket }); // changer aussi dans signup
    return;
});
exports.router.get('/', (req, res) => {
    res.send({ message: 'Login failed' });
});
