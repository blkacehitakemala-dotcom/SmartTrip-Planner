import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTripWithGemini } from './server/geminiTrip.ts';
import type { InterestKey, Language, TravelStyle } from './src/types/trip.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_STYLES: TravelStyle[] = ['backpacker', 'standard', 'luxury'];
const VALID_INTERESTS: InterestKey[] = [
  'culinary',
  'beach_nature',
  'history_culture',
  'shopping',
  'photo_spots',
  'snorkeling_diving',
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/generate-trip', async (req, res) => {
    try {
      const body = req.body ?? {};
      const destination = typeof body.destination === 'string' ? body.destination.trim() : '';
      const days = Number(body.days);
      const travelers = Number(body.travelers);
      const style: TravelStyle = VALID_STYLES.includes(body.style) ? body.style : 'standard';
      const language: Language = body.language === 'en' ? 'en' : 'id';
      const interests: InterestKey[] = Array.isArray(body.interests)
        ? body.interests.filter((i: unknown): i is InterestKey =>
            typeof i === 'string' && VALID_INTERESTS.includes(i as InterestKey)
          )
        : [];

      if (destination.length < 2 || destination.length > 120) {
        res.status(400).json({
          error:
            language === 'id'
              ? 'Destinasi wisata wajib diisi (2–120 karakter).'
              : 'Destination is required (2–120 characters).',
        });
        return;
      }

      if (!Number.isInteger(days) || days < 1 || days > 14) {
        res.status(400).json({
          error:
            language === 'id'
              ? 'Durasi liburan harus antara 1 hingga 14 hari.'
              : 'Trip duration must be between 1 and 14 days.',
        });
        return;
      }

      if (!Number.isInteger(travelers) || travelers < 1 || travelers > 50) {
        res.status(400).json({
          error:
            language === 'id'
              ? 'Jumlah peserta harus antara 1 hingga 50 orang.'
              : 'Number of travelers must be between 1 and 50.',
        });
        return;
      }

      const plan = await generateTripWithGemini(
        { destination, days, travelers, style, interests },
        language
      );

      res.json(plan);
    } catch (error) {
      console.error('[api/generate-trip] Error:', error);
      const lang: Language = req.body?.language === 'en' ? 'en' : 'id';
      const rawMsg = error instanceof Error ? error.message : '';

      let status = 500;
      let message =
        lang === 'id'
          ? 'Gagal membuat rencana perjalanan dari Gemini AI. Silakan coba lagi.'
          : 'Failed to generate trip plan from Gemini AI. Please try again.';

      if (rawMsg.includes('API_KEY_INVALID') || rawMsg.includes('PERMISSION_DENIED') || rawMsg.includes('not configured')) {
        status = 503;
        message =
          lang === 'id'
            ? 'Konfigurasi Gemini API belum tersedia atau tidak valid di server.'
            : 'Gemini API key is missing or invalid on the server.';
      } else if (rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('429')) {
        status = 429;
        message =
          lang === 'id'
            ? 'Batas permintaan AI sementara tercapai. Tunggu sebentar lalu coba lagi.'
            : 'AI request quota temporarily reached. Please wait a moment and try again.';
      }

      res.status(status).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartTrip server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
