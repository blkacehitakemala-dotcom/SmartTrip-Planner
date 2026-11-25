import { BookmarkCheck, BookmarkPlus, Download, Printer } from 'lucide-react';

interface ActionToolbarProps {
  isSaved: boolean;
  onSave: () => void;
  onDownloadCsv: () => void;
  onPrintPdf: () => void;
}

export function ActionToolbar({
  isSaved,
  onSave,
  onDownloadCsv,
  onPrintPdf,
}: ActionToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Aksi proyek"
      className="no-print flex flex-wrap items-center gap-2.5"
    >
      <button
        type="button"
        onClick={onSave}
        className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] whitespace-nowrap shrink-0 cursor-pointer ${
          isSaved
            ? 'border-[#DB2777] bg-pink-50 text-[#BE185D] dark:border-pink-500 dark:bg-pink-950/50 dark:text-pink-300'
            : 'border-[#6D28D9] bg-[#6D28D9] text-white hover:bg-[#5B21B6]'
        }`}
      >
        {isSaved ? (
          <BookmarkCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <BookmarkPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        <span>{isSaved ? 'Proyek Tersimpan' : 'Simpan Proyek'}</span>
      </button>

      <button
        type="button"
        onClick={onDownloadCsv}
        className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="h-4 w-4 text-[#6D28D9] dark:text-violet-400 shrink-0" aria-hidden="true" />
        <span>Download CSV (Excel)</span>
      </button>

      <button
        type="button"
        onClick={onPrintPdf}
        className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Printer className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
        <span>Cetak / Simpan PDF</span>
      </button>
    </div>
  );
}
