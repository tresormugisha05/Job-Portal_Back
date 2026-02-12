// Run this script to drop the old email index from employers collection
// Execute: node fix-employer-index.js

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Update with your MongoDB URI
const dbName = 'job_portal';

async function dropIndex() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    await db.collection('employers').dropIndex('email_1');
    console.log('Successfully dropped email_1 index from employers collection');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

dropIndex();
