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
      if (e.key === 'Escape') onClose();
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
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-[1px] transition-opacity cursor-default"
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white border-l border-slate-200 shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {savedTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-3">
                <Bookmark className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="font-display text-sm font-semibold text-slate-900">
                {t.drawer.emptyTitle}
              </p>
              <p className="mt-1 max-w-xs text-xs text-slate-500 leading-relaxed">
                {t.drawer.emptySubtitle}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200/80">
              {savedTrips.map((trip) => {
                const summary = calculateBudgetSummary(
                  trip.budgetItems,
                  trip.travelers,
                  trip.days
                );
                return (
                  <li key={trip.id} className="py-4 first:pt-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-display text-base font-bold text-slate-900 truncate">
                          {trip.destination}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {trip.days} {t.summary.daysLabel} · {trip.travelers}{' '}
                          {t.summary.travelersLabel} · {t.styles[trip.style].label}
                        </p>
                        <p className="mt-1.5 font-mono text-sm font-semibold tabular-nums text-[#0284C7]">
                          {formatCurrency(summary.totalIdr, currency)}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {t.drawer.savedOn} {formatSavedDate(trip.savedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onLoadTrip(trip);
                          onClose();
                        }}
                        aria-label={`${t.drawer.loadBtn} ${trip.destination}`}
                        className="inline-flex min-h-[36px] flex-1 items-center justify-center rounded-lg bg-[#0284C7] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#0369A1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer"
                      >
                        {t.drawer.loadBtn}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTrip(trip.id)}
                        aria-label={`${t.drawer.deleteBtn} ${trip.destination}`}
                        className="inline-flex min-h-[36px] items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t.drawer.deleteBtn}</span>
                      </button>
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
