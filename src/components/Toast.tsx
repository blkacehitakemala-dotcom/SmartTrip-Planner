import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-violet-200 bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg dark:border-violet-700 dark:bg-violet-950"
    >
      <CheckCircle2 className="h-4 w-4 text-[#EC4899] shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
