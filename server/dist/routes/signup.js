"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const login_1 = require("../database/login");
const passport_1 = __importDefault(require("passport"));
exports.router = express_1.default.Router({
    strict: true
});
/* Request form for signup in JSON
{
    username: "simon",
    email: "simon@mail.com",
    password: "simonpassword"
}
*/
exports.router.post('/', (req, res, next) => {
    passport_1.default.authenticate('local-signup', async (err, idplayer, info) => {
        if (err) {
            return next(err);
        }
        if (!idplayer) {
            res.status(401).json(info); // Status Unauthorized
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
            userChannels.push(channel.channelname);
        }
        const appChannelsRes = await login_1.getAppChannels();
        let appChannels = new Array();
        for (let channel of appChannelsRes) {
            appChannels.push(channel.channelname);
        }
        res.status(200).json({ idplayer: idplayer, avatar: avatar, userChannels: userChannels, appChannels: appChannels, message: info.message }); //changer aussi dans signin
        return;
    })(req, res, next);
});
exports.router.get('/', (req, res) => {
    res.send({ message: 'Sign up failed' });
});
