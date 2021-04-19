"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const logout_1 = require("../database/logout");
exports.router = express_1.default.Router({
    strict: true
});
/* Request form for logout
{
    idplayer: 1
}
*/
//TODO: Refactor ? Modifier ? Changer 
exports.router.post('/', (req, res) => {
    try {
        logout_1.disconnect(req.body.idplayer);
        logout_1.addNewLogout(req.body.idplayer);
    }
    catch (err) {
        res.status(500).json({ message: "Erreur lors de la déconnexion de l'utilisateur." });
        return;
    }
    res.status(200).json({ message: "L'utilisateur a ete deconnecte de la BD" });
});
