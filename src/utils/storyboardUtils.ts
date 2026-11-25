import type {
  AidaCaption,
  PlatformAspect,
  StoryFormInput,
  StoryScene,
  StoryboardProject,
  VideoDuration,
} from '../types/storyboard';

export const PLATFORM_LABELS: Record<PlatformAspect, { name: string; ratio: string }> = {
  '9:16': { name: 'TikTok / Reels / Shorts', ratio: '9:16' },
  '16:9': { name: 'YouTube / Presentasi', ratio: '16:9' },
  '1:1': { name: 'Feed Instagram', ratio: '1:1' },
};

export interface StoryValidationErrors {
  topic?: string;
}

export function validateStoryInput(input: StoryFormInput): StoryValidationErrors {
  const errors: StoryValidationErrors = {};
  const trimmed = (input.topic ?? '').trim();

  if (trimmed.length < 3) {
    errors.topic =
      'Topik atau ide video wajib diisi (minimal 3 karakter) agar AI dapat menyusun storyboard.';
  } else if (trimmed.length > 300) {
    errors.topic = 'Topik terlalu panjang (maksimal 300 karakter).';
  }

  return errors;
}

export function getExpectedSceneRange(duration: VideoDuration): { min: number; max: number } {
  if (duration === 15) return { min: 4, max: 5 };
  if (duration === 30) return { min: 5, max: 6 };
  return { min: 7, max: 8 };
}

export function combineVoiceoverScript(
  scenes: StoryScene[],
  includeTimecodes = false
): string {
  return scenes
    .map((scene) => {
      const line = (scene.voiceover_dialogue ?? '').trim();
      if (!line) return '';
      if (includeTimecodes) {
        return `[Scene ${scene.scene_number} · ${scene.timecode}]\n${line}`;
      }
      return line;
    })
    .filter(Boolean)
    .join('\n\n');
}

export interface ReadingMetrics {
  wordCount: number;
  estimatedSeconds: number;
  wordsPerMinute: number;
  paceStatus: 'ideal' | 'slightly_fast' | 'too_dense' | 'spacious';
  paceLabel: string;
}

/**
 * Indonesian voiceover reading speed averages ~130 words per minute (~2.17 words/sec)
 * for engaging short-form videos.
 */
export function estimateReadingMetrics(
  scenes: StoryScene[],
  targetDurationSeconds: number
): ReadingMetrics {
  const combined = combineVoiceoverScript(scenes, false);
  const words = combined
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean);
  const wordCount = words.length;
  const wordsPerMinute = 130;
  const estimatedSeconds =
    wordCount === 0 ? 0 : Math.max(1, Math.round((wordCount / wordsPerMinute) * 60));

  const safeTarget = Math.max(1, targetDurationSeconds || 30);
  const ratio = estimatedSeconds / safeTarget;

  let paceStatus: ReadingMetrics['paceStatus'] = 'ideal';
  let paceLabel = 'Pas & Natural (~130 kata/menit)';

  if (ratio > 1.2) {
    paceStatus = 'too_dense';
    paceLabel = 'Cukup Padat — baca dengan tempo cepat';
  } else if (ratio > 1.05) {
    paceStatus = 'slightly_fast';
    paceLabel = 'Sedikit Cepat — artikulasi tegas';
  } else if (ratio < 0.65 && wordCount > 0) {
    paceStatus = 'spacious';
    paceLabel = 'Santai — banyak ruang jeda visual';
  }

  return {
    wordCount,
    estimatedSeconds,
    wordsPerMinute,
    paceStatus,
    paceLabel,
  };
}

export function normalizeHashtag(tag: string): string {
  const cleaned = String(tag || '')
    .trim()
    .replace(/^#+/, '')
    .replace(/\s+/g, '');
  return cleaned ? `#${cleaned}` : '';
}

export function buildFullCaptionText(aida: AidaCaption, hashtags: string[]): string {
  const parts = [
    aida.attention?.trim(),
    aida.interest?.trim(),
    aida.desire?.trim(),
    aida.action?.trim(),
  ].filter(Boolean);

  const normalizedTags = hashtags
    .map(normalizeHashtag)
    .filter(Boolean);

  if (normalizedTags.length > 0) {
    parts.push(normalizedTags.join(' '));
  }

  return parts.join('\n\n');
}

function escapeCsvCell(value: string | number): string {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateStoryboardCsv(project: StoryboardProject): string {
  const headers = [
    'Scene',
    'Timecode',
    'Shot Type',
    'Visual ID',
    'AI Prompt EN',
    'Voiceover',
    'Audio/SFX',
  ];

  const rows: (string | number)[][] = [headers];

  for (const scene of project.scenes) {
    rows.push([
      scene.scene_number,
      scene.timecode,
      scene.shot_type,
      scene.visual_description_id,
      scene.ai_visual_prompt_en,
      scene.voiceover_dialogue,
      scene.audio_sfx,
    ]);
  }

  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n');
}
