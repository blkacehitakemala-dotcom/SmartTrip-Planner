import { useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ChecklistCategory, ChecklistItem } from '../types/trip';
import type { Translations } from '../i18n/translations';
import { getChecklistProgress } from '../utils/tripMath';

interface ChecklistTabProps {
  items: ChecklistItem[];
  t: Translations;
  onUpdateItems: (nextItems: ChecklistItem[]) => void;
}

const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  'documents',
  'booking',
  'packing',
  'health',
];

export function ChecklistTab({ items, t, onUpdateItems }: ChecklistTabProps) {
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState<ChecklistCategory>('packing');

  const progress = getChecklistProgress(items);

  const handleToggle = (id: string) => {
    onUpdateItems(
      items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleDelete = (id: string) => {
    onUpdateItems(items.filter((item) => item.id !== id));
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    const nextItem: ChecklistItem = {
      id: `custom-check-${Date.now()}`,
      category: newCategory,
      label: trimmed,
      essential: false,
      checked: false,
    };
    onUpdateItems([...items, nextItem]);
    setNewLabel('');
  };

  return (
    <div className="space-y-6">
      {/* Header + Progress Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900">
            {t.checklist.title}
          </h3>
          <p className="mt-0.5 text-sm text-slate-600">{t.checklist.subtitle}</p>
        </div>

        <p
          data-testid="checklist-progress-text"
          className="font-mono text-sm font-semibold tabular-nums text-[#0D9488] whitespace-nowrap"
        >
          {progress.completed} / {progress.total} {t.checklist.completedOf} ({progress.percentage}%)
        </p>
      </div>

      {/* Progress Track */}
      <div
        role="progressbar"
        aria-valuenow={progress.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
      >
        <div
          style={{ width: `${progress.percentage}%` }}
          className="h-full rounded-full bg-[#0D9488] transition-all duration-200"
        />
      </div>

      {/* Add Custom Checklist Item */}
      <form onSubmit={handleAdd} className="no-print flex flex-col gap-2.5 sm:flex-row">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder={t.checklist.addPlaceholder}
          aria-label={t.checklist.addPlaceholder}
          className="flex-1 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as ChecklistCategory)}
          aria-label="Checklist category"
          className="min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
        >
          {CHECKLIST_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {t.checklist.categories[cat]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!newLabel.trim()}
          className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0F766E] disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] whitespace-nowrap cursor-pointer"
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t.checklist.addBtn}</span>
        </button>
      </form>

      {/* Grouped Categories */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-2">
        {CHECKLIST_CATEGORIES.map((category) => {
          const catItems = items.filter((item) => item.category === category);
          if (catItems.length === 0) return null;

          return (
            <div key={category} className="space-y-2.5">
              <h4 className="font-display text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                {t.checklist.categories[category]}
              </h4>
              <ul className="divide-y divide-slate-100">
                {catItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <label className="flex flex-1 items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleToggle(item.id)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0D9488] accent-[#0D9488] focus:ring-[#0D9488] cursor-pointer"
                      />
                      <span
                        className={`text-sm leading-snug transition-colors ${
                          item.checked ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {item.label}
                        {item.essential && !item.checked && (
                          <span className="ml-2 text-xs font-semibold text-[#0284C7]">
                            · {t.checklist.essentialTag}
                          </span>
                        )}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      aria-label={`${t.checklist.deleteAria}: ${item.label}`}
                      className="no-print inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
