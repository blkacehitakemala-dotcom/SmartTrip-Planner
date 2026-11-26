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
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    onUpdateItems(items.filter((item) => item.id !== id));
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newLabel.trim();
    if (!trimmed) return;

    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      category: newCategory,
      label: trimmed,
      essential: false,
      checked: false,
    };

    onUpdateItems([...items, newItem]);
    setNewLabel('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Progress Bar */}
      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              {t.checklist.title}
            </h3>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
              {t.checklist.subtitle}
            </p>
          </div>
          <p
            data-testid="checklist-progress-text"
            className="font-mono text-xs sm:text-sm font-bold tabular-nums text-[#0D9488]"
          >
            {progress.completed} / {progress.total} {t.checklist.completedOf} ({progress.percentage}%)
          </p>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80">
          <div
            style={{ width: `${progress.percentage}%` }}
            className="h-full bg-[#0D9488] transition-all duration-300"
          />
        </div>
      </div>

      {/* Add Custom Checklist Item */}
      <form
        onSubmit={handleAdd}
        className="no-print flex flex-col gap-2.5 sm:flex-row"
      >
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder={t.checklist.addPlaceholder}
          aria-label={t.checklist.addPlaceholder}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0D9488] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as ChecklistCategory)}
          aria-label="Checklist category"
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#0D9488] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20"
        >
          {CHECKLIST_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {t.checklist.categories[cat]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] cursor-pointer"
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t.checklist.addBtn}</span>
        </button>
      </form>

      {/* Grouped Categories */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {CHECKLIST_CATEGORIES.map((category) => {
          const groupItems = items.filter((item) => item.category === category);
          if (groupItems.length === 0) return null;

          return (
            <section
              key={category}
              className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3"
            >
              <h4 className="font-display text-sm font-bold text-slate-900">
                {t.checklist.categories[category]}
              </h4>

              <ul className="space-y-2">
                {groupItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-2.5 rounded-xl border border-slate-200/70 bg-white px-3.5 py-2.5"
                  >
                    <label className="flex flex-1 cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleToggle(item.id)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488] cursor-pointer"
                      />
                      <span
                        className={`text-sm leading-snug ${
                          item.checked
                            ? 'text-slate-400 line-through'
                            : 'text-slate-800'
                        }`}
                      >
                        {item.label}
                        {item.essential && (
                          <span className="ml-2 text-[11px] font-semibold text-[#0284C7]">
                            · {t.checklist.essentialTag}
                          </span>
                        )}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      aria-label={`${t.checklist.deleteAria}: ${item.label}`}
                      className="no-print inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
