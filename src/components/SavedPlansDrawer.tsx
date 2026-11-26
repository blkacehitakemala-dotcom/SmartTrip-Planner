import { useEffect } from 'react';
import { Bookmark, Trash2, X } from 'lucide-react';
import type { Currency, Language, SavedTrip } from '../types/trip';
import type { Translations } from '../i18n/translations';
import { calculateBudgetSummary, formatCurrency } from '../utils/tripMath';

interface SavedPlansDrawerProps {
  isOpen: boolean;
  savedTrips: SavedTrip[];
  currency: Currency;
  language: Language;
  t: Translations;
  onClose: () => void;
  onLoadTrip: (trip: SavedTrip) => void;
  onDeleteTrip: (tripId: string) => void;
}

export function SavedPlansDrawer({
  isOpen,
  savedTrips,
  currency,
  language,
  t,
  onClose,
  onLoadTrip,
  onDeleteTrip,
}: SavedPlansDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatSavedDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(iso));
    } catch {
      return '';
    }
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-drawer-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t.drawer.closeAria}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-[2px] cursor-default"
      />

      {/* Slide-over Panel */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h2
              id="saved-drawer-title"
              className="font-display text-lg font-bold text-slate-900"
            >
              {t.drawer.title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">{t.drawer.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.drawer.closeAria}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {savedTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
              <Bookmark className="h-8 w-8 text-slate-300" aria-hidden="true" />
              <p className="mt-3 font-display text-sm font-bold text-slate-800">
                {t.drawer.emptyTitle}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {t.drawer.emptySubtitle}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {savedTrips.map((trip) => {
                const summary = calculateBudgetSummary(
                  trip.budgetItems,
                  trip.travelers,
                  trip.days
                );
                const styleLabel = t.styles[trip.style]?.label ?? trip.style;
                return (
                  <li
                    key={trip.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition-colors hover:border-slate-300"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-base font-bold text-slate-900">
                          {trip.destination}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {trip.days} {t.summary.daysLabel} · {trip.travelers}{' '}
                          {t.summary.travelersLabel} · {styleLabel}
                        </p>
                      </div>
                      <p className="font-mono text-sm font-bold tabular-nums text-[#0284C7] shrink-0">
                        {formatCurrency(summary.totalIdr, currency)}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-[11px] text-slate-400">
                        {t.drawer.savedOn} {formatSavedDate(trip.savedAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onLoadTrip(trip);
                            onClose();
                          }}
                          aria-label={`${t.drawer.loadBtn} ${trip.destination}`}
                          className="inline-flex min-h-[34px] items-center rounded-lg bg-[#0284C7] px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#0369A1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer"
                        >
                          {t.drawer.loadBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTrip(trip.id)}
                          aria-label={`${t.drawer.deleteBtn} ${trip.destination}`}
                          className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t.drawer.deleteBtn}</span>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
