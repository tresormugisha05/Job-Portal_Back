const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/job_portal')
  .then(async () => {
    const collection = mongoose.connection.db.collection('employers');
    await collection.dropIndex('email_1').catch(() => console.log('Index already dropped or does not exist'));
    console.log('Index dropped successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
