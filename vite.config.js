import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  server: {
    port: 5173,
    host: '127.0.0.1',
    open: false,
    watch: {
      ignored: ['**/octaspards/**', '**/.git/**', '**/node_modules/**']
    }
  },
  plugins: [
    {
      name: 'tecdoc-api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/api/')) {
            res.setHeader('Content-Type', 'application/json');

            if (req.url === '/api/health') {
              res.end(JSON.stringify({ status: 'ok', dataset: 'TecDoc 2Q 2023', totalQueries: 25 }));
              return;
            }

            if (req.url === '/api/queries') {
              const sqlFiles = fs.readdirSync(process.cwd()).filter(f => f.endsWith('.sql'));
              const list = sqlFiles.map((file, idx) => ({
                id: idx + 1,
                filename: file,
                sizeBytes: fs.statSync(path.join(process.cwd(), file)).size
              }));
              res.end(JSON.stringify(list));
              return;
            }

            if (req.url.startsWith('/api/raw-sql/')) {
              const filename = decodeURIComponent(req.url.replace('/api/raw-sql/', ''));
              const filePath = path.join(process.cwd(), filename);
              if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.end(fs.readFileSync(filePath, 'utf8'));
                return;
              }
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'File not found' }));
              return;
            }
          }
          next();
        });
      }
    }
  ]
});
