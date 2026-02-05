import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs';
import * as path from 'path';
import app from './app';
import { findAvailablePort } from './port-utils';

const DEFAULT_PORT = parseInt(process.env.PORT || '3001', 10);

async function startServer() {
  // In production (e.g. Cloud Run), we MUST use the port provided by the environment
  // and NOT search for an available one, as Cloud Run expects us to listen on EXACTLY $PORT.
  const isProduction = process.env.NODE_ENV === 'production';
  const port = isProduction ? DEFAULT_PORT : await findAvailablePort(DEFAULT_PORT + 1);

  app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
    
    // Write the port to a file so Vite can read it for proxying
    if (!isProduction) {
      fs.writeFileSync(path.join(process.cwd(), '.server-port'), port.toString());
    }
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
