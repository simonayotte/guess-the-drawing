import express, { Request, Response } from 'express';
import { testController } from '../../controllers';

export const router = express.Router({
    strict: true
});

router.post('/', (req: Request, res: Response) => {
    testController.create(req, res);
});

router.get('/', (req: Request, res: Response) => {
    testController.read(req, res);
});

router.patch('/', (req: Request, res: Response) => {
    testController.update(req, res);
});

router.delete('/', (req: Request, res: Response) => {
    testController.delete(req, res);
});