import express, { Request, Response } from 'express';
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

router.post('/', passport.authenticate("local", { failureRedirect: '/login', successRedirect: '/'}), (req, res) => {
    res.json({ message: 'Authentification succesful !'});
});

router.get('/', (req, res) => {
    res.send({message : 'Login failed'});
})

