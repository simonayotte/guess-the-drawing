// npm packages imports
import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';


// files imports
import { PORT } from './config/constants';

// routes imports
import { testRouter, loginRouter, signupRouter } from './routes/routes';

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

var cors = require('cors');
var corsOptions = {
  origin: '*',
}
app.use(cors(corsOptions));

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
app.use('/signup', signupRouter);


const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// Exemple d'utilisation d'une query
databaseQuery();
//'SELECT * FROM log3900db.player;'
function databaseQuery() {
    const username = 1;
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



const io = new Server(server, { cors: {credentials: true, origin: '*' } });

io.on('connection', (socket) => {
    
    socket.on('connectSocketid', (id: any) => {
        db.query(`
        UPDATE LOG3900DB.Person
        SET idSocket=$1
        WHERE Person.idPlayer = $2`, [socket.id,id])
        .catch((err: any) => {
            console.log(err); 
        });
        db.query(`
        SELECT Player.username, Person.avatar
        FROM log3900db.Player
        INNER JOIN log3900db.Person ON log3900db.Player.idplayer = Person.idplayer
        WHERE Player.idplayer = $1`, [id])
        .then((res: { rows: any; }) => {
            socket.emit('playerInfo', {username : res.rows[0].username, avatar : res.rows[0].avatar});
            
        })
        .catch((err: any) => {
            console.log(err);
    });
    }); 

    socket.on('chatMessage', (msg: any) => {
        socket.broadcast.emit('chatMessage', msg);
    }); 

    socket.on('disconnect', () => {
        console.log('client has disconnected');
        db.query(`UPDATE log3900db.Person SET isconnected = false WHERE idSocket = $1`,
        [socket.id],
        (err: any, results: any) => {
            if (err) throw err;
        });
        
    });
       


});
