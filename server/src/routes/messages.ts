import express from 'express';
import { getHistory } from '../database/messages';

export const router = express.Router({
    strict: true
});

router.post('/history', async (req, res) => {
    const history = await getHistory(req.body.channel);
    res.send({history : history});
});