import * as Chai from 'chai';
import { ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Mongoose } from 'mongoose';
import * as sinon from 'sinon';
import { MetaData } from '../models/meta-data';
import { DatabaseService } from './database.service';

const VALIDATE_TAG = 'validateTag';
const VALIDATE_NAME = 'validateName';
const VALIDATE_METADATA = 'validateMetaData';

describe('Service: Database', () => {
    let databaseService: DatabaseService;
    const expect = Chai.expect;
    const mockMetaData: MetaData = {
        name: 'goodName',
        tags: ['tag1', 'tag2'],
        imageData: 'svg image'
    };
    let mongod: MongoMemoryServer;
    const opts = { useMongoClient: true };
    const mongoose = new Mongoose();
    const user = mongoose.model('User', new mongoose.Schema({ }));

    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongod = new MongoMemoryServer();
        const mongodURI = await mongod.getUri();
        await mongoose.connect(mongodURI, opts, (err) => {
            if (err) { console.error(err); }
        });
    });

    afterEach(async () => {
        await mongoose.disconnect();
        await mongod.stop();
    });

    it('should return true if metadatas are valid', () => {
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        sinon.stub(databaseService, VALIDATE_NAME as any).returns(true);
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        sinon.stub(databaseService, VALIDATE_TAG as any).returns(true);
        const returnedValue = databaseService[VALIDATE_METADATA](mockMetaData);
        expect(returnedValue).to.equals(true);
    });

    it('should return true if name valid', () => {
        const returnedValue = databaseService[VALIDATE_NAME](mockMetaData);
        expect(returnedValue).to.equals(true);
    });

    it('should return true if tags valid', () => {
        const returnedValue = databaseService[VALIDATE_TAG](mockMetaData);
        expect(returnedValue).to.equals(true);
    });

    // addMetaData
    it('should be falsy if metadata is false', async () => {
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        sinon.stub(databaseService, VALIDATE_METADATA as any).returns(false);
        try {
            await databaseService.addMetaData(mockMetaData);
        } catch (error) {
            expect(error).to.equals('Error');
        }
    });

    it('should call insertOne', async () => {
        const insertOne = await user.create();
        await databaseService.addMetaData(mockMetaData).then((result: string) => {
            expect(result).to.equals('Succes');
            expect(insertOne);
        });
    });

    // deleteId
    it('should return an error mesage and not call findOneAndDelete ', async () => {
        const findOneAndDelete = await user.findOneAndDelete();
        try {
            await databaseService.deleteId('sbjCode');
        } catch (error) {
            expect(error).to.equals('Error');
            expect(findOneAndDelete);
        }
    });

    // deleteId
    it('should call findOneAndDelete', async () => {
        const findOneAndDelete = await user.findOneAndDelete({_id: new ObjectId('53cb6b9b4f4ddef1ad47f943') });
        await databaseService.deleteId('53cb6b9b4f4ddef1ad47f943').then((result: string) => {
            expect(result).to.equals('Succes');
            expect(findOneAndDelete);
        });
    });

    // getAllMetaData
    it('shoul call find', async () => {
        const find = await user.find({});
        await databaseService.getAllMetaDatas().then(() => {
            expect(find);
        });
    });
});
