import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import type {
  StoryFormInput,
  StoryScene,
  StoryboardProject,
} from '../src/types/storyboard.ts';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const STORYBOARD_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overview: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Catchy video concept title in Bahasa Indonesia.' },
        hook_opening: { type: Type.STRING, description: 'Scroll-stopping opening hook (first 3 seconds) in Bahasa Indonesia.' },
        target_audience: { type: Type.STRING, description: 'Specific target audience profile in Bahasa Indonesia.' },
        music_mood_recommendation: { type: Type.STRING, description: 'Background music genre, tempo/BPM, and mood recommendation in Bahasa Indonesia.' },
      },
      required: ['title', 'hook_opening', 'target_audience', 'music_mood_recommendation'],
    },
    scenes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          scene_number: { type: Type.INTEGER },
          timecode: { type: Type.STRING, description: 'Time range format e.g. 00:00 - 00:05' },
          shot_type: { type: Type.STRING, description: 'Camera framing e.g. Close-Up, Wide Shot, POV, Medium Shot, Tracking Shot' },
          visual_description_id: {
            type: Type.STRING,
            description: 'Clear, vivid description of what happens visually on screen in natural Bahasa Indonesia.',
          },
          ai_visual_prompt_en: {
            type: Type.STRING,
            description: 'Detailed, production-ready AI image/video generation prompt strictly in English, specifying subject, action, lighting, camera angle/lens, visual style, and exact aspect ratio.',
          },
          voiceover_dialogue: {
            type: Type.STRING,
            description: 'Natural, spoken Indonesian voiceover or dialogue for this scene.',
          },
          audio_sfx: {
            type: Type.STRING,
            description: 'Sound effects or audio transition suggestion in Bahasa Indonesia.',
          },
        },
        required: [
          'scene_number',
          'timecode',
          'shot_type',
          'visual_description_id',
          'ai_visual_prompt_en',
          'voiceover_dialogue',
          'audio_sfx',
        ],
      },
    },
    social_copy: {
      type: Type.OBJECT,
      properties: {
        aida_caption: {
          type: Type.OBJECT,
          properties: {
            attention: { type: Type.STRING, description: 'Attention stage copy in Bahasa Indonesia.' },
            interest: { type: Type.STRING, description: 'Interest stage copy in Bahasa Indonesia.' },
            desire: { type: Type.STRING, description: 'Desire stage copy in Bahasa Indonesia.' },
            action: { type: Type.STRING, description: 'Clear Call-To-Action in Bahasa Indonesia.' },
          },
          required: ['attention', 'interest', 'desire', 'action'],
        },
        seo_keywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Exactly 5 relevant Indonesian SEO keywords/search phrases.',
        },
        hashtags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '8 to 10 relevant ready-to-use hashtags starting with #.',
        },
      },
      required: ['aida_caption', 'seo_keywords', 'hashtags'],
    },
  },
  required: ['overview', 'scenes', 'social_copy'],
};

const VISUAL_STYLE_EN_MAP: Record<StoryFormInput['visualStyle'], string> = {
  'Sinematik Realistis': 'cinematic photorealistic commercial film style, dramatic natural lighting, 35mm film grain',
  'Animasi 3D (Gaya Pixar)': 'Pixar-style 3D animation, expressive character rendering, soft subsurface scattering, vibrant cinematic lighting',
  'Ilustrasi Manhwa / Anime': 'high-detail Korean manhwa and modern anime illustration style, dynamic linework, cel-shaded cinematic lighting',
  'Minimalis Modern': 'clean modern minimalist editorial aesthetic, soft diffused studio lighting, crisp negative space, geometric balance',
  'Dokumenter / Vlog': 'authentic handheld documentary vlog style, natural daylight, candid 24mm lens look, realistic texture',
};

const PLATFORM_NAME_MAP: Record<StoryFormInput['platform'], string> = {
  '9:16': 'TikTok / Reels / Shorts (vertical 9:16)',
  '16:9': 'YouTube / Presentasi (widescreen 16:9)',
  '1:1': 'Feed Instagram (square 1:1)',
};

function getSceneTargetCount(duration: StoryFormInput['duration']): string {
  if (duration === 15) return '4';
  if (duration === 30) return '5 atau 6';
  return '7 atau 8';
}

async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : '';
      const nonRetryable =
        msg.includes('API_KEY_INVALID') ||
        msg.includes('PERMISSION_DENIED') ||
        msg.includes('NOT_FOUND') ||
        msg.includes('not configured');
      if (nonRetryable || attempt === maxAttempts) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
    }
  }
  throw lastError;
}

