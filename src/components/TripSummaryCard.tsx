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

  return (
    <section
      aria-labelledby="trip-summary-title"
      className="print-flat rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.08)]"
    >
      {/* Top Row: Destination Title + Unboxed Metadata */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-500">
          <span>
            {plan.days} {t.summary.daysLabel}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {plan.travelers} {t.summary.travelersLabel}
          </span>
          <span aria-hidden="true">·</span>
          <span>{t.styles[plan.style].label}</span>
          {currency === 'USD' && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-xs text-slate-500">{t.summary.exchangeRateNote}</span>
            </>
          )}
        </div>

        <h2
          id="trip-summary-title"
          className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
        >
          {plan.destination}
        </h2>

        {plan.summary && (
          <p className="max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed">
            {plan.summary}
          </p>
        )}

        {plan.isSample && (
          <p className="mt-1 text-xs font-medium text-[#0F766E]">
            {t.summary.sampleNotice}
          </p>
        )}
      </div>

      {/* Cost KPI Strip */}
      <div className="mt-6 grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{t.summary.totalEstimate}</p>
          <p
            data-testid="summary-total-cost"
            className="mt-1 font-mono text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-[#0284C7]"
          >
            {formatCurrency(summary.totalIdr, currency)}
          </p>
        </div>

        <div className="sm:border-l sm:border-slate-100 sm:pl-6">
          <p className="text-xs font-medium text-slate-500">{t.summary.perPerson}</p>
          <p
            data-testid="summary-per-person-cost"
            className="mt-1 font-mono text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-[#0D9488]"
          >
            {formatCurrency(summary.perPersonIdr, currency)}
          </p>
        </div>

        <div className="sm:border-l sm:border-slate-100 sm:pl-6">
          <p className="text-xs font-medium text-slate-500">{t.summary.perDay}</p>
          <p className="mt-1 font-mono text-xl sm:text-2xl font-semibold tracking-tight tabular-nums text-slate-800">
            {formatCurrency(summary.perDayIdr, currency)}
          </p>
        </div>
      </div>

      {/* 3 Essential Local Tips */}
      {plan.localTips.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="font-display text-sm font-bold text-slate-900 mb-3.5">
            {t.summary.localTipsTitle}
          </h3>
          <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {plan.localTips.slice(0, 3).map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sky-50 font-mono text-xs font-semibold tabular-nums text-[#0284C7]">
                  0{index + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
