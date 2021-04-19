"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualPlayerService = void 0;
const VirtualPlayer_1 = require("./VirtualPlayer");
class VirtualPlayerService {
    constructor() {
        this.virtualPlayers = new Map();
    }
    newPlayer(idPartner, idOtherVirtualPlayer) {
        let id = 1000;
        while (this.virtualPlayers.has(id)) {
            id++;
        }
        this.virtualPlayers.set(id, new VirtualPlayer_1.VirtualPlayer(idPartner, idOtherVirtualPlayer));
        return id;
    }
    deletePlayer(idVirtualPlayer) {
        this.virtualPlayers.delete(idVirtualPlayer);
    }
    getIdPlayer(idVirtualPlayer) {
        var _a;
        let id = (_a = this.virtualPlayers.get(idVirtualPlayer)) === null || _a === void 0 ? void 0 : _a.getIdPlayer();
        return (id != undefined) ? id : 10;
    }
    getName(idVirtualPlayer) {
        var _a;
        let name = (_a = this.virtualPlayers.get(idVirtualPlayer)) === null || _a === void 0 ? void 0 : _a.getPlayerName();
        return (name != undefined) ? name : "Botty Crocker";
    }
    getAvatar(idVirtualPlayer) {
        var _a;
        let avatar = (_a = this.virtualPlayers.get(idVirtualPlayer)) === null || _a === void 0 ? void 0 : _a.getAvatar();
        return (avatar != undefined) ? avatar : 9;
    }
    getHint(idVirtualPlayer) {
        var _a;
        let hint = (_a = this.virtualPlayers.get(idVirtualPlayer)) === null || _a === void 0 ? void 0 : _a.getHint();
        return (hint != undefined) ? hint : "hint error";
    }
    getVirtualPlayerName(idVirtualPlayer) {
        var _a;
        let name = (_a = this.virtualPlayers.get(idVirtualPlayer)) === null || _a === void 0 ? void 0 : _a.getPlayerName();
        return (name != undefined) ? name : "name error";
    }
    getCheering(idVirtualPlayer) {
        var _a;
        let cheering = (_a = this.virtualPlayers.get(idVirtualPlayer)) === null || _a === void 0 ? void 0 : _a.getCheering();
        return (cheering != undefined) ? cheering : "cheering error";
    }
    async getGameStart(idVirtualPlayer) {
        var _a;
        let startSentence = await ((_a = this.virtualPlayers.get(idVirtualPlayer)) === null || _a === void 0 ? void 0 : _a.getGameStart());
        return (startSentence != undefined) ? startSentence : "startSentence error";
    }
    async getStat(idVirtualPlayer) {
        var _a;
        let stat;
        try {
            stat = await ((_a = this.virtualPlayers.get(idVirtualPlayer)) === null || _a === void 0 ? void 0 : _a.getStats());
        }
        catch (err) {
            return "stat error";
        }
        return (stat != undefined) ? stat : "stat error";
    }
    getRoundEnd(idVirtualPlayer) {
        var _a;
        let endSentence = (_a = this.virtualPlayers.get(idVirtualPlayer)) === null || _a === void 0 ? void 0 : _a.getRoundEnd();
        return (endSentence != undefined) ? endSentence : "endSentence error";
    }
    getCloseGuess(idVirtualPlayer) {
        var _a;
        let closeGuessSentence = (_a = this.virtualPlayers.get(idVirtualPlayer)) === null || _a === void 0 ? void 0 : _a.getCloseGuess();
        return (closeGuessSentence != undefined) ? closeGuessSentence : "closeGuess error";
    }
}
exports.VirtualPlayerService = VirtualPlayerService;
