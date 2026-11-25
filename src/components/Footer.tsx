import { ArrowUpRight } from 'lucide-react';
import type { Translations } from '../i18n/translations';

interface FooterProps {
  t: Translations;
}

export function Footer({ t }: FooterProps) {
  return (
    <footer className="no-print mt-16 border-t border-slate-200/80 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-7 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p className="text-xs sm:text-sm text-slate-500">{t.footer.disclaimer}</p>
        <a
          href="#consultation"
          className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 whitespace-nowrap shrink-0"
        >
          <span>{t.footer.ctaLabel}</span>
          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
