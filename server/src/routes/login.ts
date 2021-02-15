import express, { Request, Response } from 'express';
import {addNewLogin, setIsConnected} from '../database/login';
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
    passport.authenticate('local', (err, idplayer , info) => {
        if (err) { return next(err); }
        if (!idplayer) {
            res.status(401).json(info); ; // Status Unauthorized
            return;
        }
        setIsConnected(idplayer);
        addNewLogin(idplayer);
        res.status(200).json({ idplayer : idplayer, message : info.message });
        return;
    })(req, res, next);
});

router.get('/', (req, res) => {
    res.send({message : 'Login failed'});
});

