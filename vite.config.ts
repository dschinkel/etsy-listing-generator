import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    let serverPort = '3001';
    try {
      if (fs.existsSync('.server-port')) {
        serverPort = fs.readFileSync('.server-port', 'utf-8').trim();
      }
    } catch (e) {
      // Ignore errors reading the file
    }

    const writeClientPortPlugin = {
      name: 'write-client-port',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          const address = server.httpServer?.address();
          if (address && typeof address !== 'string') {
            fs.writeFileSync('.client-port', address.port.toString());
          }
        });
      },
    };

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        open: true,
        strictPort: false,
        proxy: {
          '/listings': {
            target: `http://127.0.0.1:${serverPort}`,
            changeOrigin: true,
            secure: false,
          },
        },
      },
      plugins: [react(), writeClientPortPlugin],
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
