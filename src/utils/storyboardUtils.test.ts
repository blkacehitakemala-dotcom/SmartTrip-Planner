import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFullCaptionText,
  combineVoiceoverScript,
  estimateReadingMetrics,
  generateStoryboardCsv,
  getExpectedSceneRange,
  normalizeHashtag,
  validateStoryInput,
} from './storyboardUtils';
import type { StoryFormInput, StoryScene, StoryboardProject } from '../types/storyboard';

const BASE_INPUT: StoryFormInput = {
  topic: 'Iklan kopi lokal kekinian',
  goal: 'Promosi / Jualan',
  platform: '9:16',
  duration: 30,
  visualStyle: 'Sinematik Realistis',
  tones: ['Santai & Relatable'],
};

const SAMPLE_SCENES: StoryScene[] = [
  {
    scene_number: 1,
    timecode: '00:00 - 00:05',
    shot_type: 'Extreme Close-Up',
    visual_description_id: 'Espresso kental dituang pelan di atas es batu bening, embun menempel di gelas.',
    ai_visual_prompt_en: 'Extreme close-up of dark espresso pouring over crystal ice cubes, warm morning sunlight, 8k cinematic, --ar 9:16',
    voiceover_dialogue: 'Jam dua siang mulai ngantuk, tapi kerjaan masih numpuk?',
    audio_sfx: 'Suara es batu berdenting & tuangan kopi segar',
  },
  {
    scene_number: 2,
    timecode: '00:05 - 00:12',
    shot_type: 'Medium Shot',
    visual_description_id: 'Karyawan tersenyum segar setelah menyeruput "Kopi Senja" di meja kerja minimalis.',
    ai_visual_prompt_en: 'Medium shot of smiling young Indonesian creative sipping iced latte at a sunny desk, shallow depth of field, --ar 9:16',
    voiceover_dialogue: 'Saatnya isi ulang fokusmu dengan racikan biji Arabika Gayo pilihan yang lembut di lambung.',
    audio_sfx: 'Transisi whoosh lembut + beat lo-fi ceria mulai masuk',
  },
];

test('validateStoryInput rejects blank or too-short topics and accepts valid topics', () => {
  const emptyErr = validateStoryInput({ ...BASE_INPUT, topic: '   ' });
  assert.ok(emptyErr.topic);

  const shortErr = validateStoryInput({ ...BASE_INPUT, topic: 'ab' });
  assert.ok(shortErr.topic);

  const valid = validateStoryInput(BASE_INPUT);
  assert.deepEqual(valid, {});
});

test('getExpectedSceneRange maps 15s, 30s, and 60s durations within 4-8 scenes', () => {
  assert.deepEqual(getExpectedSceneRange(15), { min: 4, max: 5 });
  assert.deepEqual(getExpectedSceneRange(30), { min: 5, max: 6 });
  assert.deepEqual(getExpectedSceneRange(60), { min: 7, max: 8 });
});

test('combineVoiceoverScript merges dialogue cleanly with optional timecode markers', () => {
  const plain = combineVoiceoverScript(SAMPLE_SCENES, false);
  assert.ok(plain.includes('Jam dua siang mulai ngantuk'));
  assert.ok(plain.includes('Saatnya isi ulang fokusmu'));
  assert.equal(plain.includes('[Scene 1'), false);

  const withTime = combineVoiceoverScript(SAMPLE_SCENES, true);
  assert.ok(withTime.includes('[Scene 1 · 00:00 - 00:05]'));
  assert.ok(withTime.includes('[Scene 2 · 00:05 - 00:12]'));
});

test('estimateReadingMetrics calculates word count and realistic duration', () => {
  const metrics = estimateReadingMetrics(SAMPLE_SCENES, 15);
  assert.equal(metrics.wordCount, 23);
  assert.equal(metrics.wordsPerMinute, 130);
  assert.equal(metrics.estimatedSeconds, 11);
  assert.equal(metrics.paceStatus, 'ideal');
});

test('normalizeHashtag and buildFullCaptionText format AIDA copy with clean hashtags', () => {
  assert.equal(normalizeHashtag('kopi lokal'), '#kopilokal');
  assert.equal(normalizeHashtag('##KopiSenja'), '#KopiSenja');

  const full = buildFullCaptionText(
    {
      attention: 'Ngantuk jam 2 siang?',
      interest: 'Kopi Senja diracik dari 100% Arabika Gayo.',
      desire: 'Creamy, segar, dan ramah di lambung.',
      action: 'Pesan sekarang lewat link di bio!',
    },
    ['KopiLokal', '#KopiKekinian']
  );

  assert.ok(full.includes('Ngantuk jam 2 siang?'));
  assert.ok(full.includes('Pesan sekarang lewat link di bio!'));
  assert.ok(full.includes('#KopiLokal #KopiKekinian'));
});

test('generateStoryboardCsv outputs exact Excel-ready columns and escapes quotes/commas', () => {
  const project: StoryboardProject = {
    id: 'p1',
    input: BASE_INPUT,
    overview: {
      title: 'Kopi Senja',
      hook_opening: 'Jam 2 siang ngantuk?',
      target_audience: 'Pekerja kreatif usia 20-35',
      music_mood_recommendation: 'Lo-fi upbeat',
    },
    scenes: SAMPLE_SCENES,
    social_copy: {
      aida_caption: { attention: 'A', interest: 'I', desire: 'D', action: 'Act' },
      seo_keywords: ['kopi'],
      hashtags: ['#kopi'],
    },
    createdAt: '2026-11-24T00:00:00.000Z',
  };

  const csv = generateStoryboardCsv(project);
  const lines = csv.split('\n');
  assert.equal(lines[0], 'Scene,Timecode,Shot Type,Visual ID,AI Prompt EN,Voiceover,Audio/SFX');
  assert.equal(lines.length, 3);
  assert.ok(csv.includes('""Kopi Senja""'));
  assert.ok(csv.includes('"Espresso kental dituang pelan di atas es batu bening, embun menempel di gelas."'));
});
