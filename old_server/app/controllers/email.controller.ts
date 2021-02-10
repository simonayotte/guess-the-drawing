import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { EmailService } from '../services/email.service';
import Types from '../types';

@injectable()
export class EmailController {
    router: Router;

    constructor(@inject(Types.EmailService) private emailService: EmailService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        // POST
        this.router.post('/send', async (req: Request, res: Response, next: NextFunction) => {
            this.emailService.sendMail(req.body.base64Data, req.body.email, req.body.fileName, req.body.imageType)
                .then(() => {
                    res.status(Httpstatus.OK).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
    }
}
