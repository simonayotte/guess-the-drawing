"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const leaderboard_1 = require("../database/leaderboard");
exports.router = express_1.default.Router({
    strict: true
});
exports.router.post('/getStats', async (req, res) => {
    let stats = await leaderboard_1.getStats();
    console.log(stats);
    res.status(200).json({ stats: stats });
    return;
});
