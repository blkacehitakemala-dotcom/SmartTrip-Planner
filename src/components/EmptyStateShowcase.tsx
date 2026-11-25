import { useState } from 'react';
import { ArrowUpRight, Compass, Eye } from 'lucide-react';
import type { Language } from '../types/trip';
import type { Translations } from '../i18n/translations';
import { FEATURED_DESTINATIONS, type FeaturedDestination } from '../data/featuredDestinations';

interface EmptyStateShowcaseProps {
  language: Language;
  t: Translations;
  onSelectDestination: (dest: FeaturedDestination) => void;
  onPreviewSample: () => void;
}

function DestinationPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-teal-50 text-slate-500">
        <Compass className="h-8 w-8 text-[#0284C7]/60 mb-1.5" aria-hidden="true" />
        <span className="text-xs font-medium">{alt}</span>
      </div>
    );
  }

  return (
    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </div>
  );
}

export function EmptyStateShowcase({
  language,
  t,
  onSelectDestination,
  onPreviewSample,
}: EmptyStateShowcaseProps) {
  return (
    <section aria-labelledby="empty-state-heading" className="pt-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div className="max-w-2xl">
          <h2
            id="empty-state-heading"
            className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900"
          >
            {t.emptyState.heading}
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.emptyState.subheading}
          </p>
        </div>

        <button
          type="button"
          onClick={onPreviewSample}
          className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-150 hover:border-[#0D9488] hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Eye className="h-4 w-4 text-[#0D9488] shrink-0" aria-hidden="true" />
          <span>{t.emptyState.previewSampleBtn}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED_DESTINATIONS.map((dest) => (
          <button
            key={dest.name}
            type="button"
            onClick={() => onSelectDestination(dest)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-colors duration-150 hover:border-[#0284C7]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer"
          >
            <DestinationPhoto src={dest.imageUrl} alt={dest.name} />
            <div className="flex flex-1 flex-col p-4">
              <p className="text-xs text-slate-500">{dest.region[language]}</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                  {dest.name}
                </h3>
                <ArrowUpRight
                  className="h-4 w-4 text-slate-400 group-hover:text-[#0284C7] transition-colors shrink-0"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                {dest.highlight[language]}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
