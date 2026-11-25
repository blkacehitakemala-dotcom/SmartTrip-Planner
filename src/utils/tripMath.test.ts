import test from 'node:test';
import assert from 'node:assert/strict';
import {
  USD_EXCHANGE_RATE,
  calculateBudgetSummary,
  convertCurrencyValueToIdr,
  convertIdrToCurrencyValue,
  formatCurrency,
  formatWhatsAppMessage,
  generateTripCsv,
  getChecklistProgress,
  validateTripInput,
} from './tripMath';
import type { BudgetItem, TripPlan } from '../types/trip';

test('formatCurrency formats IDR with dot thousands separator', () => {
  assert.equal(formatCurrency(1500000, 'IDR'), 'Rp 1.500.000');
  assert.equal(formatCurrency(0, 'IDR'), 'Rp 0');
  assert.equal(formatCurrency(75000, 'IDR'), 'Rp 75.000');
});

test('formatCurrency converts IDR to USD using 16,000 exchange rate', () => {
  assert.equal(USD_EXCHANGE_RATE, 16000);
  assert.equal(formatCurrency(1600000, 'USD'), '$100');
  assert.equal(formatCurrency(1500000, 'USD'), '$93.75');
  assert.equal(formatCurrency(16000000, 'USD'), '$1,000');
});

test('currency roundtrip conversion preserves values accurately', () => {
  assert.equal(convertIdrToCurrencyValue(320000, 'USD'), 20);
  assert.equal(convertCurrencyValueToIdr(20, 'USD'), 320000);
  assert.equal(convertIdrToCurrencyValue(250000, 'IDR'), 250000);
  assert.equal(convertCurrencyValueToIdr(250000, 'IDR'), 250000);
});

test('calculateBudgetSummary sums subtotals, per-person, per-day, and category shares', () => {
  const items: BudgetItem[] = [
    {
      id: 'b1',
      category: 'accommodation',
      itemName: 'Hotel',
      unitCostIdr: 600000,
      quantity: 2,
      unitLabel: 'malam',
    },
    {
      id: 'b2',
      category: 'food',
      itemName: 'Meals',
      unitCostIdr: 150000,
      quantity: 4,
      unitLabel: 'hari',
    },
    {
      id: 'b3',
      category: 'transport',
      itemName: 'Ferry',
      unitCostIdr: 100000,
      quantity: 2,
      unitLabel: 'orang',
    },
  ];

  const summary = calculateBudgetSummary(items, 2, 2);
  assert.equal(summary.totalIdr, 2000000);
  assert.equal(summary.perPersonIdr, 1000000);
  assert.equal(summary.perDayIdr, 1000000);

  const acc = summary.byCategory.find((c) => c.category === 'accommodation');
  assert.equal(acc?.totalIdr, 1200000);
  assert.equal(acc?.percentage, 60);

  const food = summary.byCategory.find((c) => c.category === 'food');
  assert.equal(food?.totalIdr, 600000);
  assert.equal(food?.percentage, 30);
});

test('validateTripInput rejects invalid fields and accepts valid input', () => {
  const invalidEmpty = validateTripInput(
    { destination: ' ', days: 3, travelers: 2, style: 'standard', interests: [] },
    'id'
  );
  assert.ok(invalidEmpty.destination);
  assert.equal(invalidEmpty.days, undefined);

  const invalidRange = validateTripInput(
    { destination: 'Bali', days: 15, travelers: 0, style: 'luxury', interests: [] },
    'en'
  );
  assert.equal(invalidRange.destination, undefined);
  assert.ok(invalidRange.days);
  assert.ok(invalidRange.travelers);

  const valid = validateTripInput(
    { destination: 'Pulau Sabang', days: 3, travelers: 2, style: 'standard', interests: ['culinary'] },
    'id'
  );
  assert.deepEqual(valid, {});
});

test('getChecklistProgress computes completion percentage cleanly', () => {
  assert.deepEqual(getChecklistProgress([]), { completed: 0, total: 0, percentage: 0 });
  const progress = getChecklistProgress([
    { id: '1', category: 'documents', label: 'KTP', essential: true, checked: true },
    { id: '2', category: 'packing', label: 'Sunscreen', essential: false, checked: false },
    { id: '3', category: 'booking', label: 'Ferry', essential: true, checked: true },
    { id: '4', category: 'health', label: 'P3K', essential: false, checked: false },
  ]);
  assert.deepEqual(progress, { completed: 2, total: 4, percentage: 50 });
});

test('exporters format WhatsApp and CSV outputs with active currency and CSV escaping', () => {
  const plan: TripPlan = {
    id: 'test-1',
    destination: 'Pulau Sabang, Aceh',
    days: 2,
    travelers: 2,
    style: 'standard',
    interests: ['beach_nature'],
    language: 'id',
    summary: 'Liburan singkat ke Sabang.',
    localTips: ['Bawa uang tunai secukupnya', 'Pesan kapal cepat lebih awal', 'Gunakan tabir surya'],
    itinerary: [
      {
        day: 1,
        title: 'Tiba & Pantai Iboih',
        theme: 'Pantai',
        activities: [
          {
            id: 'a1',
            time: '09:00',
            title: 'Snorkeling, Pulau Rubiah',
            location: 'Iboih',
            description: 'Eksplorasi terumbu karang.',
            category: 'activities',
            estimatedCostIdr: 320000,
          },
        ],
      },
    ],
    budgetItems: [
      {
        id: 'b1',
        category: 'activities',
        itemName: 'Snorkeling, "Rubiah"',
        unitCostIdr: 160000,
        quantity: 2,
        unitLabel: 'orang',
      },
    ],
    initialBudgetItems: [],
    checklist: [],
    createdAt: '2026-11-24T00:00:00.000Z',
  };

  const waUsd = formatWhatsAppMessage(plan, 'USD', 'en');
  assert.ok(waUsd.includes('$20'));
  assert.ok(waUsd.includes('Pulau Sabang, Aceh'));

  const csvIdr = generateTripCsv(plan, 'IDR', 'id');
  assert.ok(csvIdr.includes('"Snorkeling, Pulau Rubiah"'));
  assert.ok(csvIdr.includes('"Snorkeling, ""Rubiah"""'));
  assert.ok(csvIdr.includes('Rp 320.000'));
});
