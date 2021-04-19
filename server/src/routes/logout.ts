import express from 'express';
import { disconnect, addNewLogout } from '../database/logout';

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
    try {
        disconnect(req.body.idplayer);
        addNewLogout(req.body.idplayer);
    } catch(err) {
        res.status(500).json({ message: "Erreur lors de la déconnexion de l'utilisateur."});
        return;
    }
    res.status(200).json({ message : "L'utilisateur a ete deconnecte de la BD"});
});