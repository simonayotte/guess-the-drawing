"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// npm package to authenticate with the server
const passport_1 = __importDefault(require("passport"));
const db = require('../database/database');
//TODO : Add passportGoogle for authentification with Google as a new strategy
const LocalStrategy = require("passport-local").Strategy;
//TODO : Revoir le serialize et la gestion de session
passport_1.default.serializeUser((req, user, done) => {
    done(undefined, user);
});
passport_1.default.deserializeUser((idplayer, done) => {
    db.query(`SELECT * FROM person WHERE idplayer = $1`, [idplayer], (err, results) => {
        if (err) {
            return done(err);
        }
        console.log(`idplayer is ${results.rows[0].id}`);
        return done(null, results.rows[0]);
    });
});
passport_1.default.use("local-login", new LocalStrategy((username, password, done) => {
    console.log(`Authenticating... User : ${username} & Password : ${password}`);
    db.query(`
            SELECT Person.password, Person.idplayer, Person.avatar
            FROM log3900db.Player
            INNER JOIN log3900db.Person ON log3900db.Player.idplayer = Person.idplayer
            WHERE Player.username = $1`, [username], (err, results) => {
        if (err)
            return done(err, false, { message: "Erreur de communication avec la BD." });
        if (results.rows.length > 0) {
            const user = results.rows[0];
            if (user.password === password) {
                console.log("User authentification succesful");
                return done(null, user.idplayer, { message: "Success" }); // Retourne le idplayer quand c'est successful
            }
            return done(null, false, { message: "Le mot de passe fourni est incorrect." });
        }
        else { // No user with the name in the database
            return done(null, false, { message: "Il n'existe pas d'utilisateur avec ce pseudonyme dans la BD." });
        }
    });
}));
passport_1.default.use("local-signup", new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
    const email = req.body.email;
    const nom = req.body.lastName;
    const prenom = req.body.firstName;
    const avatar = Math.floor((Math.random() * 100)) % 10;
    console.log(`Signing up... User : ${username}, Email: ${email} & Password : ${password}`);
    // Vérifie que le username/password n'est pas déjà associé à un autre compte
    db.query(`
        SELECT Player.username, Person.email
        FROM log3900db.Player
        INNER JOIN log3900db.Person ON log3900db.Player.idplayer = Person.idplayer
        WHERE Player.username = $1 OR Person.email = $2`, [username, email], (err1, results) => {
        if (err1)
            return done(err1, false, { message: "Erreur de communication avec la BD." });
        console.log("Results from Existing User Query", results.rows);
        if (results.rows.length > 0) {
            const existingUser = results.rows[0];
            if (existingUser.username == username)
                return done(null, false, { message: "Ce nom d'utilisateur existe déjà. Veuillez en choisir un autre." });
            return done(null, false, { message: "Cet email est déjà associé à un compte." });
        }
        // Insère le nouveau user et retourne son id et ajoute user a general
        db.query(`
            WITH newPlayer AS (
                INSERT INTO log3900db.Player(username) VALUES ($1)
                RETURNING Player.idplayer AS id
            )
            INSERT INTO log3900db.Person (idplayer, email, password, firstname, lastname, avatar)
            SELECT id, $2, $3, $4, $5, $6 FROM newPlayer
            RETURNING Person.idplayer`, [username, email, password, prenom, nom, avatar], (err2, idresult) => {
            if (err2)
                return done(err2, false, { message: "Erreur de communication avec la BD." });
            const idplayer = idresult.rows[0].idplayer;
            db.query(`
                    INSERT INTO log3900db.ChannelConnexion(channelName,idPlayer) SELECT 'general',$1`, [idplayer], (err3) => {
                if (err3)
                    return done(err3, false, { message: "Erreur de communication avec la BD." });
                console.log(`User creation succesful with idplayer: ${idplayer}`);
                return done(null, idplayer, { message: "Success" });
            });
        });
    });
}));
