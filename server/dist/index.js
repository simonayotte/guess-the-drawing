"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lobbyList = exports.virtualPlayerService = exports.gameService = void 0;
const lobbyList_1 = require("./models/lobby/lobbyList");
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const body_parser_1 = __importDefault(require("body-parser"));
const socket_io_1 = require("socket.io");
const GameService_1 = require("./models/Game/GameService");
const constants_1 = require("./config/constants");
const routes_1 = require("./routes/routes");
//Set la bonne heure pour la base de donnes
process.env.TZ = "America/New_York";
// Database connection
const db = require('./database/database');
const app = express_1.default();
// CORS policy
app.all('', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "");
    res.header('Access-Control-Allow-Methods: GET, POST');
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
// CORS
var cors = require('cors');
var corsOptions = {
    origin: '*',
};
app.use(cors(corsOptions));
// Middlewares
app.use(body_parser_1.default.json());
// Passport
require("./config/passport");
const VirtualPlayerService_1 = require("./controllers/VirtualPlayerService");
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Routing
app.get('/', (req, res) => {
    res.json({ message: "Bienvenue au backend de Fais-moi un dessin" });
});
app.use('/test', routes_1.testRouter);
app.use('/login', routes_1.loginRouter);
app.use('/signup', routes_1.signupRouter);
app.use('/logout', routes_1.logoutRouter);
app.use('/messages', routes_1.messagesRouter);
app.use('/channel', routes_1.channelRouter);
app.use('/pmi', routes_1.pairMotImage);
app.use('/leaderboard', routes_1.leaderboardRouter);
app.use('/profile', routes_1.profileRouter);
exports.gameService = new GameService_1.GameService();
exports.virtualPlayerService = new VirtualPlayerService_1.VirtualPlayerService();
// Liste de lobby sur le serveur
exports.lobbyList = new lobbyList_1.LobbyList();
const server = app.listen(constants_1.PORT, () => {
    console.log(`Server is listening on port ${constants_1.PORT}`);
});
// Socket.io Initialization
const io = new socket_io_1.Server(server, { cors: { credentials: true, origin: '*' } });
// import event handlers
const socketConnectionHandler = require('./socket/socketConnectionHandler');
const chatMessageHandler = require('./socket/chat/chatMessageHandler');
const drawHandler = require('./socket/game/drawHandler');
const lobbyHandler = require('./socket/lobby/lobbyHandler');
const channelsHandler = require('./socket/chat/channelsHandler');
const gameActivityHandler = require('./socket/game/gameActivityHandler');
const onConnection = (socket) => {
    // Define all the event handlers to be used here
    socketConnectionHandler(io, socket);
    chatMessageHandler(io, socket);
    drawHandler(io, socket);
    lobbyHandler(io, socket);
    channelsHandler(io, socket);
    gameActivityHandler(io, socket);
};
io.on('connection', onConnection);
