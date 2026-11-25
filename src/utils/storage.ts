import type { SavedTrip } from '../types/trip';

const STORAGE_KEY = 'smarttrip_saved_plans_v1';

export function loadSavedTrips(): SavedTrip[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveTripToStorage(trip: SavedTrip): SavedTrip[] {
  const existing = loadSavedTrips();
  const filtered = existing.filter((item) => item.id !== trip.id);
  const updated = [trip, ...filtered].slice(0, 20);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors gracefully
  }
  return updated;
}

export function deleteTripFromStorage(tripId: string): SavedTrip[] {
  const existing = loadSavedTrips();
  const updated = existing.filter((item) => item.id !== tripId);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors gracefully
  }
  return updated;
}
