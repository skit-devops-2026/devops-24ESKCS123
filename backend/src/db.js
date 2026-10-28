const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('******')) {
    throw new Error('MONGODB_URI is missing or invalid');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = { connectDatabase, disconnectDatabase };
