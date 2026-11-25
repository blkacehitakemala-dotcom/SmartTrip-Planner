import type { FormEvent } from 'react';
import { Clapperboard, Loader2 } from 'lucide-react';
import type {
  ContentGoal,
  PlatformAspect,
  StoryFormInput,
  ToneOption,
  VideoDuration,
  VisualStyle,
} from '../types/storyboard';
import type { StoryValidationErrors } from '../utils/storyboardUtils';
import { QUICK_IDEA_PRESETS } from '../data/sampleProject';

interface StoryFormPanelProps {
  value: StoryFormInput;
  errors: StoryValidationErrors;
  isLoading: boolean;
  onChange: (next: StoryFormInput) => void;
  onSubmit: (e: FormEvent) => void;
}

const CONTENT_GOALS: ContentGoal[] = [
  'Promosi / Jualan',
  'Edukasi',
  'Storytelling / Hiburan',
  'Kampanye Brand',
];

const PLATFORM_OPTIONS: { value: PlatformAspect; label: string; ratio: string }[] = [
  { value: '9:16', label: 'TikTok / Reels / Shorts', ratio: '9:16' },
  { value: '16:9', label: 'YouTube / Presentasi', ratio: '16:9' },
  { value: '1:1', label: 'Feed Instagram', ratio: '1:1' },
];

const DURATION_OPTIONS: VideoDuration[] = [15, 30, 60];

const VISUAL_STYLES: VisualStyle[] = [
  'Sinematik Realistis',
  'Animasi 3D (Gaya Pixar)',
  'Ilustrasi Manhwa / Anime',
  'Minimalis Modern',
  'Dokumenter / Vlog',
];

const TONE_OPTIONS: ToneOption[] = [
  'Santai & Relatable',
  'Profesional',
  'Lucu / Witty',
  'Emosional / Dramatis',
  'Persuasif',
];

export function StoryFormPanel({
  value,
  errors,
  isLoading,
  onChange,
  onSubmit,
}: StoryFormPanelProps) {
  const toggleTone = (tone: ToneOption) => {
    const exists = value.tones.includes(tone);
    const nextTones = exists
      ? value.tones.filter((item) => item !== tone)
      : [...value.tones, tone];
    onChange({ ...value, tones: nextTones });
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="no-print rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">
        <h1 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Brief Konten Video
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Masukkan ide topik untuk menyusun storyboard, prompt visual EN, naskah VO, dan caption AIDA.
        </p>
      </div>

      <div className="space-y-3.5">
        {/* Topik / Ide Video */}
        <div>
          <label
            htmlFor="topic-input"
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
          >
            Topik / Ide Video atau Nama Produk{' '}
            <span className="text-[#DB2777]" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="topic-input"
            rows={2}
            required
            value={value.topic}
            onChange={(e) => onChange({ ...value, topic: e.target.value })}
            placeholder='Contoh: "Iklan kopi lokal kekinian" atau "Cerita pendek animasi tentang nyamuk di tengah malam"'
            aria-invalid={Boolean(errors.topic)}
            aria-describedby={errors.topic ? 'topic-error' : undefined}
            className={`w-full rounded-xl border bg-slate-50/70 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/25 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950 ${
              errors.topic
                ? 'border-rose-400 focus:border-rose-500 dark:border-rose-500'
                : 'border-slate-200 focus:border-[#6D28D9] dark:border-slate-700 dark:focus:border-violet-500'
            }`}
          />
          {errors.topic && (
            <p
              id="topic-error"
              role="alert"
              className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400"
            >
              {errors.topic}
            </p>
          )}

          {/* Quick Idea Starters */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">Ide cepat:</span>
            {QUICK_IDEA_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    ...preset.input,
                  })
                }
                className="min-h-[28px] rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-[#6D28D9] dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-violet-500/60 dark:hover:text-violet-300 cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tujuan Konten & Gaya Visual */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div>
            <label
              htmlFor="goal-select"
              className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
            >
              Tujuan Konten
            </label>
            <select
              id="goal-select"
              value={value.goal}
              onChange={(e) => onChange({ ...value, goal: e.target.value as ContentGoal })}
              className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 transition-colors focus:border-[#6D28D9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/25 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-violet-500 dark:focus:bg-slate-950"
            >
              {CONTENT_GOALS.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="visual-style-select"
              className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
            >
              Gaya Visual
            </label>
            <select
              id="visual-style-select"
              value={value.visualStyle}
              onChange={(e) =>
                onChange({ ...value, visualStyle: e.target.value as VisualStyle })
              }
              className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 transition-colors focus:border-[#6D28D9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/25 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-violet-500 dark:focus:bg-slate-950"
            >
              {VISUAL_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Platform & Rasio Aspek */}
        <fieldset>
          <legend className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            Platform & Rasio Aspek
          </legend>
          <div className="grid grid-cols-1 gap-1.5">
            {PLATFORM_OPTIONS.map((opt) => {
              const active = value.platform === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange({ ...value, platform: opt.value })}
                  className={`flex min-h-[38px] items-center justify-between gap-2 rounded-xl border px-3.5 py-1.5 text-left text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] cursor-pointer ${
                    active
                      ? 'border-[#6D28D9] bg-violet-50/80 text-[#6D28D9] dark:border-violet-500 dark:bg-violet-950/50 dark:text-violet-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="font-medium truncate">{opt.label}</span>
                  <span
                    className={`font-mono text-xs font-semibold tabular-nums shrink-0 ${
                      active
                        ? 'text-[#DB2777] dark:text-pink-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {opt.ratio}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Durasi Video */}
        <fieldset>
          <legend className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            Durasi Video
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {DURATION_OPTIONS.map((dur) => {
              const active = value.duration === dur;
              return (
                <button
                  key={dur}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange({ ...value, duration: dur })}
                  className={`min-h-[38px] rounded-xl border px-2 py-1.5 text-center font-mono text-xs sm:text-sm font-semibold tabular-nums transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] whitespace-nowrap cursor-pointer ${
                    active
                      ? 'border-[#6D28D9] bg-[#6D28D9] text-white dark:border-violet-500 dark:bg-violet-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {dur} Detik
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Gaya Bahasa / Tone */}
        <fieldset>
          <legend className="flex items-baseline gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            <span>Gaya Bahasa / Tone</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              · Multi-pilih
            </span>
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {TONE_OPTIONS.map((tone) => {
              const active = value.tones.includes(tone);
              return (
                <button
                  key={tone}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleTone(tone)}
                  className={`min-h-[34px] rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB2777] whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-[#DB2777] bg-pink-50 text-[#BE185D] dark:border-pink-500 dark:bg-pink-950/50 dark:text-pink-300'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {tone}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Primary CTA */}
        <div className="pt-1.5">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#5B21B6] disabled:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 whitespace-nowrap cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
                <span>Menyusun Storyboard & Naskah...</span>
              </>
            ) : (
              <>
                <Clapperboard className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Generate Storyboard & Naskah</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
