"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualPlayer = void 0;
const login_1 = require("../database/login");
const virtualPlayer_1 = require("../database/virtualPlayer");
const VirtualPlayers_json_1 = __importDefault(require("./VirtualPlayers.json"));
class VirtualPlayer {
    constructor(idPartner, otherVirtualPlayer) {
        let newId = this.getRandomInt(0, 4);
        if (otherVirtualPlayer !== undefined) {
            while (newId === otherVirtualPlayer) {
                newId = this.getRandomInt(0, 4);
            }
        }
        this.idPlayer = newId;
        this.idPartner = idPartner;
        this.partnerName = "undefined";
    }
    getIdPlayer() {
        return this.idPlayer + 11;
    }
    getAvatar() {
        return VirtualPlayers_json_1.default.virtualPlayers[this.idPlayer].avatar;
    }
    getPlayerName() {
        return VirtualPlayers_json_1.default.virtualPlayers[this.idPlayer].name;
    }
    getHint() {
        let hintsLenght = VirtualPlayers_json_1.default.virtualPlayers[this.idPlayer].hints.length;
        return VirtualPlayers_json_1.default.virtualPlayers[this.idPlayer].hints[Math.floor(Math.random() * hintsLenght)];
    }
    getCheering() {
        let cheeringsLenght = VirtualPlayers_json_1.default.virtualPlayers[this.idPlayer].cheerings.length;
        return VirtualPlayers_json_1.default.virtualPlayers[this.idPlayer].cheerings[Math.floor(Math.random() * cheeringsLenght)] + this.partnerName + "!";
    }
    async getGameStart() {
        this.partnerName = await login_1.getUsername(this.idPartner);
        return VirtualPlayers_json_1.default.virtualPlayers[this.idPlayer].gameStart;
    }
    getRoundEnd() {
        let roundEndLenght = VirtualPlayers_json_1.default.virtualPlayers[this.idPlayer].roundEnd.length;
        return VirtualPlayers_json_1.default.virtualPlayers[this.idPlayer].roundEnd[Math.floor(Math.random() * roundEndLenght)] + this.partnerName + "!";
    }
    async getStats() {
        let sentence = "";
        let roundEndLenght = VirtualPlayers_json_1.default.virtualPlayers[this.idPlayer].statsPoints.length;
        sentence = VirtualPlayers_json_1.default.virtualPlayers[this.idPlayer].statsPoints[Math.floor(Math.random() * roundEndLenght)] + this.partnerName + "!";
        let points = await virtualPlayer_1.getPointsFromPlayer(this.idPartner);
        sentence = sentence.replace("STAT", points.toString());
        return sentence;
    }
    setTeamMember(name) {
        this.partnerName = name;
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    getCloseGuess() {
        return "Tu es si proche de la bonne réponse " + this.partnerName + "!!";
    }
}
exports.VirtualPlayer = VirtualPlayer;
