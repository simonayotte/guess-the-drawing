"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
// TODO : Mettre username et password dans des variables d'environnement
const pg_1 = require("pg");
exports.dbConfig = {
    connectionLimit: 1000,
    host: 'log3900db-205.postgres.database.azure.com',
    user: 'log3900@log3900db-205',
    password: 'Polymtl3900',
    database: 'log3900-db',
    port: 5432,
    ssl: true
};
const pool = new pg_1.Pool(exports.dbConfig);
// pool.connect( (err: any) => {
//     if (err) throw err;
//     else {
//         console.log('Connection with log-3900 Azure database');
//     }
// });
// Here we specify the functions we expose in exporting  
module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    },
};
