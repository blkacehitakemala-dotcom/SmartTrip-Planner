import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import type {
  BudgetCategory,
  BudgetItem,
  ChecklistCategory,
  ChecklistItem,
  InterestKey,
  ItineraryDay,
  Language,
  TravelStyle,
  TripFormInput,
  TripPlan,
} from '../src/types/trip.ts';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const VALID_BUDGET_CATEGORIES: BudgetCategory[] = [
  'transport',
  'accommodation',
  'food',
  'activities',
  'misc',
];

const VALID_CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  'documents',
  'booking',
  'packing',
  'health',
];

const INTEREST_LABELS: Record<InterestKey, Record<Language, string>> = {
  culinary: { id: 'Kuliner', en: 'Culinary' },
  beach_nature: { id: 'Pantai & Alam', en: 'Beach & Nature' },
  history_culture: { id: 'Sejarah & Budaya', en: 'History & Culture' },
  shopping: { id: 'Belanja', en: 'Shopping' },
  photo_spots: { id: 'Spot Foto', en: 'Photo Spots' },
  snorkeling_diving: { id: 'Snorkeling/Diving', en: 'Snorkeling/Diving' },
};

const STYLE_LABELS: Record<TravelStyle, Record<Language, string>> = {
  backpacker: { id: 'Backpacker / Hemat', en: 'Backpacker / Budget' },
  standard: { id: 'Standar / Nyaman', en: 'Standard / Comfort' },
  luxury: { id: 'Mewah / Eksklusif', en: 'Luxury / Exclusive' },
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    destinationName: {
      type: Type.STRING,
      description: 'Canonical, properly capitalized destination name.',
    },
    summary: {
      type: Type.STRING,
      description: 'Concise 1-2 sentence overview of the trip plan.',
    },
    localTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Exactly 3 practical, destination-specific local tips.',
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          theme: { type: Type.STRING },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: '24h format e.g. 08:30' },
                title: { type: Type.STRING },
                location: { type: Type.STRING },
                description: { type: Type.STRING },
                category: {
                  type: Type.STRING,
                  description: 'One of: transport, accommodation, food, activities, misc',
                },
                estimatedCostIdr: {
                  type: Type.INTEGER,
                  description: 'Total estimated cost for all travelers in Indonesian Rupiah (IDR). 0 if free.',
                },
              },
              required: ['time', 'title', 'location', 'description', 'category', 'estimatedCostIdr'],
            },
          },
        },
        required: ['day', 'title', 'theme', 'activities'],
      },
    },
    budgetItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: 'One of: transport, accommodation, food, activities, misc',
          },
          itemName: { type: Type.STRING },
          unitCostIdr: {
            type: Type.INTEGER,
            description: 'Cost per single unit in Indonesian Rupiah (IDR).',
          },
          quantity: {
            type: Type.INTEGER,
            description: 'Positive integer number of units (e.g. nights, people, days).',
          },
          unitLabel: {
            type: Type.STRING,
            description: 'Short unit label in the requested language (e.g., malam/nights, orang/people, hari/days).',
          },
          notes: { type: Type.STRING },
        },
        required: ['category', 'itemName', 'unitCostIdr', 'quantity', 'unitLabel'],
      },
    },
    checklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: 'One of: documents, booking, packing, health',
          },
          label: { type: Type.STRING },
          essential: { type: Type.BOOLEAN },
        },
        required: ['category', 'label', 'essential'],
      },
    },
  },
  required: ['destinationName', 'summary', 'localTips', 'itinerary', 'budgetItems', 'checklist'],
};

async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : '';
      const isNonRetryable =
        msg.includes('API_KEY_INVALID') ||
        msg.includes('PERMISSION_DENIED') ||
        msg.includes('NOT_FOUND') ||
        msg.includes('not configured');
      if (isNonRetryable || attempt === maxAttempts) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
    }
  }
  throw lastError;
}

function normalizeBudgetCategory(raw: string): BudgetCategory {
  const lower = String(raw || '').toLowerCase().trim() as BudgetCategory;
  return VALID_BUDGET_CATEGORIES.includes(lower) ? lower : 'misc';
}

function normalizeChecklistCategory(raw: string): ChecklistCategory {
  const lower = String(raw || '').toLowerCase().trim() as ChecklistCategory;
  return VALID_CHECKLIST_CATEGORIES.includes(lower) ? lower : 'packing';
}

