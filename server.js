const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// MONGO CONNECTION
const MongoClient = require('mongodb').MongoClient;
const uri = process.argv[2];
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect();

// SEARCH METHOD
app.get('/', (req, res) => {
  res.send('Ad Search Extension server is working!')
})

app.get('/search', (req, res) => {
  let keyword = req.query.q;
  console.log(keyword);

  const collection = client.db('adExtension').collection('links');

  collection
    .find({ $text: { $search: keyword } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .toArray()
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});

// // Create a function to terminate your app gracefully:
// function gracefulShutdown() {
//   // First argument is [force], see mongoose doc.
//   client.close(() => {
//     console.log('MongoDb connection closed.');
//   });
// }

// // Ask node to run your function before exit:

// // This will handle process.exit():
// process.on('exit', gracefulShutdown);

// // This will handle kill commands, such as CTRL+C:
// process.on('SIGINT', gracefulShutdown);
// process.on('SIGTERM', gracefulShutdown);
// process.on('SIGKILL', gracefulShutdown);

// // This will prevent dirty exit on code-fault crashes:
// process.on('uncaughtException', gracefulShutdown);
