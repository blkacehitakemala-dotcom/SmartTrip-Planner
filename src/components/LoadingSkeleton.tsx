import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const LOADING_STEPS = [
  'Merancang hook pembuka & struktur alur cerita...',
  'Memecah adegan scene-by-scene lengkap dengan timecode & shot type...',
  'Menulis AI Visual Prompt deskriptif dalam Bahasa Inggris...',
  'Menyusun naskah voiceover & caption AIDA + SEO...',
];

export function LoadingSkeleton() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2400);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section aria-busy="true" aria-live="polite" className="space-y-5">
      {/* Informative Studio Status Banner */}
      <div className="rounded-2xl border border-violet-200 bg-white p-6 dark:border-violet-900/60 dark:bg-slate-900">
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-[#6D28D9] dark:bg-violet-950 dark:text-violet-300">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Gemini AI Sedang Memproduksi Storyboard Anda
            </h2>
            <p className="mt-1 text-sm text-[#6D28D9] dark:text-violet-300 font-medium">
              {LOADING_STEPS[stepIndex]}
            </p>
            <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                style={{ width: `${((stepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
                className="h-full rounded-full bg-gradient-to-r from-[#6D28D9] to-[#DB2777] transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Overview Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 animate-pulse dark:border-slate-800 dark:bg-slate-900">
        <div className="h-3.5 w-44 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-7 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-100 sm:grid-cols-2 dark:border-slate-800">
          <div className="space-y-2">
            <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800/70" />
          </div>
          <div className="space-y-2">
            <div className="h-3.5 w-32 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800/70" />
          </div>
        </div>
      </div>

      {/* Scene Cards Skeleton */}
      {[0, 1].map((idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 animate-pulse dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 rounded-md bg-violet-100 dark:bg-violet-950" />
            <div className="h-5 w-28 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-5 w-24 rounded bg-pink-100/70 dark:bg-pink-950/60" />
          </div>
          <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800/80" />
          <div className="h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-800/80" />
          <div className="h-16 w-full rounded-xl bg-violet-50/70 dark:bg-slate-800/60" />
        </div>
      ))}
    </section>
  );
}
