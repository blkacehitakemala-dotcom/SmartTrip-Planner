import { Bookmark, Moon, Sun } from 'lucide-react';
import type { ThemeMode } from '../types/storyboard';

interface HeaderProps {
  savedCount: number;
  theme: ThemeMode;
  onThemeChange: (next: ThemeMode) => void;
  onOpenSaved: () => void;
}

export function Header({
  savedCount,
  theme,
  onThemeChange,
  onOpenSaved,
}: HeaderProps) {
  return (
    <header className="no-print sticky top-0 z-30 h-16 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <a
          href="#top"
          className="flex items-center gap-2.5 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] rounded-md min-w-0 shrink"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6D28D9] text-white shrink-0">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 9h20" />
              <path d="m7 4 3 5" />
              <path d="m14 4 3 5" />
            </svg>
          </span>
          <span className="font-display text-base sm:text-lg font-bold tracking-tight whitespace-nowrap truncate">
            StoryCraft AI
          </span>
        </a>

        {/* Controls: Saved Projects + Light/Dark Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSaved}
            aria-label={`Proyek Tersimpan (${savedCount})`}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 transition-colors duration-150 hover:border-violet-300 hover:bg-violet-50/50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-violet-500/60 dark:hover:bg-slate-700/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Bookmark className="h-4 w-4 text-[#6D28D9] dark:text-violet-400 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Proyek Tersimpan</span>
            <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
              ({savedCount})
            </span>
          </button>

          {/* [Light | Dark] Toggle */}
          <div
            role="group"
            aria-label="Mode tampilan"
            className="inline-flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800 shrink-0"
          >
            <button
              type="button"
              onClick={() => onThemeChange('light')}
              aria-pressed={theme === 'light'}
              className={`inline-flex min-h-[32px] items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] whitespace-nowrap shrink-0 cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-[#6D28D9] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              <Sun className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => onThemeChange('dark')}
              aria-pressed={theme === 'dark'}
              className={`inline-flex min-h-[32px] items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] whitespace-nowrap shrink-0 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900 text-violet-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              <Moon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
