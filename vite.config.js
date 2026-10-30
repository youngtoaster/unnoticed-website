import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// Custom plugin for instant cross-device multi-device local/network persistence
function devDataSyncPlugin() {
  return {
    name: 'dev-data-sync',
    configureServer(server) {
      server.middlewares.use('/api/sync-data', async (req, res) => {
        // Handle CORS Preflight
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 204;
          res.end();
          return;
        }

        // Handle POST Write to Disk
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              const publicDir = path.resolve(process.cwd(), 'public');
              if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir, { recursive: true });
              }
              const filePath = path.resolve(publicDir, 'site_data.json');
              fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf-8');

              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, timestamp: Date.now() }));
            } catch (err) {
              console.error('Error in /api/sync-data write:', err);
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // Handle GET Read from Disk
        if (req.method === 'GET') {
          try {
            const filePath = path.resolve(process.cwd(), 'public/site_data.json');
            if (fs.existsSync(filePath)) {
              const content = fs.readFileSync(filePath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.statusCode = 200;
              res.end(content);
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'No synced data file yet' }));
            }
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    devDataSyncPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
