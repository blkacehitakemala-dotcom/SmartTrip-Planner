import { useState, type FormEvent } from 'react';
import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import type { BudgetCategory, BudgetItem, Currency } from '../types/trip';
import type { Translations } from '../i18n/translations';
import {
  BUDGET_CATEGORIES,
  calculateBudgetSummary,
  convertCurrencyValueToIdr,
  convertIdrToCurrencyValue,
  formatCurrency,
  getBudgetItemSubtotalIdr,
} from '../utils/tripMath';

interface BudgetTabProps {
  items: BudgetItem[];
  initialItems: BudgetItem[];
  travelers: number;
  days: number;
  currency: Currency;
  t: Translations;
  onUpdateItems: (nextItems: BudgetItem[]) => void;
}

const CATEGORY_COLORS: Record<BudgetCategory, string> = {
  transport: 'bg-[#0284C7]',
  accommodation: 'bg-[#0D9488]',
  food: 'bg-amber-500',
  activities: 'bg-indigo-500',
  misc: 'bg-slate-400',
};

export function BudgetTab({
  items,
  initialItems,
  travelers,
  days,
  currency,
  t,
  onUpdateItems,
}: BudgetTabProps) {
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<BudgetCategory>('activities');
  const [newQty, setNewQty] = useState(1);
  const [newUnitLabel, setNewUnitLabel] = useState('');
  const [newUnitCost, setNewUnitCost] = useState('');

  const summary = calculateBudgetSummary(items, travelers, days);

  const handleQuantityChange = (id: string, rawValue: string) => {
    const parsed = parseFloat(rawValue);
    const nextQty = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    onUpdateItems(
      items.map((item) => (item.id === id ? { ...item, quantity: nextQty } : item))
    );
  };

  const handleUnitCostChange = (id: string, rawValue: string) => {
    const parsed = parseFloat(rawValue);
    const safeDisplayVal = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    const nextIdr = convertCurrencyValueToIdr(safeDisplayVal, currency);
    onUpdateItems(
      items.map((item) => (item.id === id ? { ...item, unitCostIdr: nextIdr } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    onUpdateItems(items.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    onUpdateItems(initialItems.map((item) => ({ ...item })));
  };

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    if (!trimmedName) return;

    const parsedCost = parseFloat(newUnitCost);
    const costIdr = convertCurrencyValueToIdr(
      Number.isFinite(parsedCost) && parsedCost > 0 ? parsedCost : 0,
      currency
    );

    const newItem: BudgetItem = {
      id: `custom-${Date.now()}`,
      category: newCategory,
      itemName: trimmedName,
      quantity: Math.max(1, Number.isFinite(newQty) ? newQty : 1),
      unitLabel: newUnitLabel.trim() || 'item',
      unitCostIdr: costIdr,
    };

    onUpdateItems([...items, newItem]);
    setNewName('');
    setNewQty(1);
    setNewUnitLabel('');
    setNewUnitCost('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Reset */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900">
            {t.budget.title}
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
            {t.budget.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="no-print inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t.budget.resetBtn}</span>
        </button>
      </div>

      {/* Category Distribution Bar */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>{t.budget.categoryBreakdown}</span>
          <span className="font-mono tabular-nums text-slate-900">
            {formatCurrency(summary.totalIdr, currency)}
          </span>
        </div>

        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80">
          {summary.byCategory.map((cat) =>
            cat.percentage > 0 ? (
              <div
                key={cat.category}
                style={{ width: `${cat.percentage}%` }}
                className={`${CATEGORY_COLORS[cat.category]} transition-all duration-300`}
                title={`${t.budget.categories[cat.category]}: ${cat.percentage}%`}
              />
            ) : null
          )}
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
          {summary.byCategory.map((cat) => (
            <div key={cat.category} className="flex items-center gap-2 text-xs">
              <span
                className={`h-2.5 w-2.5 rounded-xs shrink-0 ${CATEGORY_COLORS[cat.category]}`}
                aria-hidden="true"
              />
              <span className="text-slate-600">{t.budget.categories[cat.category]}</span>
              <span className="font-mono font-semibold tabular-nums text-slate-900">
                {cat.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Editable Budget Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/90">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-semibold text-slate-600">
              <th className="py-3 pl-4 pr-3">{t.budget.colItem}</th>
              <th className="py-3 px-3 whitespace-nowrap">{t.budget.colCategory}</th>
              <th className="py-3 px-3 whitespace-nowrap">{t.budget.colQty}</th>
              <th className="py-3 px-3 whitespace-nowrap">
                {t.budget.colUnitCost} ({currency})
              </th>
              <th className="py-3 px-3 text-right whitespace-nowrap">
                {t.budget.colSubtotal}
              </th>
              <th className="no-print py-3 pl-2 pr-3 w-10">
                <span className="sr-only">{t.budget.deleteItemAria}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {items.map((item) => {
              const subtotalIdr = getBudgetItemSubtotalIdr(item);
              const displayUnitCost = convertIdrToCurrencyValue(item.unitCostIdr, currency);
              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pl-4 pr-3 align-top">
                    <p className="font-medium text-slate-900">{item.itemName}</p>
                    {item.notes && (
                      <p className="mt-0.5 text-xs text-slate-500">{item.notes}</p>
                    )}
                  </td>
                  <td className="py-3 px-3 align-top whitespace-nowrap text-xs font-medium text-slate-600">
                    {t.budget.categories[item.category]}
                  </td>
                  <td className="py-3 px-3 align-top whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        aria-label={`${t.budget.colQty} ${item.itemName}`}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-16 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 font-mono text-xs tabular-nums text-slate-900 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                      />
                      <span className="min-w-[74px] text-left text-xs text-slate-500">
                        {item.unitLabel}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 align-top whitespace-nowrap">
                    <input
                      type="number"
                      min={0}
                      step={currency === 'USD' ? 1 : 10000}
                      aria-label={`${t.budget.colUnitCost} ${item.itemName}`}
                      value={displayUnitCost}
                      onChange={(e) => handleUnitCostChange(item.id, e.target.value)}
                      className="w-32 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 font-mono text-xs tabular-nums text-slate-900 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                    />
                  </td>
                  <td className="py-3 px-3 align-top text-right whitespace-nowrap font-mono text-sm font-semibold tabular-nums text-slate-900">
                    {formatCurrency(subtotalIdr, currency)}
                  </td>
                  <td className="no-print py-3 pl-2 pr-3 align-top text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      aria-label={`${t.budget.deleteItemAria}: ${item.itemName}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50/80">
              <td
                colSpan={4}
                className="py-3.5 pl-4 pr-3 font-display text-sm font-bold text-slate-900"
              >
                {t.budget.totalRow}
              </td>
              <td
                data-testid="budget-table-total"
                className="py-3.5 px-3 text-right font-mono text-base font-bold tabular-nums text-[#0284C7] whitespace-nowrap"
              >
                {formatCurrency(summary.totalIdr, currency)}
              </td>
              <td className="no-print" />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Add Custom Budget Item Form */}
      <form
        onSubmit={handleAddItem}
        className="no-print rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-3"
      >
        <p className="font-display text-xs font-bold uppercase tracking-wider text-slate-600">
          {t.budget.addItemHeading}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t.budget.itemNamePlaceholder}
            aria-label={t.budget.colItem}
            className="sm:col-span-4 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as BudgetCategory)}
            aria-label={t.budget.colCategory}
            className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
          >
            {BUDGET_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t.budget.categories[cat]}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={newQty}
            onChange={(e) => setNewQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
            aria-label={t.budget.colQty}
            className="sm:col-span-1 rounded-xl border border-slate-200 bg-white px-2.5 py-2 font-mono text-xs sm:text-sm tabular-nums text-slate-900 focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
          />
          <input
            type="text"
            value={newUnitLabel}
            onChange={(e) => setNewUnitLabel(e.target.value)}
            placeholder={t.budget.unitLabelPlaceholder}
            aria-label={t.budget.unitLabelPlaceholder}
            className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
          />
          <input
            type="number"
            min={0}
            value={newUnitCost}
            onChange={(e) => setNewUnitCost(e.target.value)}
            placeholder={`${t.budget.colUnitCost} (${currency})`}
            aria-label={`${t.budget.colUnitCost} (${currency})`}
            className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs sm:text-sm tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
          />
          <button
            type="submit"
            className="sm:col-span-1 inline-flex min-h-[38px] items-center justify-center gap-1 rounded-xl bg-[#0D9488] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] cursor-pointer"
          >
            <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="sm:hidden">{t.budget.addBtn}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
