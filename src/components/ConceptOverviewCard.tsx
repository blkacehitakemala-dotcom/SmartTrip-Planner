import { Music, Target, Zap } from 'lucide-react';
import type { StoryboardProject } from '../types/storyboard';
import { PLATFORM_LABELS } from '../utils/storyboardUtils';

interface ConceptOverviewCardProps {
  project: StoryboardProject;
}

export function ConceptOverviewCard({ project }: ConceptOverviewCardProps) {
  const platformInfo = PLATFORM_LABELS[project.input.platform];

  return (
    <section
      aria-labelledby="concept-title"
      className="print-flat rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Unboxed metadata line */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span>{project.input.goal}</span>
        <span aria-hidden="true">·</span>
        <span>
          {platformInfo.name} ({platformInfo.ratio})
        </span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums">{project.input.duration} Detik</span>
        <span aria-hidden="true">·</span>
        <span>{project.input.visualStyle}</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums">{project.scenes.length} Adegan</span>
      </div>

      <h2
        id="concept-title"
        className="mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
      >
        {project.overview.title}
      </h2>

      {project.isSample && (
        <p className="mt-1.5 text-xs font-medium text-[#DB2777] dark:text-pink-400">
          Contoh proyek interaktif — klik Generate Storyboard &amp; Naskah di panel kiri untuk membuat konsep baru dengan Gemini AI.
        </p>
      )}

      {/* Hook Pembuka Highlight */}
      <div className="mt-5 rounded-xl border border-violet-200/80 bg-violet-50/70 p-4 dark:border-violet-900/60 dark:bg-violet-950/35">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#6D28D9] dark:text-violet-300">
          <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Hook Pembuka (3 Detik Pertama)</span>
        </div>
        <p className="mt-1.5 font-display text-base font-semibold text-slate-900 dark:text-white leading-snug">
          &ldquo;{project.overview.hook_opening}&rdquo;
        </p>
      </div>

      {/* Target Audience & Music Mood */}
      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Target className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Target Audiens
            </p>
            <p className="mt-0.5 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {project.overview.target_audience}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-[#DB2777] dark:bg-pink-950/60 dark:text-pink-300">
            <Music className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Rekomendasi Musik &amp; Mood
            </p>
            <p className="mt-0.5 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {project.overview.music_mood_recommendation}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
