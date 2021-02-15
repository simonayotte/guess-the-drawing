// TODO : Mettre username et password dans des variables d'environnement
import pg, { Client, Connection, Pool } from 'pg';
export const  dbConfig = {
    host: 'log3900-205.postgres.database.azure.com',
    user: 'log3900@log3900-205',
    password: 'Polymtl3900',
    database: 'log3900-db',
    port: 5432,
    ssl: true
};

const pool = new Pool(dbConfig);
// pool.connect( (err: any) => {
//     if (err) throw err;
//     else {
//         console.log('Connection with log-3900 Azure database');
//     }
// });

// Here we specify the functions we expose in exporting  
module.exports = {
    query: (text: string, params: any, callback: (err: Error, result: pg.QueryResult<any>) => void) => {
        return pool.query(text, params, callback);
    },
}


