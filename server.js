// MongoDB Proxy Server (Node.js + Express)
// Requirements:
// - Node.js
// - Express
// - MongoDB Node.js driver

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const uri = 'mongodb://localhost:27017'; // Change to your MongoDB URI
const dbName = 'players'; // Change to your database name
let db;

app.use(cors());
app.use(bodyParser.json());

MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log(`Connected to MongoDB: ${dbName}`);
  })
  .catch(error => console.error(error));

// Create a new document
app.post('/:collection', async (req, res) => {
  const { collection } = req.params;
  try {
    const result = await db.collection(collection).insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read documents
app.post('/:collection/find', async (req, res) => {
  const { collection } = req.params;
  try {
    const result = await db.collection(collection).find(req.body).toArray();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update documents
app.put('/:collection', async (req, res) => {
  const { collection } = req.params;
  const { filter, update } = req.body;
  try {
    const result = await db.collection(collection).updateMany(filter, { $set: update });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete documents
app.delete('/:collection', async (req, res) => {
  const { collection } = req.params;
  try {
    const result = await db.collection(collection).deleteMany(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`MongoDB Proxy Server running at http://localhost:${port}`);
});
