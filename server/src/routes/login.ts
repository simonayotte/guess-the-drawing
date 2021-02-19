import express, { Request, Response } from 'express';
import {addNewLogin, connect, isConnected } from '../database/login';
import passport from 'passport';

export const router = express.Router({
    strict: true
});

/* Request form for login in JSON
{
    username: "simon",
    password: "simonpassword"
}
*/

router.post('/', (req, res, next) => {
    passport.authenticate('local-login', async (err, idplayer , info) => {
        if (err) { return next(err); }
        if (!idplayer) {
            res.status(401).json(info); ; // Status Unauthorized
            return;
        }
        const connectionStatus = await isConnected(idplayer);
        if (connectionStatus) {
            res.status(401).json({message : "L'utilisateur est déjà connecté ailleurs."});
            return;
        }
        connect(idplayer); 
        addNewLogin(idplayer);
        res.status(200).json({ idplayer : idplayer, message : info.message });
        return;
    })(req, res, next);
});

router.get('/', (req, res) => {
    res.send({message : 'Login failed'});
});
