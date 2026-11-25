import { useState } from 'react';
import { MapPin } from 'lucide-react';
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

  const visibleDays =
    selectedDay === 'all'
      ? itinerary
      : itinerary.filter((d) => d.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Day Filter Bar */}
      {itinerary.length > 1 && (
        <div
          role="group"
          aria-label="Filter hari itinerary"
          className="no-print flex items-center gap-1.5 overflow-x-auto pb-1"
        >
          <button
            type="button"
            onClick={() => setSelectedDay('all')}
            aria-pressed={selectedDay === 'all'}
            className={`min-h-[36px] rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] whitespace-nowrap shrink-0 cursor-pointer ${
              selectedDay === 'all'
                ? 'bg-[#0284C7] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
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
                onClick={() => setSelectedDay(day.day)}
                aria-pressed={active}
                className={`min-h-[36px] rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#0284C7] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                {t.itinerary.dayPrefix} {day.day}
              </button>
            );
          })}
        </div>
      )}

      {/* Day Sections */}
      <div className="divide-y divide-slate-200/80">
        {visibleDays.map((day) => (
          <article
            key={day.day}
            className="print-break-inside-avoid py-6 first:pt-1 last:pb-1"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-[#0284C7]">
                  {t.itinerary.dayPrefix} {day.day}
                  {day.theme ? ` · ${day.theme}` : ''}
                </p>
                <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
                  {day.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-mono tabular-nums">
                {day.activities.length} {t.itinerary.activitiesCount}
              </p>
            </div>

            <ol className="divide-y divide-slate-100">
              {day.activities.map((activity) => (
                <li
                  key={activity.id}
                  className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-12 sm:gap-4"
                >
                  {/* Time */}
                  <div className="sm:col-span-2">
                    <span className="font-mono text-sm font-semibold tabular-nums text-slate-800">
                      {activity.time}
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t.budget.categories[activity.category]}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="sm:col-span-7">
                    <h4 className="font-display text-sm sm:text-base font-semibold text-slate-900">
                      {activity.title}
                    </h4>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>{activity.location}</span>
                    </p>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>

                  {/* Estimated Cost */}
                  <div className="sm:col-span-3 sm:text-right">
                    <p className="font-mono text-sm font-semibold tabular-nums text-slate-900">
                      {activity.estimatedCostIdr > 0
                        ? formatCurrency(activity.estimatedCostIdr, currency)
                        : t.itinerary.freeEntry}
                    </p>
                    {activity.estimatedCostIdr > 0 && (
                      <p className="text-xs text-slate-500 mt-0.5">{t.itinerary.estimatedCost}</p>
                    )}
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
