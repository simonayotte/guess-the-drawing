import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions, ObjectId} from 'mongodb';
import 'reflect-metadata';
import { MetaData } from '../models/meta-data';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://admin:admin@drawing-info-cbl9l.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'projet_2';
const DATABASE_COLLECTION = 'drawing-info';

@injectable()
export class DatabaseService {

    collection: Collection<MetaData>;

    private options: MongoClientOptions = {
        useNewUrlParser : true,
        useUnifiedTopology : true
    };

    constructor() {
        MongoClient.connect(DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
            })
            .catch(() => {
                console.error('CONNECTION ERROR. EXITING PROCESS');
                process.exit(1);
            });

    }
    // GET
    async getAllMetaDatas(): Promise<MetaData[]> {
        return  this.collection.find({}).toArray()
                .then((metaDatas: MetaData[]) => {
                    return metaDatas;
                });
    }

    // DELETE
    async deleteId(sbjCode: string): Promise<string> {
        try {
            this.collection.findOneAndDelete({_id: new ObjectId(sbjCode) });
            return Promise.resolve('Succes');
        } catch (error) {
            return Promise.reject('Error');
        }
    }

    // POST
    async addMetaData(metaData: MetaData): Promise<string> {
        if (this.validateMetaData(metaData)) {
            this.collection.insertOne(metaData);
            return Promise.resolve('Succes');
        } else {
            return Promise.reject('Error');
        }

    }

    private validateMetaData(metaData: MetaData): boolean {
        return this.validateName(metaData) && this.validateTag(metaData);
    }

    private validateName(metaData: MetaData): boolean {
        return metaData.name !== null;
    }

    private validateTag(metaData: MetaData): boolean {
        return (metaData.tags !== undefined);
    }
}
