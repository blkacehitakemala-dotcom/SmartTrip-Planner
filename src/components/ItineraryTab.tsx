import { useEffect, useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import type { Currency, ItineraryDay } from '../types/trip';
import type { Translations } from '../i18n/translations';
import { formatCurrency } from '../utils/tripMath';

interface ItineraryTabProps {
  itinerary: ItineraryDay[];
  currency: Currency;
  t: Translations;
}

export function ItineraryTab({ itinerary, currency, t }: ItineraryTabProps) {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');

  useEffect(() => {
    setSelectedDay('all');
  }, [itinerary]);

  const visibleDays =
    selectedDay === 'all'
      ? itinerary
      : itinerary.filter((d) => d.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Day Filter Bar */}
      {itinerary.length > 1 && (
        <div className="no-print flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={selectedDay === 'all'}
            onClick={() => setSelectedDay('all')}
            className={`min-h-[36px] rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
              selectedDay === 'all'
                ? 'border-[#0284C7] bg-[#0284C7] text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {t.itinerary.allDays}
          </button>
          {itinerary.map((day) => {
            const active = selectedDay === day.day;
            return (
              <button
                key={day.day}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedDay(day.day)}
                className={`min-h-[36px] rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                  active
                    ? 'border-[#0284C7] bg-sky-50 text-[#0284C7]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {t.itinerary.dayPrefix} {day.day}
              </button>
            );
          })}
        </div>
      )}

      {/* Days List */}
      <div className="space-y-7">
        {visibleDays.map((day) => (
          <article key={day.day} className="space-y-3.5">
            <header className="flex flex-col gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
                  {t.itinerary.dayPrefix} {day.day} · {day.theme}
                </p>
                <h3 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                  {day.title}
                </h3>
              </div>
              <span className="font-mono text-xs tabular-nums text-slate-500">
                {day.activities.length} {t.itinerary.activitiesCount}
              </span>
            </header>

            <ol className="space-y-3">
              {day.activities.map((activity) => (
                <li
                  key={activity.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold tabular-nums text-[#0284C7] shrink-0 pt-0.5 min-w-[60px]">
                      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{activity.time}</span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-display text-sm sm:text-[15px] font-bold text-slate-900">
                        {activity.title}
                      </h4>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0D9488]" aria-hidden="true" />
                        <span>{activity.location}</span>
                        <span aria-hidden="true">·</span>
                        <span>{t.budget.categories[activity.category]}</span>
                      </p>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 pl-[74px] sm:pl-4">
                    <p className="text-[11px] font-medium text-slate-500">
                      {t.itinerary.estimatedCost}
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-bold tabular-nums text-slate-900">
                      {activity.estimatedCostIdr > 0
                        ? formatCurrency(activity.estimatedCostIdr, currency)
                        : t.itinerary.freeEntry}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </div>
  );
}
