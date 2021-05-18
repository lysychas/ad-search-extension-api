const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// MONGO CONNECTION
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATABASE_URL || process.argv[2];
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect();

// LANDING PAGE
app.get('/', (req, res) => {
  res.send('Ad Search Extension server is working!');
});

// GET ALL ADS
app.get('/search/all', (req, res) => {
  const collection = client.db('adExtension').collection('links');

  collection
    .find({})
    .toArray()
    .then((data) => {
      // console.log(data);
      res.json(data);
    })
    .catch((err) => console.log(err));
});

// SEARCH METHOD
app.get('/search', (req, res) => {
  let keyword = req.query.q;

  const projection = {
    _id: 0,
    title: 1,
    link: 1,
    description: 1,
    score: { $meta: 'textScore' },
  };

  const collection = client.db('adExtension').collection('links');
  collection
    .find({ $text: { $search: keyword } })
    .sort({ score: { $meta: 'textScore' } })
    .project(projection)
    .toArray()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log(err));
});

app.put('/keyword', (req, res) => {
  let keyword = req.body.keyword;
  const keywords = client.db('adExtension').collection('keywords');
  keywords.updateOne(
    { keyword: keyword },
    { $inc: { searched: 1 } },
    { upsert: true }
  );

  const projection = {
    _id: 0,
    keyword: 1,
    searched: 1,
  };

  keywords
    .find({ keyword: keyword })
    .project(projection)
    .toArray()
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => console.log(err));
});

module.exports = app;
