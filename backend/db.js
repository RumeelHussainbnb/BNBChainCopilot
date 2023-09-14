//const MONGO_STRING = require('../src/config.env');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://admin:Mi8s5k9v1KO7TtPG@cluster0.n3ocyhg.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Timeout for server selection
  socketTimeoutMS: 45000, // Timeout for individual queries
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    // Start your Express server and define routes here
   
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = { client, startServer };