export async function generateTripWithGemini(
  input: TripFormInput,
  language: Language
): Promise<TripPlan> {
  const ai = getAiClient();
  const langName = language === 'id' ? 'Bahasa Indonesia' : 'English';
  const styleText = STYLE_LABELS[input.style][language];
  const interestsText =
    input.interests.length > 0
      ? input.interests.map((k) => INTEREST_LABELS[k][language]).join(', ')
      : language === 'id'
        ? 'Wisata umum & daya tarik utama'
        : 'General highlights & local favorites';

  const systemInstruction = `You are an expert travel planner and realistic travel budget estimator for both Indonesian domestic and international travelers.
Always respond with valid JSON matching the exact schema.
CRITICAL RULES:
1. Write ALL text fields (summary, localTips, itinerary titles/themes/descriptions, budget item names/unit labels/notes, checklist labels) naturally in ${langName}.
2. Express ALL monetary amounts (estimatedCostIdr and unitCostIdr) in realistic Indonesian Rupiah (IDR) integers matching the requested travel style (${styleText}).
3. Generate exactly ${input.days} days in the itinerary, with 3-4 well-paced, geographically logical activities per day.
4. Generate 6-9 comprehensive, realistic budget items covering transport, accommodation (${Math.max(1, input.days - 1)} nights for multi-day trips or 1 day-use if 1 day), food, activities, and misc for ${input.travelers} traveler(s). Ensure unitCostIdr * quantity accurately reflects the total cost for ${input.travelers} traveler(s).
5. Provide exactly 3 specific, actionable localTips for ${input.destination}.
6. Provide 8-10 practical departure checklist items across documents, booking, packing, and health tailored to ${input.destination} and the selected interests.`;

  const prompt =
    language === 'id'
      ? `Buatkan rencana perjalanan lengkap dan rincian anggaran untuk:
- Destinasi: ${input.destination}
- Durasi: ${input.days} hari
- Jumlah Peserta: ${input.travelers} orang
- Gaya Liburan: ${styleText}
- Minat Khusus: ${interestsText}`
      : `Create a complete travel itinerary, realistic budget breakdown, and departure checklist for:
- Destination: ${input.destination}
- Duration: ${input.days} days
- Travelers: ${input.travelers} people
- Travel Style: ${styleText}
- Special Interests: ${interestsText}`;

  const rawJsonText = await withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });
    const text = response.text?.trim();
    if (!text) {
      throw new Error('Empty response received from Gemini API.');
    }
    return text;
  });

  const cleanedJson = rawJsonText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const parsed = JSON.parse(cleanedJson);

  const itinerary: ItineraryDay[] = Array.isArray(parsed.itinerary)
    ? parsed.itinerary.map((dayObj: Record<string, unknown>, idx: number) => ({
        day: typeof dayObj.day === 'number' ? dayObj.day : idx + 1,
        title: String(dayObj.title || `${language === 'id' ? 'Hari' : 'Day'} ${idx + 1}`),
        theme: String(dayObj.theme || ''),
        activities: Array.isArray(dayObj.activities)
          ? dayObj.activities.map((act: Record<string, unknown>, aIdx: number) => ({
              id: `day-${idx + 1}-act-${aIdx + 1}`,
              time: String(act.time || '09:00'),
              title: String(act.title || ''),
              location: String(act.location || input.destination),
              description: String(act.description || ''),
              category: normalizeBudgetCategory(String(act.category || 'activities')),
              estimatedCostIdr: Math.max(0, Math.round(Number(act.estimatedCostIdr) || 0)),
            }))
          : [],
      }))
    : [];

  const budgetItems: BudgetItem[] = Array.isArray(parsed.budgetItems)
    ? parsed.budgetItems.map((item: Record<string, unknown>, idx: number) => ({
        id: `budget-${Date.now()}-${idx}`,
        category: normalizeBudgetCategory(String(item.category || 'misc')),
        itemName: String(item.itemName || 'Item'),
        unitCostIdr: Math.max(0, Math.round(Number(item.unitCostIdr) || 0)),
        quantity: Math.max(1, Math.round(Number(item.quantity) || 1)),
        unitLabel: String(item.unitLabel || (language === 'id' ? 'paket' : 'unit')),
        notes: item.notes ? String(item.notes) : undefined,
      }))
    : [];

  const checklist: ChecklistItem[] = Array.isArray(parsed.checklist)
    ? parsed.checklist.map((item: Record<string, unknown>, idx: number) => ({
        id: `check-${Date.now()}-${idx}`,
        category: normalizeChecklistCategory(String(item.category || 'packing')),
        label: String(item.label || ''),
        essential: Boolean(item.essential),
        checked: false,
      }))
    : [];

  const localTips: string[] = Array.isArray(parsed.localTips)
    ? parsed.localTips.slice(0, 3).map((t: unknown) => String(t))
    : [];

  const tripId = `trip-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  return {
    id: tripId,
    destination: String(parsed.destinationName || input.destination).trim(),
    days: input.days,
    travelers: input.travelers,
    style: input.style,
    interests: input.interests,
    language,
    summary: String(parsed.summary || ''),
    localTips,
    itinerary,
    budgetItems,
    initialBudgetItems: budgetItems.map((b) => ({ ...b })),
    checklist,
    createdAt: new Date().toISOString(),
  };
}
