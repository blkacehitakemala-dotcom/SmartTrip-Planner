import type { SavedStoryboardProject, ThemeMode } from '../types/storyboard';

const PROJECTS_KEY = 'storycraft_saved_projects_v1';
const THEME_KEY = 'storycraft_theme_v1';

export function loadSavedProjects(): SavedStoryboardProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProjectToStorage(
  project: SavedStoryboardProject
): SavedStoryboardProject[] {
  const existing = loadSavedProjects();
  const filtered = existing.filter((item) => item.id !== project.id);
  const updated = [project, ...filtered].slice(0, 25);
  try {
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors gracefully
  }
  return updated;
}

export function deleteProjectFromStorage(projectId: string): SavedStoryboardProject[] {
  const existing = loadSavedProjects();
  const updated = existing.filter((item) => item.id !== projectId);
  try {
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors gracefully
  }
  return updated;
}

export function loadThemePreference(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveThemePreference(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore storage errors
  }
}
