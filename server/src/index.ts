// npm packages imports
import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';


// files imports
import { PORT } from './config/constants';

// routes imports
import { testRouter, loginRouter } from './routes/routes';

// Database connection
const db = require('./database/database');

const app = express();

// Middlewares
app.use(bodyParser.json());

// Passport
import './config/passport';
app.use(passport.initialize());
app.use(passport.session());

// Methode pour tester Postman / Body Parsing avec un JSON object
app.post('/postman', function(req, res){
    console.log("Body Parsing testing : ", req.body);
});

// Routing
app.get('/', (req, res) => {
    res.json({ message : "Bienvenue au backend de Fais-moi un dessin" });
});

app.use('/test', testRouter); 
app.use('/login', loginRouter);

const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// Exemple d'utilisation d'une query
//databaseQuery();
//'SELECT * FROM log3900db.player;'
function databaseQuery() {
    const username = 'failix';
    console.log('Running query to log39000-db on the player table...');
    const query = 'SELECT * FROM log3900db.player;'
    db.query(`
    SELECT Person.password, Person.idplayer
    FROM log3900db.Player 
    INNER JOIN log3900db.Person ON log3900db.Player.idplayer = Person.idplayer
    WHERE Player.username = $1`, [username])
        .then((res: { rows: any; }) => {
            const rows = res.rows;

            rows.map((row: any) => {
                console.log(`Read: ${JSON.stringify(row)}`);
            });
        })
        .catch((err: any) => {
            console.log(err);
        });
}


import { Server } from 'socket.io';

const io = new Server(server, { cors: {credentials: true, origin: 'http://localhost:4200' } });

io.on('connection', (socket) => {
    console.log('client has connected');
    
    
    socket.on('joinRoom', (room : any) => {
        console.log(socket.id);
        
        socket.emit('message', 'Your are connected');
        socket.join(room);
        io.to(socket.id).emit('message', 'You are connected to room' + room);
    })

    socket.on('chatMessage', (msg: any) => {
        console.log(msg);
        socket.broadcast.emit('chatMessage', msg);
        // io.emit('chatMessage', msg);
    }); 

    socket.on('disconnect', () => {
        console.log('client has disconnected');
        
    });

    
});