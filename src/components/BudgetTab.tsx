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

const CATEGORY_BAR_COLORS: Record<BudgetCategory, string> = {
  transport: 'bg-[#0284C7]',
  accommodation: 'bg-[#0D9488]',
  food: 'bg-sky-400',
  activities: 'bg-teal-400',
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
  const [newUnitCostDisplay, setNewUnitCostDisplay] = useState('');

  const summary = calculateBudgetSummary(items, travelers, days);

  const hasModifiedBudget =
    initialItems.length > 0 && JSON.stringify(items) !== JSON.stringify(initialItems);

  const handleQuantityChange = (id: string, rawVal: string) => {
    const parsed = parseInt(rawVal, 10);
    const qty = Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(999, parsed));
    onUpdateItems(
      items.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleUnitCostChange = (id: string, rawVal: string) => {
    const parsed = parseFloat(rawVal);
    const safeVal = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
    const idrCost = convertCurrencyValueToIdr(safeVal, currency);
    onUpdateItems(
      items.map((item) => (item.id === id ? { ...item, unitCostIdr: idrCost } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    onUpdateItems(items.filter((item) => item.id !== id));
  };

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    if (!trimmedName) return;
    const parsedCost = parseFloat(newUnitCostDisplay);
    const unitCostIdr = convertCurrencyValueToIdr(
      Number.isNaN(parsedCost) ? 0 : Math.max(0, parsedCost),
      currency
    );

    const nextItem: BudgetItem = {
      id: `custom-budget-${Date.now()}`,
      category: newCategory,
      itemName: trimmedName,
      unitCostIdr,
      quantity: Math.max(1, newQty || 1),
      unitLabel: newUnitLabel.trim() || 'item',
    };

    onUpdateItems([...items, nextItem]);
    setNewName('');
    setNewQty(1);
    setNewUnitLabel('');
    setNewUnitCostDisplay('');
  };

  const handleReset = () => {
    onUpdateItems(initialItems.map((item) => ({ ...item })));
  };

  return (
    <div className="space-y-8">
      {/* Header + Reset */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900">{t.budget.title}</h3>
          <p className="mt-0.5 text-sm text-slate-600">{t.budget.subtitle}</p>
        </div>

        {hasModifiedBudget && (
          <button
            type="button"
            onClick={handleReset}
            className="no-print inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{t.budget.resetBtn}</span>
          </button>
        )}
      </div>

      {/* Category Distribution Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700">
            {t.budget.categoryBreakdown}
          </span>
          <span className="font-mono text-xs tabular-nums text-slate-500">
            {formatCurrency(summary.totalIdr, currency)}
          </span>
        </div>

        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
          {summary.byCategory.map((cat) =>
            cat.percentage > 0 ? (
              <div
                key={cat.category}
                style={{ width: `${cat.percentage}%` }}
                className={`${CATEGORY_BAR_COLORS[cat.category]} transition-all duration-200`}
                title={`${t.budget.categories[cat.category]}: ${cat.percentage}%`}
              />
            ) : null
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {summary.byCategory.map((cat) => (
            <div key={cat.category} className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2.5 w-2.5 rounded-xs shrink-0 ${CATEGORY_BAR_COLORS[cat.category]}`}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-slate-600 truncate">
                  {t.budget.categories[cat.category]}
                </span>
              </div>
              <p className="font-mono text-xs font-semibold tabular-nums text-slate-900">
                {formatCurrency(cat.totalIdr, currency)}{' '}
                <span className="font-normal text-slate-500">({cat.percentage}%)</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Budget Table */}
      <div className="overflow-x-auto border-t border-slate-200 pt-2">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
              <th className="py-3 pr-4">{t.budget.colItem}</th>
              <th className="py-3 px-3">{t.budget.colCategory}</th>
              <th className="py-3 px-3 text-right">{t.budget.colQty}</th>
              <th className="py-3 px-3 text-right">
                {t.budget.colUnitCost} ({currency})
              </th>
              <th className="py-3 pl-3 text-right">{t.budget.colSubtotal}</th>
              <th className="no-print py-3 pl-2 w-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {items.map((item) => {
              const subtotalIdr = getBudgetItemSubtotalIdr(item);
              const unitCostDisplay = convertIdrToCurrencyValue(item.unitCostIdr, currency);

              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-4 align-middle">
                    <p className="font-medium text-slate-900">{item.itemName}</p>
                    {item.notes && (
                      <p className="text-xs text-slate-500 mt-0.5">{item.notes}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-3 align-middle text-xs text-slate-600 whitespace-nowrap">
                    {t.budget.categories[item.category]}
                  </td>
                  <td className="py-3.5 px-3 align-middle text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={999}
                        value={item.quantity}
                        aria-label={`${t.budget.colQty} ${item.itemName}`}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-right font-mono text-sm tabular-nums text-slate-900 focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                      />
                      <span className="min-w-[74px] text-left text-xs text-slate-500 whitespace-nowrap">
                        {item.unitLabel}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 align-middle text-right">
                    <input
                      type="number"
                      min={0}
                      step={currency === 'USD' ? '0.5' : '5000'}
                      value={unitCostDisplay}
                      aria-label={`${t.budget.colUnitCost} ${item.itemName}`}
                      onChange={(e) => handleUnitCostChange(item.id, e.target.value)}
                      className="w-32 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-right font-mono text-sm tabular-nums text-slate-900 focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                    />
                  </td>
                  <td className="py-3.5 pl-3 align-middle text-right font-mono text-sm font-semibold tabular-nums text-slate-900 whitespace-nowrap">
                    {formatCurrency(subtotalIdr, currency)}
                  </td>
                  <td className="no-print py-3.5 pl-2 align-middle text-right">
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
            <tr className="border-t-2 border-slate-200">
              <td colSpan={4} className="py-4 pr-4 font-display text-sm font-bold text-slate-900">
                {t.budget.totalRow}
              </td>
              <td
                data-testid="budget-table-total"
                className="py-4 pl-3 text-right font-mono text-base font-bold tabular-nums text-[#0284C7] whitespace-nowrap"
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
        className="no-print border-t border-slate-100 pt-6"
      >
        <h4 className="font-display text-sm font-bold text-slate-900 mb-3">
          {t.budget.addItemHeading}
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="sm:col-span-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t.budget.itemNamePlaceholder}
              aria-label={t.budget.colItem}
              className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
            />
          </div>
          <div className="sm:col-span-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as BudgetCategory)}
              aria-label={t.budget.colCategory}
              className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-2 text-sm text-slate-800 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
            >
              {BUDGET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {t.budget.categories[cat]}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-1">
            <input
              type="number"
              min={1}
              max={999}
              value={newQty}
              onChange={(e) => setNewQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              aria-label={t.budget.colQty}
              className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-2 text-right font-mono text-sm tabular-nums text-slate-900 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
            />
          </div>
          <div className="sm:col-span-2">
            <input
              type="text"
              value={newUnitLabel}
              onChange={(e) => setNewUnitLabel(e.target.value)}
              placeholder={t.budget.unitLabelPlaceholder}
              aria-label={t.budget.unitLabelPlaceholder}
              className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
            />
          </div>
          <div className="sm:col-span-2">
            <input
              type="number"
              min={0}
              step={currency === 'USD' ? '0.5' : '5000'}
              value={newUnitCostDisplay}
              onChange={(e) => setNewUnitCostDisplay(e.target.value)}
              placeholder={`${t.budget.colUnitCost} (${currency})`}
              aria-label={`${t.budget.colUnitCost} (${currency})`}
              className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-right font-mono text-sm tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
            />
          </div>
          <div className="sm:col-span-1">
            <button
              type="submit"
              disabled={!newName.trim()}
              aria-label={t.budget.addBtn}
              className="inline-flex w-full min-h-[42px] items-center justify-center gap-1 rounded-xl bg-[#0D9488] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0F766E] disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] cursor-pointer"
            >
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sm:hidden">{t.budget.addBtn}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
