import { useEffect } from 'react';
import { Bookmark, Trash2, X } from 'lucide-react';
import type { SavedStoryboardProject } from '../types/storyboard';
import { PLATFORM_LABELS } from '../utils/storyboardUtils';

interface SavedProjectsDrawerProps {
  isOpen: boolean;
  projects: SavedStoryboardProject[];
  onClose: () => void;
  onLoad: (project: SavedStoryboardProject) => void;
  onDelete: (projectId: string) => void;
}

export function SavedProjectsDrawer({
  isOpen,
  projects,
  onClose,
  onLoad,
  onDelete,
}: SavedProjectsDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return '';
    }
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-projects-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup panel proyek tersimpan"
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-[1px] cursor-default"
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <h2
              id="saved-projects-title"
              className="font-display text-lg font-bold text-slate-900 dark:text-white"
            >
              Proyek Tersimpan
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Riwayat storyboard &amp; naskah yang tersimpan di browser Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel proyek tersimpan"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 mb-3">
                <Bookmark className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                Belum ada proyek tersimpan
              </p>
              <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Buat storyboard baru lalu klik &ldquo;Simpan Proyek&rdquo; agar mudah dibuka kembali kapan saja.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {projects.map((proj) => {
                const platform = PLATFORM_LABELS[proj.input.platform];
                return (
                  <li key={proj.id} className="py-4 first:pt-0">
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                      {proj.overview.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {proj.input.goal} · {platform.ratio} · {proj.input.duration} Detik ·{' '}
                      {proj.scenes.length} Adegan
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Disimpan {formatDate(proj.savedAt)}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onLoad(proj);
                          onClose();
                        }}
                        aria-label={`Buka ${proj.overview.title}`}
                        className="inline-flex min-h-[36px] flex-1 items-center justify-center rounded-lg bg-[#6D28D9] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] cursor-pointer"
                      >
                        Buka Proyek
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(proj.id)}
                        aria-label={`Hapus ${proj.overview.title}`}
                        className="inline-flex min-h-[36px] items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-rose-800 dark:hover:bg-rose-950/60 dark:hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
