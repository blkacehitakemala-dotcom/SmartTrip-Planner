import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTripWithGemini } from './server/geminiTrip.ts';
import {
  forwardToN8nWebhook,
  validateWebhookUrlStructure,
  type N8nTripContext,
} from './server/n8nWebhook.ts';
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

  app.get('/api/n8n-chat/config', (_req, res) => {
    const serverWebhookUrl = (process.env.N8N_WEBHOOK_URL || '').trim();
    const isConfigured =
      serverWebhookUrl.length > 0 && validateWebhookUrlStructure(serverWebhookUrl).valid;
    res.json({ serverConfigured: isConfigured });
  });

  app.post('/api/n8n-chat', async (req, res) => {
    try {
      const body = req.body ?? {};
      const lang: Language = body.language === 'en' ? 'en' : 'id';
      const currency = body.currency === 'USD' ? 'USD' : 'IDR';
      const message = typeof body.message === 'string' ? body.message.trim() : '';
      const sessionId =
        typeof body.sessionId === 'string' && /^[a-zA-Z0-9_-]{6,80}$/.test(body.sessionId)
          ? body.sessionId
          : `session-${Date.now()}`;

      if (message.length < 1 || message.length > 2000) {
        res.status(400).json({
          error:
            lang === 'id'
              ? 'Pesan harus antara 1 hingga 2000 karakter.'
              : 'Message must be between 1 and 2000 characters.',
        });
        return;
      }

      const envWebhookUrl = (process.env.N8N_WEBHOOK_URL || '').trim();
      const envAuthToken = (process.env.N8N_WEBHOOK_AUTH_TOKEN || '').trim();
      const hasServerWebhook =
        envWebhookUrl.length > 0 && validateWebhookUrlStructure(envWebhookUrl).valid;

      const clientWebhookUrl = typeof body.webhookUrl === 'string' ? body.webhookUrl.trim() : '';
      const targetUrl = hasServerWebhook ? envWebhookUrl : clientWebhookUrl;

      if (!targetUrl) {
        res.status(400).json({
          error:
            lang === 'id'
              ? 'URL Webhook n8n belum diatur. Buka pengaturan di pojok atas chatbox untuk memasukkan URL webhook HTTPS Anda.'
              : 'n8n Webhook URL is not configured yet. Open chatbox settings to enter your HTTPS webhook URL.',
        });
        return;
      }

      const urlCheck = validateWebhookUrlStructure(targetUrl);
      if (!urlCheck.valid) {
        res.status(400).json({
          error:
            lang === 'id'
              ? `URL Webhook tidak valid: ${urlCheck.reason}`
              : `Invalid Webhook URL: ${urlCheck.reason}`,
        });
        return;
      }

      let tripContext: N8nTripContext | null = null;
      if (body.tripContext && typeof body.tripContext === 'object') {
        const ctx = body.tripContext as Record<string, unknown>;
        if (typeof ctx.destination === 'string' && ctx.destination.trim()) {
          tripContext = {
            destination: ctx.destination.trim().slice(0, 120),
            days: Math.max(1, Math.min(14, Number(ctx.days) || 1)),
            travelers: Math.max(1, Math.min(50, Number(ctx.travelers) || 1)),
            style: typeof ctx.style === 'string' ? ctx.style.slice(0, 40) : 'standard',
            totalEstimateIdr: Math.max(0, Math.round(Number(ctx.totalEstimateIdr) || 0)),
            summary: typeof ctx.summary === 'string' ? ctx.summary.slice(0, 500) : '',
          };
        }
      }

      const reply = await forwardToN8nWebhook({
        targetUrl,
        authToken: hasServerWebhook ? envAuthToken : undefined,
        message,
        sessionId,
        language: lang,
        currency,
        tripContext,
      });

      res.json({ reply });
    } catch (error) {
      console.error('[api/n8n-chat] Error:', error);
      const lang: Language = req.body?.language === 'en' ? 'en' : 'id';
      const detail = error instanceof Error ? error.message : '';
      const isTimeout = detail.toLowerCase().includes('timeout') || detail.toLowerCase().includes('abort');
      const isValidation =
        detail.includes('public network') ||
        detail.includes('HTTPS') ||
        detail.includes('redirect') ||
        detail.includes('Private');

      const message = isTimeout
        ? lang === 'id'
          ? 'Permintaan ke webhook n8n melewati batas waktu (25 detik). Periksa workflow n8n Anda.'
          : 'Request to the n8n webhook timed out (25s). Please check your n8n workflow.'
        : isValidation
          ? detail
          : lang === 'id'
            ? 'Gagal menghubungi webhook n8n. Pastikan URL webhook aktif dan mengembalikan respons JSON/teks.'
            : 'Failed to reach the n8n webhook. Verify the webhook URL is active and returns a JSON or text response.';

      res.status(isValidation ? 400 : 502).json({ error: message });
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
