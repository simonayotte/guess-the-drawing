import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { MetaData } from '../models/meta-data';
import { DatabaseService } from '../services/database.service';
import Types from '../types';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
// const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_NOT_FOUND = 404;

describe('DatabaseController', () => {
    let databaseService: Stubbed<DatabaseService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.DatabaseService).toConstantValue({
            addMetaData: sandbox.stub(),
            deleteId: sandbox.stub(),
            getAllMetaDatas: sandbox.stub()
        });
        databaseService = container.get(Types.DatabaseService);
        app = container.get<Application>(Types.Application).app;
    });

    // GET getAllMetaDatas
    it('should return succes as a message on service succes', async () => {
        const mockMetaData: MetaData = {
            name: 'goodName',
            tags: ['tag1', 'tag2'],
            imageData: 'svg image'
        };
        databaseService.getAllMetaDatas.resolves(mockMetaData);

        return supertest(app)
            .get('/database/metadata/')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(mockMetaData);
            });
    });

    it('should return an error as a message on service fail', async () => {
        databaseService.getAllMetaDatas.rejects('Error');

        return supertest(app)
            .get('/database/metadata')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.status).to.deep.equal(HTTP_STATUS_NOT_FOUND);
            });
    });

    // POST addMetaData
    it('should return succes as a message on service succes', async () => {
        databaseService.addMetaData.resolves('Succes');

        return supertest(app)
            .post('/database/metadata/')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.status).to.equal(HTTP_STATUS_OK);
            });
    });

    it('should return an error as a message on service fail', async () => {
        databaseService.addMetaData.rejects('Error');

        return supertest(app)
            .post('/database/metadata/')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.status).to.deep.equal(HTTP_STATUS_NOT_FOUND);
            });
    });

    // DELETE deleteId
    it('should return succes as a message on service succes', async () => {
        databaseService.deleteId.resolves('Succes');

        return supertest(app)
            .delete('/database/id/:id')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.status).to.equal(HTTP_STATUS_OK);
            });
    });

    it('should return an error as a message on service fail', async () => {
        databaseService.deleteId.rejects('Error');

        return supertest(app)
            .delete('/database/id/:id')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.status).to.deep.equal(HTTP_STATUS_NOT_FOUND);
            });
    });
});
