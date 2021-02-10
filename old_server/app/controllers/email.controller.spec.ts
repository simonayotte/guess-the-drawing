import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { EmailService } from '../services/email.service';
import Types from '../types';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_ERROR = 404;

describe('EmailController', () => {
    let emailService: Stubbed<EmailService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.EmailService).toConstantValue({
            sendMail: sandbox.stub()
        });
        emailService = container.get(Types.EmailService);
        app = container.get<Application>(Types.Application).app;
    });

    it('sould return an error on fail', async () => {
        emailService.sendMail.rejects('Error');

        return supertest(app)
            .post('/email/send/')
            .expect(HTTP_STATUS_ERROR)
            .then((response: any) => {
                expect(response.status).to.deep.equal(HTTP_STATUS_ERROR);
            });
    });

    it('sould return a success on success', async () => {
        emailService.sendMail.resolves('Success');

        return supertest(app)
            .post('/email/send/')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.status).to.deep.equal(HTTP_STATUS_OK);
            });
    });
});
