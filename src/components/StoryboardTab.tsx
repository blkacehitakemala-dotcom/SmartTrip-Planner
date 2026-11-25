import { useState } from 'react';
import { Camera, Check, Copy, Mic, Volume2 } from 'lucide-react';
import type { StoryScene } from '../types/storyboard';

interface StoryboardTabProps {
  scenes: StoryScene[];
  onCopyText: (text: string, toastMessage: string) => void;
}

export function StoryboardTab({ scenes, onCopyText }: StoryboardTabProps) {
  const [copiedScene, setCopiedScene] = useState<number | null>(null);

  const handleCopyPrompt = (scene: StoryScene) => {
    onCopyText(
      scene.ai_visual_prompt_en,
      `Prompt Visual AI Scene ${scene.scene_number} berhasil disalin!`
    );
    setCopiedScene(scene.scene_number);
    window.setTimeout(() => {
      setCopiedScene((prev) => (prev === scene.scene_number ? null : prev));
    }, 2000);
  };

  return (
    <div className="space-y-5">
      {scenes.map((scene) => {
        const isCopied = copiedScene === scene.scene_number;
        return (
          <article
            key={scene.scene_number}
            data-testid={`scene-card-${scene.scene_number}`}
            className="print-flat print-break-inside-avoid rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Scene Header Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-lg bg-[#6D28D9] px-2.5 py-1 font-mono text-xs font-bold tabular-nums text-white">
                  Scene {String(scene.scene_number).padStart(2, '0')}
                </span>
                <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium tabular-nums text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {scene.timecode}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-pink-50 px-2.5 py-1 text-xs font-semibold text-[#DB2777] dark:bg-pink-950/60 dark:text-pink-300">
                  <Camera className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{scene.shot_type}</span>
                </span>
              </div>
            </div>

            {/* Visual Description (ID) + Voiceover & Audio */}
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-12">
              <div className="md:col-span-6">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Deskripsi Visual (ID)
                </h3>
                <p className="mt-1.5 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {scene.visual_description_id}
                </p>
              </div>

              <div className="md:col-span-6 space-y-3.5 md:border-l md:border-slate-100 md:pl-5 dark:md:border-slate-800">
                <div>
                  <h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Mic className="h-3.5 w-3.5 text-[#6D28D9] dark:text-violet-400 shrink-0" aria-hidden="true" />
                    <span>Narasi / Voiceover</span>
                  </h3>
                  <p className="mt-1.5 text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                    &ldquo;{scene.voiceover_dialogue}&rdquo;
                  </p>
                </div>

                <div>
                  <h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Volume2 className="h-3.5 w-3.5 text-[#DB2777] dark:text-pink-400 shrink-0" aria-hidden="true" />
                    <span>Audio / SFX &amp; Transisi</span>
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {scene.audio_sfx}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Visual Prompt (EN) Soft Box */}
            <div className="mt-5 rounded-xl border border-violet-200/80 bg-violet-50/60 p-4 dark:border-violet-900/60 dark:bg-violet-950/30">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-[#6D28D9] dark:text-violet-300">
                  AI Visual Prompt (EN) — Siap Salin ke Image/Video Generator
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(scene)}
                  aria-label={`Salin Prompt Scene ${scene.scene_number}`}
                  className="no-print inline-flex min-h-[32px] items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-1 text-xs font-semibold text-[#6D28D9] transition-colors hover:border-[#6D28D9] hover:bg-[#6D28D9] hover:text-white dark:border-violet-700 dark:bg-slate-900 dark:text-violet-300 dark:hover:bg-violet-600 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Salin Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed select-all">
                {scene.ai_visual_prompt_en}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
