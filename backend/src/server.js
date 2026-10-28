const path = require('node:path');
const dotenv = require('dotenv');
const { buildApp } = require('./app');
const { connectDatabase, disconnectDatabase } = require('./db');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../atlas-credentials.env') });

const port = Number(process.env.PORT || 3000);
const app = buildApp();

async function startServer() {
  await connectDatabase();

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`TrustLens backend listening on port ${port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer().catch((error) => {
  console.error('Failed to start backend:', error.message);
  process.exit(1);
});
