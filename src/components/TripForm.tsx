import type { FormEvent } from 'react';
import { Calendar, Check, Loader2, MapPin, Sparkles, Users } from 'lucide-react';
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

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.12)]"
    >
      {/* Row 1: Destination + Duration + Travelers */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Destination Input + Quick-fill chips */}
        <div className="lg:col-span-6">
          <label
            htmlFor="trip-destination"
            className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-800"
          >
            <MapPin className="h-4 w-4 text-[#0284C7]" aria-hidden="true" />
            <span>{t.form.destinationLabel}</span>
            <span className="text-rose-500" aria-hidden="true">*</span>
          </label>
          <input
            id="trip-destination"
            name="destination"
            type="text"
            required
            value={value.destination}
            onChange={(e) => onChange({ ...value, destination: e.target.value })}
            placeholder={t.form.destinationPlaceholder}
            aria-invalid={Boolean(errors.destination)}
            aria-describedby={errors.destination ? 'destination-error' : undefined}
            className={`w-full rounded-xl border bg-slate-50/70 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
              errors.destination
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-200 focus:border-[#0284C7] focus:ring-[#0284C7]/20'
            }`}
          />
          {errors.destination && (
            <p id="destination-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.destination}
            </p>
          )}

          {/* 4 Quick-fill buttons */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 mr-1">
              {t.form.quickFillLabel}
            </span>
            {QUICK_DESTINATIONS.map((dest) => {
              const selected = value.destination.trim().toLowerCase() === dest.toLowerCase();
              return (
                <button
                  key={dest}
                  type="button"
                  onClick={() => onChange({ ...value, destination: dest })}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                    selected
                      ? 'border-[#0284C7] bg-sky-50 text-[#0284C7]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {dest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration (1-14 days) */}
        <div className="lg:col-span-3">
          <label
            htmlFor="trip-days"
            className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-800"
          >
            <Calendar className="h-4 w-4 text-[#0284C7]" aria-hidden="true" />
            <span>{t.form.durationLabel}</span>
          </label>
          <div className="relative flex items-center">
            <input
              id="trip-days"
              name="days"
              type="number"
              min={1}
              max={14}
              value={Number.isNaN(value.days) ? '' : value.days}
              onChange={(e) => {
                const parsed = parseInt(e.target.value, 10);
                onChange({ ...value, days: Number.isNaN(parsed) ? 0 : parsed });
              }}
              aria-invalid={Boolean(errors.days)}
              aria-describedby={errors.days ? 'days-error' : undefined}
              className={`w-full rounded-xl border bg-slate-50/70 py-2.5 pl-4 pr-16 font-mono text-sm tabular-nums text-slate-900 transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                errors.days
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-[#0284C7] focus:ring-[#0284C7]/20'
              }`}
            />
            <span className="pointer-events-none absolute right-3.5 text-xs font-medium text-slate-500">
              {t.form.daysUnit}
            </span>
          </div>
          {errors.days && (
            <p id="days-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.days}
            </p>
          )}
        </div>

        {/* Travelers (min 1) */}
        <div className="lg:col-span-3">
          <label
            htmlFor="trip-travelers"
            className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-800"
          >
            <Users className="h-4 w-4 text-[#0284C7]" aria-hidden="true" />
            <span>{t.form.travelersLabel}</span>
          </label>
          <div className="relative flex items-center">
            <input
              id="trip-travelers"
              name="travelers"
              type="number"
              min={1}
              max={50}
              value={Number.isNaN(value.travelers) ? '' : value.travelers}
              onChange={(e) => {
                const parsed = parseInt(e.target.value, 10);
                onChange({ ...value, travelers: Number.isNaN(parsed) ? 0 : parsed });
              }}
              aria-invalid={Boolean(errors.travelers)}
              aria-describedby={errors.travelers ? 'travelers-error' : undefined}
              className={`w-full rounded-xl border bg-slate-50/70 py-2.5 pl-4 pr-16 font-mono text-sm tabular-nums text-slate-900 transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                errors.travelers
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-[#0284C7] focus:ring-[#0284C7]/20'
              }`}
            />
            <span className="pointer-events-none absolute right-3.5 text-xs font-medium text-slate-500">
              {t.form.travelersUnit}
            </span>
          </div>
          {errors.travelers && (
            <p id="travelers-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.travelers}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Travel Style + Special Interests */}
      <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 lg:grid-cols-12">
        {/* Travel Style Radio Group */}
        <fieldset className="lg:col-span-6">
          <legend className="mb-2 text-sm font-semibold text-slate-800">
            {t.form.styleLabel}
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {TRAVEL_STYLES.map((styleKey) => {
              const active = value.style === styleKey;
              const styleInfo = t.styles[styleKey];
              return (
                <button
                  key={styleKey}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange({ ...value, style: styleKey })}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                    active
                      ? 'border-[#0284C7] bg-sky-50/70 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`text-xs font-bold leading-snug ${
                      active ? 'text-[#0284C7]' : 'text-slate-800'
                    }`}
                  >
                    {styleInfo.label}
                  </span>
                  <span className="mt-1 text-[11px] leading-snug text-slate-500">
                    {styleInfo.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Special Interests Multi-Select */}
        <fieldset className="lg:col-span-6">
          <legend className="mb-2 flex items-baseline justify-between gap-2 w-full">
            <span className="text-sm font-semibold text-slate-800">
              {t.form.interestsLabel}
            </span>
            <span className="text-xs text-slate-500">{t.form.interestsOptional}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {INTEREST_KEYS.map((key) => {
              const selected = value.interests.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleInterest(key)}
                  className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    selected
                      ? 'border-[#0D9488] bg-teal-50 text-[#0D9488]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {selected && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                  <span>{t.interests[key]}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Submit Row */}
      <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0284C7] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0369A1] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>{t.form.generatingBtn}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>{t.form.generateBtn}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
