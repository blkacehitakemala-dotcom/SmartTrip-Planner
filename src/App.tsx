import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AlertCircle, Calculator, CheckSquare, Map } from 'lucide-react';
import type {
  BudgetItem,
  ChecklistItem,
  Currency,
  Language,
  ResultTab,
  SavedTrip,
  TripFormInput,
  TripPlan,
} from './types/trip';
import { TRANSLATIONS } from './i18n/translations';
import {
  formatWhatsAppMessage,
  generateTripCsv,
  validateTripInput,
  type ValidationErrors,
} from './utils/tripMath';
import {
  deleteTripFromStorage,
  loadSavedTrips,
  saveTripToStorage,
} from './utils/storage';
import {
  createSamplePlan,
  type FeaturedDestination,
} from './data/featuredDestinations';
import { Header } from './components/Header';
import { TripForm } from './components/TripForm';
import { EmptyStateShowcase } from './components/EmptyStateShowcase';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { TripSummaryCard } from './components/TripSummaryCard';
import { ActionToolbar } from './components/ActionToolbar';
import { ItineraryTab } from './components/ItineraryTab';
import { BudgetTab } from './components/BudgetTab';
import { ChecklistTab } from './components/ChecklistTab';
import { SavedPlansDrawer } from './components/SavedPlansDrawer';
import { Footer } from './components/Footer';
import { N8nChatWidget } from './components/N8nChatWidget';

const DEFAULT_FORM: TripFormInput = {
  destination: '',
  days: 3,
  travelers: 2,
  style: 'standard',
  interests: [],
};

