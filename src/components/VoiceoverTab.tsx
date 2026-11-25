import { useState } from 'react';
import { Check, Clock, Copy, FileText, Gauge } from 'lucide-react';
import type { StoryScene, VideoDuration } from '../types/storyboard';
import {
  combineVoiceoverScript,
  estimateReadingMetrics,
} from '../utils/storyboardUtils';

interface VoiceoverTabProps {
  scenes: StoryScene[];
  targetDuration: VideoDuration;
  onCopyText: (text: string, toastMessage: string) => void;
}

export function VoiceoverTab({
  scenes,
  targetDuration,
  onCopyText,
}: VoiceoverTabProps) {
  const [includeTimecodes, setIncludeTimecodes] = useState(false);
  const [copied, setCopied] = useState(false);

  const metrics = estimateReadingMetrics(scenes, targetDuration);
  const combinedText = combineVoiceoverScript(scenes, includeTimecodes);

  const handleCopyVo = () => {
    onCopyText(combinedText, 'Naskah Voiceover Lengkap berhasil disalin!');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="print-flat rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900">
      {/* Header + Copy Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Naskah Voiceover Lengkap (Siap Rekam)
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Seluruh dialog adegan digabung menjadi satu naskah bacaan bersih agar mudah dibaca saat sesi rekaman suara.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyVo}
          className="no-print inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] whitespace-nowrap shrink-0 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Naskah Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Salin Naskah VO</span>
            </>
          )}
        </button>
      </div>

      {/* Reading Speed Metrics Strip */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <FileText className="h-3.5 w-3.5 text-[#6D28D9] dark:text-violet-400" aria-hidden="true" />
            <span>Jumlah Kata</span>
          </p>
          <p
            data-testid="vo-word-count"
            className="mt-1 font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white"
          >
            {metrics.wordCount} kata
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5 text-[#DB2777] dark:text-pink-400" aria-hidden="true" />
            <span>Estimasi Durasi Baca</span>
          </p>
          <p
            data-testid="vo-duration-estimate"
            className="mt-1 font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white"
          >
            ~{metrics.estimatedSeconds} detik{' '}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              / target {targetDuration}d
            </span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Gauge className="h-3.5 w-3.5 text-[#6D28D9] dark:text-violet-400" aria-hidden="true" />
            <span>Kecepatan Baca</span>
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white leading-snug">
            {metrics.paceLabel}
          </p>
        </div>
      </div>

      {/* Toggle Timecodes */}
      <div className="no-print mt-5 flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeTimecodes}
            onChange={(e) => setIncludeTimecodes(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#6D28D9] accent-[#6D28D9] focus:ring-[#6D28D9] cursor-pointer"
          />
          <span>Tampilkan penanda Scene &amp; Timecode di naskah</span>
        </label>
      </div>

      {/* Clean Teleprompter-Ready Script Body */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-950/70">
        <div
          data-testid="vo-script-content"
          className="space-y-4 text-base sm:text-lg leading-relaxed text-slate-900 dark:text-slate-100"
        >
          {scenes.map((scene) => (
            <div key={scene.scene_number}>
              {includeTimecodes && (
                <p className="mb-1 font-mono text-xs font-semibold tabular-nums text-[#DB2777] dark:text-pink-400">
                  [Scene {String(scene.scene_number).padStart(2, '0')} · {scene.timecode}]
                </p>
              )}
              <p>{scene.voiceover_dialogue}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