export async function generateStoryboardWithGemini(
  input: StoryFormInput
): Promise<StoryboardProject> {
  const ai = getAiClient();
  const targetScenes = getSceneTargetCount(input.duration);
  const tonesText =
    input.tones.length > 0 ? input.tones.join(', ') : 'Santai & Relatable';
  const visualStyleEn = VISUAL_STYLE_EN_MAP[input.visualStyle];
  const platformName = PLATFORM_NAME_MAP[input.platform];

  const systemInstruction = `Kamu adalah Creative Director, Scriptwriter, dan Digital Strategist profesional untuk kreator konten Indonesia.
Tugasmu adalah mengubah satu ide topik menjadi paket produksi video pendek lengkap dalam JSON ketat sesuai schema.

ATURAN BAHASA & KUALITAS WAJIB:
1. SEMUA kolom teks (overview, visual_description_id, voiceover_dialogue, audio_sfx, aida_caption, seo_keywords, hashtags) WAJIB menggunakan Bahasa Indonesia yang natural, segar, tajam, dan enak diucapkan (bukan bahasa terjemahan kaku).
2. KHUSUS kolom "ai_visual_prompt_en" pada setiap adegan WAJIB ditulis 100% dalam Bahasa Inggris yang sangat deskriptif untuk AI image/video generator (Midjourney / Runway / Kling / Veo), mencakup: subjek, aksi, komposisi kamera, pencahayaan, gaya visual (${visualStyleEn}), detail kualitas, dan diakhiri rasio aspek "${input.platform} aspect ratio --ar ${input.platform}".
3. Buat tepat ${targetScenes} adegan (dalam rentang 4–8 adegan) dengan timecode berurutan dari 00:00 hingga tepat 00:${String(input.duration).padStart(2, '0')} tanpa tumpang tindih.
4. Sesuaikan panjang voiceover_dialogue agar realistis dibaca dalam total durasi ${input.duration} detik (~130 kata/menit).
5. Berikan tepat 5 kata kunci SEO di "seo_keywords" dan 8 sampai 10 hashtag siap pakai berawalan "#" di "hashtags".`;

  const prompt = `Buatkan Storyboard, Naskah Voiceover, AI Visual Prompt, dan Caption AIDA untuk:
- Topik / Ide Video / Produk: ${input.topic}
- Tujuan Konten: ${input.goal}
- Platform & Rasio Aspek: ${platformName}
- Durasi Video: ${input.duration} Detik
- Gaya Visual: ${input.visualStyle}
- Gaya Bahasa / Tone: ${tonesText}`;

  const rawText = await withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: STORYBOARD_SCHEMA,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });
    const text = response.text?.trim();
    if (!text) {
      throw new Error('Respons kosong diterima dari Gemini API.');
    }
    return text;
  });

  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  if (!parsed?.overview || !Array.isArray(parsed?.scenes) || parsed.scenes.length === 0 || !parsed?.social_copy) {
    throw new Error('Format JSON dari Gemini tidak lengkap.');
  }

  const scenes: StoryScene[] = parsed.scenes.map(
    (scene: Record<string, unknown>, idx: number) => ({
      scene_number:
        typeof scene.scene_number === 'number' && scene.scene_number > 0
          ? Math.round(scene.scene_number)
          : idx + 1,
      timecode: String(scene.timecode || `00:0${idx * 5} - 00:0${(idx + 1) * 5}`),
      shot_type: String(scene.shot_type || 'Medium Shot'),
      visual_description_id: String(scene.visual_description_id || ''),
      ai_visual_prompt_en: String(scene.ai_visual_prompt_en || ''),
      voiceover_dialogue: String(scene.voiceover_dialogue || ''),
      audio_sfx: String(scene.audio_sfx || ''),
    })
  );

  const seoKeywords: string[] = Array.isArray(parsed.social_copy.seo_keywords)
    ? parsed.social_copy.seo_keywords.slice(0, 5).map((k: unknown) => String(k).trim()).filter(Boolean)
    : [];

  const hashtags: string[] = Array.isArray(parsed.social_copy.hashtags)
    ? parsed.social_copy.hashtags
        .slice(0, 10)
        .map((tag: unknown) => {
          const clean = String(tag).trim().replace(/^#+/, '').replace(/\s+/g, '');
          return clean ? `#${clean}` : '';
        })
        .filter(Boolean)
    : [];

  return {
    id: `story-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    input,
    overview: {
      title: String(parsed.overview.title || input.topic),
      hook_opening: String(parsed.overview.hook_opening || ''),
      target_audience: String(parsed.overview.target_audience || ''),
      music_mood_recommendation: String(parsed.overview.music_mood_recommendation || ''),
    },
    scenes,
    social_copy: {
      aida_caption: {
        attention: String(parsed.social_copy.aida_caption?.attention || ''),
        interest: String(parsed.social_copy.aida_caption?.interest || ''),
        desire: String(parsed.social_copy.aida_caption?.desire || ''),
        action: String(parsed.social_copy.aida_caption?.action || ''),
      },
      seo_keywords: seoKeywords,
      hashtags,
    },
    createdAt: new Date().toISOString(),
  };
}
