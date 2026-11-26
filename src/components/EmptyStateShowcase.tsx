import { useState } from 'react';
import { ArrowRight, Compass, MapPin } from 'lucide-react';
import type { Language } from '../types/trip';
import type { Translations } from '../i18n/translations';
import {
  FEATURED_DESTINATIONS,
  type FeaturedDestination,
} from '../data/featuredDestinations';

interface EmptyStateShowcaseProps {
  language: Language;
  t: Translations;
  onSelectDestination: (dest: FeaturedDestination) => void;
  onPreviewSample: () => void;
}

export function EmptyStateShowcase({
  language,
  t,
  onSelectDestination,
  onPreviewSample,
}: EmptyStateShowcaseProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <section aria-label={t.emptyState.heading} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {t.emptyState.heading}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-600 leading-relaxed">
            {t.emptyState.subheading}
          </p>
        </div>
        <button
          type="button"
          onClick={onPreviewSample}
          className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-2 rounded-xl border border-[#0D9488]/30 bg-teal-50/70 px-4 py-2 text-xs sm:text-sm font-semibold text-[#0D9488] transition-colors hover:bg-teal-50 hover:border-[#0D9488]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] cursor-pointer"
        >
          <Compass className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t.emptyState.previewSampleBtn}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED_DESTINATIONS.map((dest) => {
          const imgFailed = failedImages[dest.name];
          return (
            <button
              key={dest.name}
              type="button"
              onClick={() => onSelectDestination(dest)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-left shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0284C7]/50 hover:shadow-[0_12px_24px_-12px_rgba(15,23,42,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                {!imgFailed ? (
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [dest.name]: true }))
                    }
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 to-teal-100 text-[#0284C7]">
                    <MapPin className="h-8 w-8 opacity-60" aria-hidden="true" />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0D9488]">
                  {dest.region[language]}
                </p>
                <h3 className="mt-1 font-display text-base font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                  {dest.name}
                </h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-600">
                  {dest.highlight[language]}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-[#0284C7]">
                  <span>{t.emptyState.useDestination}</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
