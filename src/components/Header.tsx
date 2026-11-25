import { Bookmark } from 'lucide-react';
import type { Currency, Language } from '../types/trip';
import type { Translations } from '../i18n/translations';

interface HeaderProps {
  language: Language;
  currency: Currency;
  savedCount: number;
  t: Translations;
  onLanguageChange: (lang: Language) => void;
  onCurrencyChange: (curr: Currency) => void;
  onOpenSaved: () => void;
}

export function Header({
  language,
  currency,
  savedCount,
  t,
  onLanguageChange,
  onCurrencyChange,
  onOpenSaved,
}: HeaderProps) {
  return (
    <header className="no-print sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <a
          href="#top"
          className="flex items-center gap-2 text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] rounded-md min-w-0 shrink"
        >
          <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[#0284C7] text-white shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </span>
          <span className="font-display text-sm sm:text-lg font-bold tracking-tight whitespace-nowrap truncate">
            {t.appName}
          </span>
        </a>

        {/* Controls: Saved Plans + Language & Currency Switchers */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSaved}
            aria-label={`${t.savedPlansBtn} (${savedCount})`}
            className="inline-flex min-h-[38px] sm:min-h-[40px] items-center gap-1 sm:gap-1.5 rounded-lg border border-slate-200 bg-white px-2 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Bookmark className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0284C7] shrink-0" aria-hidden="true" />
            <span className="hidden md:inline">{t.savedPlansBtn}</span>
            <span className="font-mono text-[11px] sm:text-xs tabular-nums text-slate-500">({savedCount})</span>
          </button>

          {/* Language Switcher [ID | EN] */}
          <div
            role="group"
            aria-label="Language"
            className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 shrink-0"
          >
            {(['id', 'en'] as const).map((code) => {
              const active = language === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => onLanguageChange(code)}
                  aria-pressed={active}
                  className={`min-h-[34px] min-w-[28px] sm:min-w-[34px] rounded-md px-1.5 sm:px-2 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wide transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-[#0284C7] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Currency Switcher [IDR | USD] */}
          <div
            role="group"
            aria-label="Currency"
            className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 shrink-0"
          >
            {(['IDR', 'USD'] as const).map((code) => {
              const active = currency === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => onCurrencyChange(code)}
                  aria-pressed={active}
                  className={`min-h-[34px] min-w-[32px] sm:min-w-[38px] rounded-md px-1.5 sm:px-2 py-1 text-[11px] sm:text-xs font-semibold tracking-wide transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-[#0D9488] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {code}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
