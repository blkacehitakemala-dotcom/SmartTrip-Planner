import { useState } from 'react';
import { Check, Copy, Hash, Search } from 'lucide-react';
import type { SocialCopy } from '../types/storyboard';
import { buildFullCaptionText, normalizeHashtag } from '../utils/storyboardUtils';

interface CaptionAidaTabProps {
  socialCopy: SocialCopy;
  onCopyText: (text: string, toastMessage: string) => void;
}

const AIDA_STAGES: {
  key: keyof SocialCopy['aida_caption'];
  title: string;
  subtitle: string;
  badgeClass: string;
}[] = [
  {
    key: 'attention',
    title: 'Attention',
    subtitle: 'Tarik perhatian di kalimat pertama',
    badgeClass: 'bg-pink-50 text-[#DB2777] dark:bg-pink-950/60 dark:text-pink-300',
  },
  {
    key: 'interest',
    title: 'Interest',
    subtitle: 'Bangun rasa ingin tahu & relevansi',
    badgeClass: 'bg-violet-50 text-[#6D28D9] dark:bg-violet-950/60 dark:text-violet-300',
  },
  {
    key: 'desire',
    title: 'Desire',
    subtitle: 'Tunjukkan manfaat emosional & nilai utama',
    badgeClass: 'bg-pink-50 text-[#DB2777] dark:bg-pink-950/60 dark:text-pink-300',
  },
  {
    key: 'action',
    title: 'Action',
    subtitle: 'Ajakan bertindak (CTA) yang tegas',
    badgeClass: 'bg-violet-50 text-[#6D28D9] dark:bg-violet-950/60 dark:text-violet-300',
  },
];

export function CaptionAidaTab({ socialCopy, onCopyText }: CaptionAidaTabProps) {
  const [copiedFull, setCopiedFull] = useState(false);

  const fullCaption = buildFullCaptionText(
    socialCopy.aida_caption,
    socialCopy.hashtags
  );

  const handleCopyFull = () => {
    onCopyText(fullCaption, 'Caption AIDA + Hashtag berhasil disalin!');
    setCopiedFull(true);
    window.setTimeout(() => setCopiedFull(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* AIDA Stage-by-Stage Breakdown */}
      <section className="print-flat rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Struktur Caption AIDA
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Pecahan copywriting media sosial per tahap persuasi agar konversi dan interaksi maksimal.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyFull}
            className="no-print inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copiedFull ? (
              <>
                <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Caption Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Salin Caption + Hashtag</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {AIDA_STAGES.map((stage, idx) => (
            <div
              key={stage.key}
              className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/60"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${stage.badgeClass}`}
                >
                  0{idx + 1} · {stage.title}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {stage.subtitle}
                </span>
              </div>
              <p className="mt-2.5 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {socialCopy.aida_caption[stage.key]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Ready-to-Paste Full Caption Preview */}
      <section className="print-flat rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
          Pratinjau Caption Utuh (Siap Tempel)
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Gabungan lengkap struktur AIDA beserta seluruh hashtag untuk langsung ditempel ke TikTok, Instagram, atau YouTube Shorts.
        </p>

        <pre
          data-testid="full-caption-preview"
          className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 font-sans text-sm text-slate-800 leading-relaxed dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200"
        >
          {fullCaption}
        </pre>
      </section>

      {/* SEO Keywords & Hashtags Chips */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* SEO Keywords */}
        <section className="print-flat rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900 dark:text-white">
            <Search className="h-4 w-4 text-[#6D28D9] dark:text-violet-400 shrink-0" aria-hidden="true" />
            <span>Kata Kunci SEO ({socialCopy.seo_keywords.length})</span>
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Klik chip untuk menyalin kata kunci secara satuan.
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {socialCopy.seo_keywords.map((keyword, idx) => (
              <button
                key={`${keyword}-${idx}`}
                type="button"
                onClick={() => onCopyText(keyword, `Kata kunci "${keyword}" disalin!`)}
                className="min-h-[34px] rounded-lg border border-violet-200 bg-violet-50/70 px-3 py-1 text-xs font-semibold text-[#6D28D9] transition-colors hover:bg-[#6D28D9] hover:text-white dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-600 dark:hover:text-white cursor-pointer"
              >
                {keyword}
              </button>
            ))}
          </div>
        </section>

        {/* Hashtags */}
        <section className="print-flat rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900 dark:text-white">
            <Hash className="h-4 w-4 text-[#DB2777] dark:text-pink-400 shrink-0" aria-hidden="true" />
            <span>Hashtag Siap Pakai ({socialCopy.hashtags.length})</span>
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Klik hashtag untuk menyalin satuan.
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {socialCopy.hashtags.map((rawTag, idx) => {
              const tag = normalizeHashtag(rawTag);
              if (!tag) return null;
              return (
                <button
                  key={`${tag}-${idx}`}
                  type="button"
                  onClick={() => onCopyText(tag, `Hashtag ${tag} disalin!`)}
                  className="min-h-[34px] rounded-lg border border-pink-200 bg-pink-50/70 px-3 py-1 font-mono text-xs font-semibold text-[#DB2777] transition-colors hover:bg-[#DB2777] hover:text-white dark:border-pink-800/80 dark:bg-pink-950/50 dark:text-pink-300 dark:hover:bg-pink-600 dark:hover:text-white cursor-pointer"
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
