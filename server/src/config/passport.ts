// npm package to authenticate with the server
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
const db = require('../database/database');
//TODO : Add passportGoogle for authentification with Google as a new strategy

const LocalStrategy = require("passport-local").Strategy;

//TODO : Revoir le serialize et la gestion de session
passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
});

passport.deserializeUser((idplayer, done) => {
    db.query(`SELECT * FROM person WHERE idplayer = $1`, [idplayer], (err: any, results: any) => {
      if (err) {
        return done(err);
      }
      console.log(`idplayer is ${results.rows[0].id}`);
      return done(null, results.rows[0]);
    });
});

passport.use("local", new LocalStrategy((username: String, password: String, done : any) => {
    console.log(`Authenticating... User : ${username} & Password : ${password}`);
    db.query(`
            SELECT Person.password, Person.idplayer
            FROM log3900db.Player 
            INNER JOIN log3900db.Person ON log3900db.Player.idplayer = Person.idplayer
            WHERE Player.username = $1`, [username], (err: any, results: any) => {
        if (err) throw err;
        console.log("Results from User Authentication Query", results.rows);
        if (results.rows.length > 0) {
            const user = results.rows[0];
            if (user.password === password) {
                console.log("User authentification succesful");
                return done(null, user.idplayer, { message : "Success"}); // Retourne le idplayer quand c'est successful
            } return done(null, false, { message : "Le mot de passe fournie est incorrect."});

        } else { // No user with the name in the database
            return done(null, false, { message : "Il n'existe pas d'utilisateur avec ce pseudonyme dans la BD."});
        }
    })
}));

