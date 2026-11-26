import { Bookmark, Compass } from 'lucide-react';
import type { Currency, Language } from '../types/trip';
import type { Translations } from '../i18n/translations';

interface HeaderProps {
  language: Language;
  currency: Currency;
  savedCount: number;
  t: Translations;
  onLanguageChange: (lang: Language) => void;
  onCurrencyChange: (currency: Currency) => void;
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
    <header className="no-print sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-1.5 px-3 sm:gap-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <a
          href="#top"
          className="flex min-w-0 items-center gap-2 sm:gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] rounded-lg"
        >
          <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-[#0284C7] text-white shadow-xs">
            <Compass className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </span>
          <span className="truncate font-display text-sm sm:text-base font-bold tracking-tight text-slate-900">
            {t.appName}
          </span>
        </a>

        {/* Right controls: Saved Plans + Language & Currency Switchers */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={onOpenSaved}
            aria-label={`${t.savedPlansBtn} (${savedCount})`}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer"
          >
            <Bookmark className="h-4 w-4 text-[#0284C7] shrink-0" aria-hidden="true" />
            <span className="hidden md:inline">{t.savedPlansBtn}</span>
            <span className="font-mono text-xs tabular-nums text-slate-600">
              ({savedCount})
            </span>
          </button>

          {/* Language Switcher [ID | EN] */}
          <div
            role="group"
            aria-label="Language"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100/80 p-0.5"
          >
            {(['id', 'en'] as const).map((lang) => {
              const active = language === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onLanguageChange(lang)}
                  className={`min-h-[32px] rounded-lg px-2 sm:px-2.5 text-xs font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer ${
                    active
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Currency Switcher [IDR | USD] */}
          <div
            role="group"
            aria-label="Currency"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100/80 p-0.5"
          >
            {(['IDR', 'USD'] as const).map((curr) => {
              const active = currency === curr;
              return (
                <button
                  key={curr}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onCurrencyChange(curr)}
                  className={`min-h-[32px] rounded-lg px-2 sm:px-2.5 font-mono text-xs font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] cursor-pointer ${
                    active
                      ? 'bg-[#0D9488] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {curr}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
