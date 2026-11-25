import { BookmarkCheck, BookmarkPlus, Check, Download, MessageCircle, Printer } from 'lucide-react';
import type { Translations } from '../i18n/translations';

interface ActionToolbarProps {
  isSaved: boolean;
  copiedWhatsApp: boolean;
  t: Translations;
  onSave: () => void;
  onCopyWhatsApp: () => void;
  onDownloadCsv: () => void;
  onPrintPdf: () => void;
}

export function ActionToolbar({
  isSaved,
  copiedWhatsApp,
  t,
  onSave,
  onCopyWhatsApp,
  onDownloadCsv,
  onPrintPdf,
}: ActionToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Trip actions"
      className="no-print flex flex-wrap items-center gap-2.5"
    >
      <button
        type="button"
        onClick={onSave}
        className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] whitespace-nowrap shrink-0 cursor-pointer ${
          isSaved
            ? 'border-[#0D9488] bg-teal-50 text-[#0F766E]'
            : 'border-[#0284C7] bg-[#0284C7] text-white hover:bg-[#0369A1]'
        }`}
      >
        {isSaved ? (
          <BookmarkCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <BookmarkPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        <span>{isSaved ? t.toolbar.saved : t.toolbar.savePlan}</span>
      </button>

      <button
        type="button"
        onClick={onCopyWhatsApp}
        className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] whitespace-nowrap shrink-0 cursor-pointer"
      >
        {copiedWhatsApp ? (
          <Check className="h-4 w-4 text-[#0D9488] shrink-0" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-4 w-4 text-[#0D9488] shrink-0" aria-hidden="true" />
        )}
        <span>{copiedWhatsApp ? t.toolbar.copied : t.toolbar.copyWhatsApp}</span>
      </button>

      <button
        type="button"
        onClick={onDownloadCsv}
        className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="h-4 w-4 text-slate-500 shrink-0" aria-hidden="true" />
        <span>{t.toolbar.downloadCsv}</span>
      </button>

      <button
        type="button"
        onClick={onPrintPdf}
        className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Printer className="h-4 w-4 text-slate-500 shrink-0" aria-hidden="true" />
        <span>{t.toolbar.printPdf}</span>
      </button>
    </div>
  );
}
