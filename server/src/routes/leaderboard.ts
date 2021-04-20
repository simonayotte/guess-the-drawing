import express from 'express';
import { leaveChannel, createChannel, doesChannelExist, joinChannel} from '../database/channel';
import { getStats } from '../database/leaderboard';
import { getAppChannels } from '../database/login';

export const router = express.Router({
    strict: true
});

router.post('/getStats', async (req, res) => {
    let stats: any[] = await getStats();
    res.status(200).json({stats: stats});
    return;
});