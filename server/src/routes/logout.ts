import express from 'express';
import { disconnect } from '../database/logout';

export const router = express.Router({
    strict: true
});

/* Request form for logout
{
    idplayer: 1
}
*/

//TODO: Refactor ? Modifier ? Changer 
router.post('/', (req, res) => {
    disconnect(req.body.idplayer);
    res.status(200).json({ message : "L'utilisateur a ete deconnecte de la BD"});
});