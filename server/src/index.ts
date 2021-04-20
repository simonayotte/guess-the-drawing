import { LobbyList } from './models/lobby/lobbyList';
import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import { Server, Socket } from 'socket.io';
import { GameService } from './models/Game/GameService';
import { PORT } from './config/constants';
import { testRouter, loginRouter, signupRouter, logoutRouter, messagesRouter, channelRouter, leaderboardRouter, pairMotImage, profileRouter} from './routes/routes';

//Set la bonne heure pour la base de donnes
process.env.TZ = "America/New_York";

// Database connection
const db = require('./database/database');

const app = express();

// CORS policy
app.all('', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "");
    res.header('Access-Control-Allow-Methods: GET, POST');
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

// CORS
var cors = require('cors');
var corsOptions = {
  origin: '*',
}
app.use(cors(corsOptions));

// Middlewares
app.use(bodyParser.json());

// Passport
import './config/passport';
import { VirtualPlayerService } from './controllers/VirtualPlayerService';
app.use(passport.initialize());
app.use(passport.session());

// Routing
app.get('/', (req, res) => {
    res.json({ message : "Bienvenue au backend de Fais-moi un dessin" });
});

app.use('/test', testRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/logout', logoutRouter);
app.use('/messages', messagesRouter);
app.use('/channel', channelRouter);
app.use('/pmi', pairMotImage);
app.use('/leaderboard', leaderboardRouter);
app.use('/profile', profileRouter);

export const gameService = new GameService();
export const virtualPlayerService = new VirtualPlayerService();

// Liste de lobby sur le serveur
export let lobbyList = new LobbyList();

const server = app.listen(PORT, () => {
});

// Socket.io Initialization
const io = new Server(server, { cors: {credentials: true, origin: '*' } });
// import event handlers
const socketConnectionHandler = require('./socket/socketConnectionHandler');
const chatMessageHandler = require('./socket/chat/chatMessageHandler');
const drawHandler = require('./socket/game/drawHandler');
const lobbyHandler = require('./socket/lobby/lobbyHandler');
const channelsHandler = require('./socket/chat/channelsHandler')
const gameActivityHandler = require('./socket/game/gameActivityHandler')

const onConnection = (socket : Socket) => {
    // Define all the event handlers to be used here
    socketConnectionHandler(io, socket);
    chatMessageHandler(io, socket);
    drawHandler(io, socket);
    lobbyHandler(io, socket);
    channelsHandler(io, socket)
    gameActivityHandler(io, socket)
};

io.on('connection', onConnection); 
