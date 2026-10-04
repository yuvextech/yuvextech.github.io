import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function githubPagesSpaPlugin(): Plugin {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      try {
        const distDir = path.resolve(__dirname, 'dist');
        const indexPath = path.join(distDir, 'index.html');
        const notFoundPath = path.join(distDir, '404.html');
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath);
        }
      } catch {
        // Ignore fallback copy error if dist doesn't exist
      }
    }
  };
}

function aiDevPlugin(): Plugin {
  return {
    name: 'ai-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/ai/generate') && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { prompt, model, temperature, maxOutputTokens, googleSearch } = JSON.parse(body || '{}');
              const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
              if (!apiKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured in server environment' }));
                return;
              }
              const { GoogleGenAI } = await import('@google/genai');
              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
              });

              const modelsToTry = [model || 'gemini-2.5-flash', 'gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
              let lastErr: any = null;
              for (const m of [...new Set(modelsToTry)]) {
                try {
                  const response = await ai.models.generateContent({
                    model: m,
                    contents: prompt,
                    config: {
                      ...(temperature !== undefined ? { temperature } : {}),
                      ...(maxOutputTokens !== undefined ? { maxOutputTokens } : {}),
                      ...(googleSearch ? { tools: [{ googleSearch: {} }] } : {})
                    }
                  });
                  const text = response.text || '';
                  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ text, groundingMetadata }));
                  return;
                } catch (err: any) {
                  lastErr = err;
                  console.warn(`[AI Route] Model ${m} error, trying fallback...`, err?.message || err);
                }
              }
              throw lastErr || new Error('Generation failed across models');
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || String(err) }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), aiDevPlugin(), githubPagesSpaPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          'firebase-core': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        }
      }
    }
  }
});
