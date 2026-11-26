import { Loader2 } from 'lucide-react';
import type { Translations } from '../i18n/translations';

interface LoadingSkeletonProps {
  t: Translations;
}

export function LoadingSkeleton({ t }: LoadingSkeletonProps) {
  return (
    <section
      aria-live="polite"
      aria-busy="true"
      className="space-y-6"
    >
      <div className="flex items-center gap-3.5 rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
        <Loader2 className="h-5 w-5 animate-spin text-[#0284C7] shrink-0" aria-hidden="true" />
        <div>
          <h2 className="font-display text-sm sm:text-base font-bold text-slate-900">
            {t.loading.title}
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
            {t.loading.subtitle}
          </p>
        </div>
      </div>

      {/* Summary card placeholder */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-5">
        <div className="h-6 w-56 rounded-lg bg-slate-200/80 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2.5">
              <div className="h-3.5 w-28 rounded bg-slate-200/80 animate-pulse" />
              <div className="h-7 w-40 rounded bg-slate-200/80 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-100/80 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Itinerary placeholder */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4">
        <div className="flex gap-3 border-b border-slate-100 pb-4">
          <div className="h-9 w-32 rounded-lg bg-slate-200/80 animate-pulse" />
          <div className="h-9 w-32 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-9 w-36 rounded-lg bg-slate-100 animate-pulse" />
        </div>
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex gap-4 rounded-xl border border-slate-100 p-4">
            <div className="h-5 w-14 rounded bg-slate-200/80 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 rounded bg-slate-200/80 animate-pulse" />
              <div className="h-3.5 w-full max-w-lg rounded bg-slate-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
