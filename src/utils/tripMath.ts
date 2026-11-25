import type {
  BudgetCategory,
  BudgetItem,
  ChecklistItem,
  Currency,
  Language,
  TripFormInput,
  TripPlan,
} from '../types/trip';

export const USD_EXCHANGE_RATE = 16000;

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  'transport',
  'accommodation',
  'food',
  'activities',
  'misc',
];

export function convertIdrToCurrencyValue(amountIdr: number, currency: Currency): number {
  const safeAmount = Number.isFinite(amountIdr) ? Math.max(0, amountIdr) : 0;
  if (currency === 'USD') {
    return Math.round((safeAmount / USD_EXCHANGE_RATE) * 100) / 100;
  }
  return Math.round(safeAmount);
}

export function convertCurrencyValueToIdr(amount: number, currency: Currency): number {
  const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
  if (currency === 'USD') {
    return Math.round(safeAmount * USD_EXCHANGE_RATE);
  }
  return Math.round(safeAmount);
}

export function formatCurrency(amountIdr: number, currency: Currency): string {
  const safeAmount = Number.isFinite(amountIdr) ? Math.max(0, amountIdr) : 0;

  if (currency === 'USD') {
    const usdValue = safeAmount / USD_EXCHANGE_RATE;
    const isNearWhole = Math.abs(usdValue - Math.round(usdValue)) < 0.005;
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: isNearWhole ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(isNearWhole ? Math.round(usdValue) : usdValue);
    return `$${formatted}`;
  }

  const roundedIdr = Math.round(safeAmount);
  const formattedIdr = roundedIdr
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formattedIdr}`;
}

export interface CategoryBudgetTotal {
  category: BudgetCategory;
  totalIdr: number;
  percentage: number;
}

export interface BudgetSummary {
  totalIdr: number;
  perPersonIdr: number;
  perDayIdr: number;
  byCategory: CategoryBudgetTotal[];
}

export function getBudgetItemSubtotalIdr(item: BudgetItem): number {
  const unit = Number.isFinite(item.unitCostIdr) ? Math.max(0, item.unitCostIdr) : 0;
  const qty = Number.isFinite(item.quantity) ? Math.max(0, item.quantity) : 0;
  return Math.round(unit * qty);
}

export function calculateBudgetSummary(
  items: BudgetItem[],
  travelers: number,
  days: number
): BudgetSummary {
  const safeTravelers = Math.max(1, Math.floor(travelers || 1));
  const safeDays = Math.max(1, Math.floor(days || 1));

  const totalsMap = new Map<BudgetCategory, number>();
  for (const cat of BUDGET_CATEGORIES) {
    totalsMap.set(cat, 0);
  }

  let totalIdr = 0;
  for (const item of items) {
    const subtotal = getBudgetItemSubtotalIdr(item);
    totalIdr += subtotal;
    totalsMap.set(item.category, (totalsMap.get(item.category) ?? 0) + subtotal);
  }

  const byCategory: CategoryBudgetTotal[] = BUDGET_CATEGORIES.map((category) => {
    const catTotal = totalsMap.get(category) ?? 0;
    const percentage = totalIdr > 0 ? Math.round((catTotal / totalIdr) * 1000) / 10 : 0;
    return {
      category,
      totalIdr: catTotal,
      percentage,
    };
  });

  return {
    totalIdr,
    perPersonIdr: Math.round(totalIdr / safeTravelers),
    perDayIdr: Math.round(totalIdr / safeDays),
    byCategory,
  };
}

export interface ValidationErrors {
  destination?: string;
  days?: string;
  travelers?: string;
}

export function validateTripInput(
  input: TripFormInput,
  lang: Language
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!input.destination || input.destination.trim().length < 2) {
    errors.destination =
      lang === 'id'
        ? 'Masukkan destinasi wisata yang ingin dituju (minimal 2 karakter).'
        : 'Please enter a travel destination (at least 2 characters).';
  }

  if (!Number.isInteger(input.days) || input.days < 1 || input.days > 14) {
    errors.days =
      lang === 'id'
        ? 'Durasi liburan harus antara 1 hingga 14 hari.'
        : 'Trip duration must be between 1 and 14 days.';
  }

  if (!Number.isInteger(input.travelers) || input.travelers < 1 || input.travelers > 50) {
    errors.travelers =
      lang === 'id'
        ? 'Jumlah peserta minimal 1 orang (maksimal 50).'
        : 'Number of travelers must be at least 1 (max 50).';
  }

  return errors;
}

export function getChecklistProgress(items: ChecklistItem[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  const total = items.length;
  if (total === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }
  const completed = items.filter((item) => item.checked).length;
  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

export function formatWhatsAppMessage(
  plan: TripPlan,
  currency: Currency,
  lang: Language
): string {
  const summary = calculateBudgetSummary(plan.budgetItems, plan.travelers, plan.days);
  const styleLabels: Record<TripPlan['style'], Record<Language, string>> = {
    backpacker: { id: 'Backpacker / Hemat', en: 'Backpacker / Budget' },
    standard: { id: 'Standar / Nyaman', en: 'Standard / Comfort' },
    luxury: { id: 'Mewah / Eksklusif', en: 'Luxury / Exclusive' },
  };

  const lines: string[] = [];
  if (lang === 'id') {
    lines.push(`*SmartTrip Planner — ${plan.destination}*`);
    lines.push(
      `${plan.days} Hari | ${plan.travelers} Peserta | Gaya: ${styleLabels[plan.style].id}`
    );
    lines.push('');
    lines.push(`*Ringkasan Anggaran (${currency}):*`);
    lines.push(`- Total Estimasi: ${formatCurrency(summary.totalIdr, currency)}`);
    lines.push(`- Biaya per Orang: ${formatCurrency(summary.perPersonIdr, currency)}`);
    lines.push('');
    lines.push('*Itinerary Harian:*');
  } else {
    lines.push(`*SmartTrip Planner — ${plan.destination}*`);
    lines.push(
      `${plan.days} Days | ${plan.travelers} Travelers | Style: ${styleLabels[plan.style].en}`
    );
    lines.push('');
    lines.push(`*Budget Summary (${currency}):*`);
    lines.push(`- Total Estimate: ${formatCurrency(summary.totalIdr, currency)}`);
    lines.push(`- Cost per Person: ${formatCurrency(summary.perPersonIdr, currency)}`);
    lines.push('');
    lines.push('*Daily Itinerary:*');
  }

  for (const day of plan.itinerary) {
    const dayPrefix = lang === 'id' ? `Hari ${day.day}` : `Day ${day.day}`;
    lines.push(`\n*${dayPrefix}: ${day.title}*`);
    for (const act of day.activities) {
      const costStr =
        act.estimatedCostIdr > 0
          ? ` (${formatCurrency(act.estimatedCostIdr, currency)})`
          : '';
      lines.push(`• ${act.time} - ${act.title} @ ${act.location}${costStr}`);
    }
  }

  lines.push('');
  lines.push(lang === 'id' ? '*Tips Lokal Penting:*' : '*Key Local Tips:*');
  plan.localTips.forEach((tip, idx) => {
    lines.push(`${idx + 1}. ${tip}`);
  });

  return lines.join('\n');
}

function escapeCsvField(value: string | number): string {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateTripCsv(
  plan: TripPlan,
  currency: Currency,
  lang: Language
): string {
  const rows: (string | number)[][] = [];
  const summary = calculateBudgetSummary(plan.budgetItems, plan.travelers, plan.days);

  if (lang === 'id') {
    rows.push(['Bagian', 'Hari / Kategori', 'Waktu / Satuan', 'Aktivitas / Item', 'Lokasi / Catatan', `Estimasi (${currency})`]);
  } else {
    rows.push(['Section', 'Day / Category', 'Time / Unit', 'Activity / Item', 'Location / Notes', `Estimate (${currency})`]);
  }

  for (const day of plan.itinerary) {
    const dayLabel = lang === 'id' ? `Hari ${day.day}` : `Day ${day.day}`;
    for (const act of day.activities) {
      rows.push([
        'Itinerary',
        dayLabel,
        act.time,
        act.title,
        act.location,
        formatCurrency(act.estimatedCostIdr, currency),
      ]);
    }
  }

  for (const item of plan.budgetItems) {
    const subtotal = getBudgetItemSubtotalIdr(item);
    rows.push([
      lang === 'id' ? 'Anggaran' : 'Budget',
      item.category,
      `${item.quantity} ${item.unitLabel}`,
      item.itemName,
      item.notes ?? '',
      formatCurrency(subtotal, currency),
    ]);
  }

  rows.push([
    lang === 'id' ? 'Ringkasan' : 'Summary',
    lang === 'id' ? 'Total Estimasi' : 'Total Estimate',
    `${plan.days} ${lang === 'id' ? 'Hari' : 'Days'}`,
    `${plan.travelers} ${lang === 'id' ? 'Peserta' : 'Travelers'}`,
    `${lang === 'id' ? 'Per Orang' : 'Per Person'}: ${formatCurrency(summary.perPersonIdr, currency)}`,
    formatCurrency(summary.totalIdr, currency),
  ]);

  return rows.map((row) => row.map(escapeCsvField).join(',')).join('\n');
}
