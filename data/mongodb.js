
const MongoClient = require('mongodb').MongoClient;
const dbURL = require('../config/db');
const client = new MongoClient(dbURL.url, { useUnifiedTopology: true, useNewUrlParser: true });
let db;

class MongodbConn {
   constructor() { }

   connectDB = async (callback) => {
      try {
         await client.connect((err, database) => {
            db = database;
            return callback(err);
         });
      } catch (e) {
         throw e;
      }
   }

   getDB = () => db;
   dbDisconnect = () => db.close();
}

module.exports = MongodbConn;