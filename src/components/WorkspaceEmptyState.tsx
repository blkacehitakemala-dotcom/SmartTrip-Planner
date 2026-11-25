import { Clapperboard, Eye, FileText, Hash } from 'lucide-react';
import { QUICK_IDEA_PRESETS, type QuickIdeaPreset } from '../data/sampleProject';

interface WorkspaceEmptyStateProps {
  onApplyPreset: (preset: QuickIdeaPreset) => void;
  onPreviewSample: () => void;
}

export function WorkspaceEmptyState({
  onApplyPreset,
  onPreviewSample,
}: WorkspaceEmptyStateProps) {
  return (
    <section
      aria-labelledby="workspace-empty-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-9 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold text-[#DB2777] dark:text-pink-400">
          Storyboard & Script Studio
        </p>
        <h2
          id="workspace-empty-heading"
          className="mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
          style={{ textWrap: 'balance' }}
        >
          Ubah Satu Ide Menjadi Paket Produksi Video Lengkap
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Isi topik konten di panel sebelah kiri lalu klik <strong className="font-semibold text-slate-800 dark:text-slate-200">Generate Storyboard &amp; Naskah</strong>. Dalam beberapa detik, studio akan menyusun breakdown adegan, prompt visual AI bahasa Inggris, naskah voiceover, dan caption AIDA siap unggah.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onPreviewSample}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[#6D28D9] bg-violet-50 px-4 py-2 text-sm font-semibold text-[#6D28D9] transition-colors hover:bg-violet-100 dark:border-violet-500 dark:bg-violet-950/60 dark:text-violet-200 dark:hover:bg-violet-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] whitespace-nowrap cursor-pointer"
          >
            <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Lihat Contoh Proyek (Kopi Lokal)</span>
          </button>
        </div>
      </div>

      {/* 3 Deliverable Highlights */}
      <div className="mt-8 grid grid-cols-1 gap-5 border-t border-slate-100 pt-7 sm:grid-cols-3 dark:border-slate-800">
        <div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-[#6D28D9] dark:bg-violet-950/70 dark:text-violet-300">
            <Clapperboard className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="mt-3 font-display text-sm font-bold text-slate-900 dark:text-white">
            01. Storyboard &amp; Prompt EN
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Pembagian 4–8 adegan lengkap dengan timecode, shot type, visual ID, dan prompt AI berbahasa Inggris siap salin.
          </p>
        </div>

        <div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-50 text-[#DB2777] dark:bg-pink-950/70 dark:text-pink-300">
            <FileText className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="mt-3 font-display text-sm font-bold text-slate-900 dark:text-white">
            02. Naskah Voiceover Utuh
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Seluruh dialog tergabung rapi untuk sesi rekaman, dilengkapi hitung jumlah kata dan estimasi kecepatan baca.
          </p>
        </div>

        <div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-[#6D28D9] dark:bg-violet-950/70 dark:text-violet-300">
            <Hash className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="mt-3 font-display text-sm font-bold text-slate-900 dark:text-white">
            03. Caption AIDA &amp; SEO
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Struktur copywriting Attention–Interest–Desire–Action, 5 kata kunci SEO, serta 8–10 hashtag siap tempel.
          </p>
        </div>
      </div>

      {/* Starter Briefs */}
      <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
          Atau pilih template brief untuk mengisi formulir otomatis:
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {QUICK_IDEA_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-left transition-colors hover:border-[#6D28D9] hover:bg-violet-50/40 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-violet-500/70 dark:hover:bg-violet-950/30 cursor-pointer"
            >
              <p className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                {preset.label}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {preset.input.goal} · {preset.input.duration} Detik · {preset.input.visualStyle}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
