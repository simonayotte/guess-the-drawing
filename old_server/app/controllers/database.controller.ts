import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
// import * as Httpstatus from '../../node_modules/http-status-codes';
import { MetaData } from '../models/meta-data';
import { DatabaseService } from '../services/database.service';
import Types from './../types';

@injectable()
export class DatabaseController {

    router: Router;

    constructor( @inject(Types.DatabaseService) private databaseService: DatabaseService ) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        // GET
        this.router.get('/metadata', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getAllMetaDatas()
                .then((metaDatas: MetaData[]) => {
                    res.json(metaDatas);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        // DELETE
        this.router.delete('/id/:id', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.deleteId(req.params.id)
                .then(() => {
                    res.sendStatus(Httpstatus.OK).send('Succes');
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        // POST
        this.router.post('/metadata/', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.addMetaData(req.body)
                .then(() => {
                    res.status(Httpstatus.OK).send('Succes');
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
    }
}
