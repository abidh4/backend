const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

const MONGO_URL =
  "mongodb+srv://root:root@abidict.s8jeg1g.mongodb.net/?retryWrites=true&w=majority&appName=abidICT";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGO_URL)
    .then((client) => {
      callback();
      _db = client.db("abidDatabase");
    })
    .catch((err) => {
      console.log("Error occured in mongo connection", err);
    });
};

const getDB = () => {
  if (!_db) {
    throw new Error("Mongo Couldn't Connect");
  }
  return _db;
};
exports.mongoConnect = mongoConnect;
exports.getDB = getDB;