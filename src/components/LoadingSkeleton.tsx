import type { Translations } from '../i18n/translations';

interface LoadingSkeletonProps {
  t: Translations;
}

export function LoadingSkeleton({ t }: LoadingSkeletonProps) {
  return (
    <section aria-busy="true" aria-live="polite" className="space-y-6">
      {/* Status Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="font-display text-lg font-bold text-slate-900">{t.loading.title}</h2>
          <p className="text-sm text-slate-600">{t.loading.subtitle}</p>
        </div>

        {/* Summary Metric Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-4 border-t border-slate-100">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2.5 animate-pulse">
              <div className="h-3.5 w-28 rounded bg-slate-200" />
              <div className="h-8 w-44 rounded bg-slate-200" />
            </div>
          ))}
        </div>

        {/* Local Tips Skeleton */}
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 animate-pulse">
          <div className="h-4 w-36 rounded bg-slate-200" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3.5 w-full rounded bg-slate-100" />
                <div className="h-3.5 w-4/5 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 animate-pulse">
        <div className="flex gap-3 border-b border-slate-100 pb-4">
          <div className="h-9 w-36 rounded-lg bg-slate-200" />
          <div className="h-9 w-36 rounded-lg bg-slate-100" />
          <div className="h-9 w-36 rounded-lg bg-slate-100" />
        </div>
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex gap-4 py-2">
            <div className="h-5 w-14 rounded bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/5 rounded bg-slate-200" />
              <div className="h-3.5 w-4/5 rounded bg-slate-100" />
            </div>
            <div className="h-4 w-24 rounded bg-slate-100 shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}