export default function App() {
  const [language, setLanguage] = useState<Language>('id');
  const [currency, setCurrency] = useState<Currency>('IDR');
  const [formInput, setFormInput] = useState<TripFormInput>(DEFAULT_FORM);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [activeTab, setActiveTab] = useState<ResultTab>('itinerary');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCurrentSaved, setIsCurrentSaved] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    setSavedTrips(loadSavedTrips());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const scrollToResults = () => {
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleLanguageChange = (nextLang: Language) => {
    setLanguage(nextLang);
    // Keep sample plan localized immediately if user is currently previewing the sample plan
    if (tripPlan?.isSample) {
      setTripPlan(createSamplePlan(nextLang));
      setIsCurrentSaved(false);
    }
    // Re-translate active validation messages if visible
    if (Object.keys(formErrors).length > 0) {
      setFormErrors(validateTripInput(formInput, nextLang));
    }
  };

  const runGenerateTrip = async (input: TripFormInput) => {
    const errors = validateTripInput(input, language);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setApiError(null);
    setIsLoading(true);
    setIsCurrentSaved(false);
    setCopiedWhatsApp(false);

    if (window.innerWidth < 1024) {
      scrollToResults();
    }

    try {
      const response = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: input.destination.trim(),
          days: input.days,
          travelers: input.travelers,
          style: input.style,
          interests: input.interests,
          language,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || t.error.fallbackMsg);
      }

      setTripPlan(payload as TripPlan);
      setActiveTab('itinerary');
      scrollToResults();
    } catch (err) {
      const message = err instanceof Error ? err.message : t.error.fallbackMsg;
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    void runGenerateTrip(formInput);
  };

  const handleFormChange = (next: TripFormInput) => {
    setFormInput(next);
    if (Object.keys(formErrors).length > 0) {
      setFormErrors(validateTripInput(next, language));
    }
  };

  const handleSelectFeaturedDestination = (dest: FeaturedDestination) => {
    setFormInput({
      ...formInput,
      destination: dest.name,
      days: dest.suggestedDays,
      interests: dest.suggestedInterests,
    });
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviewSample = () => {
    const sample = createSamplePlan(language);
    setTripPlan(sample);
    setFormInput({
      destination: sample.destination,
      days: sample.days,
      travelers: sample.travelers,
      style: sample.style,
      interests: sample.interests,
    });
    setFormErrors({});
    setApiError(null);
    setActiveTab('itinerary');
    setIsCurrentSaved(savedTrips.some((s) => s.id === sample.id));
    scrollToResults();
  };

  const handleUpdateBudgetItems = (nextItems: BudgetItem[]) => {
    if (!tripPlan) return;
    setTripPlan({ ...tripPlan, budgetItems: nextItems });
    setIsCurrentSaved(false);
  };

  const handleUpdateChecklist = (nextChecklist: ChecklistItem[]) => {
    if (!tripPlan) return;
    setTripPlan({ ...tripPlan, checklist: nextChecklist });
    setIsCurrentSaved(false);
  };

  const handleSavePlan = () => {
    if (!tripPlan) return;
    const savedEntry: SavedTrip = {
      ...tripPlan,
      savedAt: new Date().toISOString(),
    };
    const updated = saveTripToStorage(savedEntry);
    setSavedTrips(updated);
    setIsCurrentSaved(true);
  };

  const handleLoadSavedTrip = (trip: SavedTrip) => {
    setTripPlan(trip);
    setFormInput({
      destination: trip.destination,
      days: trip.days,
      travelers: trip.travelers,
      style: trip.style,
      interests: trip.interests,
    });
    setApiError(null);
    setActiveTab('itinerary');
    setIsCurrentSaved(true);
    scrollToResults();
  };

  const handleDeleteSavedTrip = (tripId: string) => {
    const updated = deleteTripFromStorage(tripId);
    setSavedTrips(updated);
    if (tripPlan?.id === tripId) {
      setIsCurrentSaved(false);
    }
  };

  const handleCopyWhatsApp = async () => {
    if (!tripPlan) return;
    const text = formatWhatsAppMessage(tripPlan, currency, language);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
      }
      setCopiedWhatsApp(true);
      setTimeout(() => setCopiedWhatsApp(false), 2500);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  const handleDownloadCsv = () => {
    if (!tripPlan) return;
    const csv = generateTripCsv(tripPlan, currency, language);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const slug = tripPlan.destination
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `smarttrip-${slug || 'plan'}-${currency.toLowerCase()}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const tabs: { id: ResultTab; label: string; icon: typeof Map }[] = [
    { id: 'itinerary', label: t.tabs.itinerary, icon: Map },
    { id: 'budget', label: t.tabs.budget, icon: Calculator },
    { id: 'checklist', label: t.tabs.checklist, icon: CheckSquare },
  ];

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <Header
        language={language}
        currency={currency}
        savedCount={savedTrips.length}
        t={t}
        onLanguageChange={handleLanguageChange}
        onCurrencyChange={setCurrency}
        onOpenSaved={() => setIsDrawerOpen(true)}
      />

      {/* Full-Bleed Tropical Beach Hero Backdrop */}
      <section className="no-print relative overflow-hidden bg-[#0F172A]">
        <img
          src="/src/assets/images/hero_travel_backdrop_1795580945727.jpg"
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Soft dark overlay: rgba(15, 23, 42, 0.55) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[rgba(15,23,42,0.55)]"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-6 sm:pt-14 sm:pb-28 lg:px-8">
          <div className="max-w-3xl">
            <h1
              className="font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-[1.15]"
              style={{ textWrap: 'balance' }}
            >
              {t.heroTitle}
            </h1>
            <p className="mt-3.5 max-w-2xl text-base sm:text-lg text-slate-100 leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <main className="relative z-20 mx-auto w-full max-w-6xl flex-1 px-4 pb-8 sm:px-6 lg:px-8">
        {/* Overlapping White Form Card */}
        <section aria-label="Trip Planner Form" className="-mt-16 sm:-mt-20 mb-10">
          <TripForm
            value={formInput}
            errors={formErrors}
            isLoading={isLoading}
            t={t}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
          />
        </section>

        {/* Results Anchor */}
        <div ref={resultsRef} id="results-section" className="scroll-mt-20">
          {/* Error Banner */}
          {apiError && !isLoading && (
            <div
              role="alert"
              className="no-print mb-6 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600 shrink-0" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-sm font-bold text-rose-900">
                    {t.error.title}
                  </h2>
                  <p className="mt-0.5 text-sm text-rose-800">{apiError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void runGenerateTrip(formInput)}
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-rose-700 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.error.retryBtn}
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && <LoadingSkeleton t={t} />}

          {/* Empty State */}
          {!isLoading && !tripPlan && (
            <EmptyStateShowcase
              language={language}
              t={t}
              onSelectDestination={handleSelectFeaturedDestination}
              onPreviewSample={handlePreviewSample}
            />
          )}

          {/* Populated Results */}
          {!isLoading && tripPlan && (
            <div className="space-y-6">
              <TripSummaryCard plan={tripPlan} currency={currency} t={t} />

              <ActionToolbar
                isSaved={isCurrentSaved}
                copiedWhatsApp={copiedWhatsApp}
                t={t}
                onSave={handleSavePlan}
                onCopyWhatsApp={() => void handleCopyWhatsApp()}
                onDownloadCsv={handleDownloadCsv}
                onPrintPdf={handlePrintPdf}
              />

              {/* Main Tabbed Workspace Card */}
              <section className="print-flat rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_20px_-8px_rgba(15,23,42,0.08)]">
                {/* Tab Navigation */}
                <div
                  role="tablist"
                  aria-label="Trip plan sections"
                  className="no-print flex items-center gap-1 overflow-x-auto border-b border-slate-200 px-4 pt-3 sm:px-6"
                >
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        id={`tab-${tab.id}`}
                        aria-selected={active}
                        aria-controls={`panel-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative inline-flex min-h-[44px] items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0284C7] whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'border-[#0284C7] text-[#0284C7]'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Tab Panel */}
                <div className="p-5 sm:p-7">
                  <div
                    role="tabpanel"
                    id="panel-itinerary"
                    aria-labelledby="tab-itinerary"
                    className={activeTab === 'itinerary' ? 'block' : 'hidden print:block'}
                  >
                    <ItineraryTab
                      itinerary={tripPlan.itinerary}
                      currency={currency}
                      t={t}
                    />
                  </div>

                  <div
                    role="tabpanel"
                    id="panel-budget"
                    aria-labelledby="tab-budget"
                    className={
                      activeTab === 'budget'
                        ? 'block'
                        : 'hidden print:block print:mt-8 print:pt-6 print:border-t print:border-slate-300'
                    }
                  >
                    <BudgetTab
                      items={tripPlan.budgetItems}
                      initialItems={tripPlan.initialBudgetItems}
                      travelers={tripPlan.travelers}
                      days={tripPlan.days}
                      currency={currency}
                      t={t}
                      onUpdateItems={handleUpdateBudgetItems}
                    />
                  </div>

                  <div
                    role="tabpanel"
                    id="panel-checklist"
                    aria-labelledby="tab-checklist"
                    className={activeTab === 'checklist' ? 'block' : 'hidden'}
                  >
                    <ChecklistTab
                      items={tripPlan.checklist}
                      t={t}
                      onUpdateItems={handleUpdateChecklist}
                    />
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer t={t} onOpenChat={() => setIsChatOpen(true)} />

      <SavedPlansDrawer
        isOpen={isDrawerOpen}
        savedTrips={savedTrips}
        currency={currency}
        language={language}
        t={t}
        onClose={() => setIsDrawerOpen(false)}
        onLoadTrip={handleLoadSavedTrip}
        onDeleteTrip={handleDeleteSavedTrip}
      />

      <N8nChatWidget
        isOpen={isChatOpen}
        language={language}
        currency={currency}
        tripPlan={tripPlan}
        t={t}
        onToggleOpen={setIsChatOpen}
      />
    </div>
  );
}
