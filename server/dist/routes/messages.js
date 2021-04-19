"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const messages_1 = require("../database/messages");
exports.router = express_1.default.Router({
    strict: true
});
exports.router.post('/history', async (req, res) => {
    const history = await messages_1.getHistory(req.body.channel);
    res.send({ history: history });
});
