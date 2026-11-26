export type Language = 'id' | 'en';
export type Currency = 'IDR' | 'USD';

export type TravelStyle = 'backpacker' | 'standard' | 'luxury';

export type InterestKey =
  | 'culinary'
  | 'beach_nature'
  | 'history_culture'
  | 'shopping'
  | 'photo_spots'
  | 'snorkeling_diving';

export type BudgetCategory =
  | 'transport'
  | 'accommodation'
  | 'food'
  | 'activities'
  | 'misc';

export type ChecklistCategory =
  | 'documents'
  | 'packing'
  | 'booking'
  | 'health';

export interface TripFormInput {
  destination: string;
  days: number;
  travelers: number;
  style: TravelStyle;
  interests: InterestKey[];
}

export interface ItineraryActivity {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  category: BudgetCategory;
  estimatedCostIdr: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  theme: string;
  activities: ItineraryActivity[];
}

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  itemName: string;
  unitCostIdr: number;
  quantity: number;
  unitLabel: string;
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  label: string;
  essential: boolean;
  checked: boolean;
}

export interface TripPlan {
  id: string;
  destination: string;
  days: number;
  travelers: number;
  style: TravelStyle;
  interests: InterestKey[];
  language: Language;
  summary: string;
  localTips: string[];
  itinerary: ItineraryDay[];
  budgetItems: BudgetItem[];
  initialBudgetItems: BudgetItem[];
  checklist: ChecklistItem[];
  createdAt: string;
  isSample?: boolean;
}

export interface SavedTrip extends TripPlan {
  savedAt: string;
}

export type ResultTab = 'itinerary' | 'budget' | 'checklist';
