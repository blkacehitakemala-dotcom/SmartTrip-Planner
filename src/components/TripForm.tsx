import type { FormEvent } from 'react';
import { ArrowRight, Calendar, Loader2, MapPin, Minus, Plus, Users } from 'lucide-react';
import type { InterestKey, TravelStyle, TripFormInput } from '../types/trip';
import type { Translations } from '../i18n/translations';
import type { ValidationErrors } from '../utils/tripMath';
import { QUICK_DESTINATIONS } from '../data/featuredDestinations';

interface TripFormProps {
  value: TripFormInput;
  errors: ValidationErrors;
  isLoading: boolean;
  t: Translations;
  onChange: (next: TripFormInput) => void;
  onSubmit: (e: FormEvent) => void;
}

const TRAVEL_STYLES: TravelStyle[] = ['backpacker', 'standard', 'luxury'];

const INTEREST_KEYS: InterestKey[] = [
  'culinary',
  'beach_nature',
  'history_culture',
  'shopping',
  'photo_spots',
  'snorkeling_diving',
];

export function TripForm({
  value,
  errors,
  isLoading,
  t,
  onChange,
  onSubmit,
}: TripFormProps) {
  const toggleInterest = (key: InterestKey) => {
    const exists = value.interests.includes(key);
    const nextInterests = exists
      ? value.interests.filter((item) => item !== key)
      : [...value.interests, key];
    onChange({ ...value, interests: nextInterests });
  };

  const adjustDays = (delta: number) => {
    const next = Math.min(14, Math.max(1, value.days + delta));
    onChange({ ...value, days: next });
  };

  const adjustTravelers = (delta: number) => {
    const next = Math.min(50, Math.max(1, value.travelers + delta));
    onChange({ ...value, travelers: next });
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="no-print rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.12)]"
    >
      {/* Row 1: Destination, Duration, Travelers */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Destination Input */}
        <div className="lg:col-span-6">
          <label
            htmlFor="destination-input"
            className="block text-sm font-semibold text-slate-800 mb-2"
          >
            {t.form.destinationLabel} <span className="text-rose-600" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <MapPin
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="destination-input"
              type="text"
              required
              value={value.destination}
              onChange={(e) => onChange({ ...value, destination: e.target.value })}
              placeholder={t.form.destinationPlaceholder}
              aria-invalid={Boolean(errors.destination)}
              aria-describedby={errors.destination ? 'destination-error' : undefined}
              className={`w-full min-h-[44px] rounded-xl border bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 ${
                errors.destination
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-slate-200 focus:border-[#0284C7]'
              }`}
            />
          </div>

          {errors.destination && (
            <p id="destination-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.destination}
            </p>
          )}

          {/* 4 Quick-Fill Chips */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">{t.form.quickFillLabel}</span>
            {QUICK_DESTINATIONS.map((dest) => {
              const selected = value.destination.trim().toLowerCase() === dest.toLowerCase();
              return (
                <button
                  key={dest}
                  type="button"
                  onClick={() => onChange({ ...value, destination: dest })}
                  className={`min-h-[32px] rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] whitespace-nowrap shrink-0 cursor-pointer ${
                    selected
                      ? 'border-[#0284C7] bg-sky-50 text-[#0284C7]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {dest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Input (1-14 days) */}
        <div className="lg:col-span-3">
          <label
            htmlFor="duration-input"
            className="block text-sm font-semibold text-slate-800 mb-2"
          >
            {t.form.durationLabel}
          </label>
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 focus-within:border-[#0284C7] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0284C7]/20">
            <button
              type="button"
              onClick={() => adjustDays(-1)}
              disabled={value.days <= 1}
              aria-label={`Kurangi ${t.form.durationLabel}`}
              className="flex h-[44px] w-11 items-center justify-center text-slate-600 transition-colors hover:text-slate-900 disabled:opacity-40 cursor-pointer shrink-0"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="flex flex-1 items-center justify-center gap-1.5 px-1">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <input
                id="duration-input"
                type="number"
                min={1}
                max={14}
                value={value.days}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value, 10);
                  onChange({
                    ...value,
                    days: Number.isNaN(parsed) ? 1 : Math.min(14, Math.max(1, parsed)),
                  });
                }}
                className="w-11 bg-transparent text-center font-mono text-sm sm:text-base font-semibold tabular-nums text-slate-900 focus:outline-none"
              />
              <span className="text-xs text-slate-500 whitespace-nowrap">{t.form.daysUnit}</span>
            </div>
            <button
              type="button"
              onClick={() => adjustDays(1)}
              disabled={value.days >= 14}
              aria-label={`Tambah ${t.form.durationLabel}`}
              className="flex h-[44px] w-11 items-center justify-center text-slate-600 transition-colors hover:text-slate-900 disabled:opacity-40 cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          {errors.days && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.days}
            </p>
          )}
        </div>

        {/* Travelers Input (min 1) */}
        <div className="lg:col-span-3">
          <label
            htmlFor="travelers-input"
            className="block text-sm font-semibold text-slate-800 mb-2"
          >
            {t.form.travelersLabel}
          </label>
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 focus-within:border-[#0284C7] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0284C7]/20">
            <button
              type="button"
              onClick={() => adjustTravelers(-1)}
              disabled={value.travelers <= 1}
              aria-label={`Kurangi ${t.form.travelersLabel}`}
              className="flex h-[44px] w-11 items-center justify-center text-slate-600 transition-colors hover:text-slate-900 disabled:opacity-40 cursor-pointer shrink-0"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="flex flex-1 items-center justify-center gap-1.5 px-1">
              <Users className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <input
                id="travelers-input"
                type="number"
                min={1}
                max={50}
                value={value.travelers}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value, 10);
                  onChange({
                    ...value,
                    travelers: Number.isNaN(parsed) ? 1 : Math.min(50, Math.max(1, parsed)),
                  });
                }}
                className="w-11 bg-transparent text-center font-mono text-sm sm:text-base font-semibold tabular-nums text-slate-900 focus:outline-none"
              />
              <span className="text-xs text-slate-500 whitespace-nowrap">{t.form.travelersUnit}</span>
            </div>
            <button
              type="button"
              onClick={() => adjustTravelers(1)}
              disabled={value.travelers >= 50}
              aria-label={`Tambah ${t.form.travelersLabel}`}
              className="flex h-[44px] w-11 items-center justify-center text-slate-600 transition-colors hover:text-slate-900 disabled:opacity-40 cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          {errors.travelers && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.travelers}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 border-slate-100" />

      {/* Row 2: Travel Style + Interests */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Travel Style Radio Group */}
        <fieldset className="lg:col-span-6">
          <legend className="block text-sm font-semibold text-slate-800 mb-2.5">
            {t.form.styleLabel}
          </legend>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {TRAVEL_STYLES.map((styleKey) => {
              const active = value.style === styleKey;
              return (
                <button
                  key={styleKey}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange({ ...value, style: styleKey })}
                  className={`flex min-h-[44px] flex-col items-start justify-center rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer ${
                    active
                      ? 'border-[#0284C7] bg-sky-50/70 text-[#0284C7]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs sm:text-[13px] font-semibold leading-snug whitespace-nowrap">
                    {t.styles[styleKey].label}
                  </span>
                  <span className="mt-0.5 text-[11px] font-normal text-slate-500 leading-tight line-clamp-1">
                    {t.styles[styleKey].desc}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Interests Multi-Select */}
        <fieldset className="lg:col-span-6">
          <legend className="flex items-baseline gap-2 text-sm font-semibold text-slate-800 mb-2.5">
            <span>{t.form.interestsLabel}</span>
            <span className="text-xs font-normal text-slate-500">
              · {t.form.interestsOptional}
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {INTEREST_KEYS.map((key) => {
              const active = value.interests.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleInterest(key)}
                  className={`min-h-[38px] rounded-lg border px-3.5 py-1.5 text-xs sm:text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-[#0D9488] bg-teal-50 text-[#0F766E]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {t.interests[key]}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Submit Action Row */}
      <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#0284C7] px-7 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#0369A1] disabled:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2 whitespace-nowrap cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
              <span>{t.form.generatingBtn}</span>
            </>
          ) : (
            <>
              <span>{t.form.generateBtn}</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
