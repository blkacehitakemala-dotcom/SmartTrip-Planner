import { Lightbulb } from 'lucide-react';
import type { Currency, TripPlan } from '../types/trip';
import type { Translations } from '../i18n/translations';
import { calculateBudgetSummary, formatCurrency } from '../utils/tripMath';

interface TripSummaryCardProps {
  plan: TripPlan;
  currency: Currency;
  t: Translations;
}

export function TripSummaryCard({ plan, currency, t }: TripSummaryCardProps) {
  const summary = calculateBudgetSummary(plan.budgetItems, plan.travelers, plan.days);
  const styleLabel = t.styles[plan.style]?.label ?? plan.style;

  return (
    <section className="print-flat rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.08)]">
      {/* Header & Metadata Line */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[#0D9488]">
            {plan.days} {t.summary.daysLabel} · {plan.travelers} {t.summary.travelersLabel} · {styleLabel}
            {currency === 'USD' ? ` · ${t.summary.exchangeRateNote}` : ''}
          </p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {plan.destination}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            {plan.summary}
          </p>
        </div>
      </div>

      {plan.isSample && (
        <p className="no-print mt-3 text-xs font-medium text-sky-700 bg-sky-50/70 border border-sky-100 rounded-xl px-3.5 py-2">
          {t.summary.sampleNotice}
        </p>
      )}

      {/* KPI Metrics Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4">
          <p className="text-xs font-semibold text-slate-600">{t.summary.totalEstimate}</p>
          <p
            data-testid="summary-total-cost"
            className="mt-1.5 font-mono text-2xl sm:text-[26px] font-bold tracking-tight tabular-nums text-[#0284C7]"
          >
            {formatCurrency(summary.totalIdr, currency)}
          </p>
        </div>

        <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4">
          <p className="text-xs font-semibold text-slate-600">{t.summary.perPerson}</p>
          <p
            data-testid="summary-per-person-cost"
            className="mt-1.5 font-mono text-2xl sm:text-[26px] font-bold tracking-tight tabular-nums text-[#0D9488]"
          >
            {formatCurrency(summary.perPersonIdr, currency)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
          <p className="text-xs font-semibold text-slate-600">{t.summary.perDay}</p>
          <p className="mt-1.5 font-mono text-2xl sm:text-[26px] font-bold tracking-tight tabular-nums text-slate-900">
            {formatCurrency(summary.perDayIdr, currency)}
          </p>
        </div>
      </div>

      {/* 3 Essential Local Tips */}
      {plan.localTips.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-[#0D9488]" aria-hidden="true" />
            <h3 className="font-display text-sm font-bold text-slate-900">
              {t.summary.localTipsTitle}
            </h3>
          </div>
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {plan.localTips.slice(0, 3).map((tip, index) => (
              <li
                key={index}
                className="flex gap-3 rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5"
              >
                <span className="font-mono text-xs font-bold tabular-nums text-[#0284C7] shrink-0 pt-0.5">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-xs leading-relaxed text-slate-700">{tip}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
