import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Check,
  Loader2,
  MessageSquare,
  RotateCcw,
  Send,
  Settings,
  X,
} from 'lucide-react';
import type { Currency, Language, TripPlan } from '../types/trip';
import type { Translations } from '../i18n/translations';
import { calculateBudgetSummary } from '../utils/tripMath';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'error';
  text: string;
  timestamp: string;
}

interface N8nChatWidgetProps {
  isOpen: boolean;
  language: Language;
  currency: Currency;
  tripPlan: TripPlan | null;
  t: Translations;
  onToggleOpen: (open: boolean) => void;
}

const WEBHOOK_STORAGE_KEY = 'smarttrip_n8n_webhook_url_v1';
const SESSION_STORAGE_KEY = 'smarttrip_n8n_session_id_v1';

function createSessionId(): string {
  return `st_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function formatNowTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export function N8nChatWidget({
  isOpen,
  language,
  currency,
  tripPlan,
  t,
  onToggleOpen,
}: N8nChatWidgetProps) {
  const [serverConfigured, setServerConfigured] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [draftUrl, setDraftUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlSavedFlash, setUrlSavedFlash] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [sessionId, setSessionId] = useState<string>(() => createSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const storedUrl = window.localStorage.getItem(WEBHOOK_STORAGE_KEY) || '';
      if (storedUrl) {
        setWebhookUrl(storedUrl);
        setDraftUrl(storedUrl);
      }
      const existingSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (existingSession && /^[a-zA-Z0-9_-]{6,80}$/.test(existingSession)) {
        setSessionId(existingSession);
      } else {
        const fresh = createSessionId();
        window.localStorage.setItem(SESSION_STORAGE_KEY, fresh);
        setSessionId(fresh);
      }
    } catch {
      // Ignore storage access errors
    }

    fetch('/api/n8n-chat/config')
      .then((res) => (res.ok ? res.json() : { serverConfigured: false }))
      .then((data) => {
        setServerConfigured(Boolean(data?.serverConfigured));
      })
      .catch(() => {
        setServerConfigured(false);
      });
  }, []);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (!showSettings) {
          inputRef.current?.focus();
        }
      });
    }
  }, [isOpen, messages.length, isSending, showSettings]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onToggleOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onToggleOpen]);

  const isWebhookReady = serverConfigured || webhookUrl.trim().length > 0;

  const handleSaveWebhook = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = draftUrl.trim();
    if (!trimmed) {
      setUrlError(t.chat.invalidUrlMsg);
      return;
    }
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'https:') {
        setUrlError(t.chat.invalidUrlMsg);
        return;
      }
    } catch {
      setUrlError(t.chat.invalidUrlMsg);
      return;
    }

    setWebhookUrl(trimmed);
    setUrlError(null);
    setUrlSavedFlash(true);
    try {
      window.localStorage.setItem(WEBHOOK_STORAGE_KEY, trimmed);
    } catch {
      // Ignore storage error
    }
    setTimeout(() => {
      setUrlSavedFlash(false);
      setShowSettings(false);
    }, 900);
  };

  const handleClearWebhook = () => {
    setWebhookUrl('');
    setDraftUrl('');
    setUrlError(null);
    try {
      window.localStorage.removeItem(WEBHOOK_STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
  };

  const handleResetChat = () => {
    const fresh = createSessionId();
    setSessionId(fresh);
    setMessages([]);
    try {
      window.localStorage.setItem(SESSION_STORAGE_KEY, fresh);
    } catch {
      // Ignore storage error
    }
  };

  const sendMessage = async (rawMessage: string) => {
    const trimmed = rawMessage.trim();
    if (!trimmed || isSending) return;

    if (!isWebhookReady) {
      setShowSettings(true);
      setUrlError(t.chat.setupRequiredBanner);
      return;
    }

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: formatNowTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    const tripContext = tripPlan
      ? {
          destination: tripPlan.destination,
          days: tripPlan.days,
          travelers: tripPlan.travelers,
          style: tripPlan.style,
          totalEstimateIdr: calculateBudgetSummary(
            tripPlan.budgetItems,
            tripPlan.travelers,
            tripPlan.days
          ).totalIdr,
          summary: tripPlan.summary,
        }
      : null;

    try {
      const res = await fetch('/api/n8n-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          language,
          currency,
          tripContext,
          webhookUrl: serverConfigured ? undefined : webhookUrl,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || 'Request failed');
      }

      const replyMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: String(data.reply || ''),
        timestamp: formatNowTime(),
      };
      setMessages((prev) => [...prev, replyMsg]);
    } catch (err) {
      const errText = err instanceof Error ? err.message : 'Failed to connect to n8n webhook.';
      const errMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        role: 'error',
        text: errText,
        timestamp: formatNowTime(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleComposerSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(inputText);
  };

  const quickPrompts = tripPlan
    ? t.chat.quickPromptsWithTrip.map((tpl) =>
        tpl.replace('{destination}', tripPlan.destination)
      )
    : t.chat.quickPromptsDefault;

  return (
    <div className="no-print fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      {/* Floating Chat Trigger */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => onToggleOpen(true)}
          aria-label={t.chat.openButtonAria}
          className="inline-flex min-h-[48px] items-center gap-2.5 rounded-2xl bg-[#0284C7] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_-6px_rgba(2,132,199,0.5)] transition-colors duration-150 hover:bg-[#0369A1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2 whitespace-nowrap cursor-pointer"
        >
          <MessageSquare className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{t.chat.openButtonLabel}</span>
        </button>
      )}

      {/* Expanded Chatbox Panel */}
      {isOpen && (
        <section
          role="dialog"
          aria-label={t.chat.title}
          className="fixed inset-x-3 bottom-3 z-50 flex h-[74vh] max-h-[580px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-15px_rgba(15,23,42,0.28)] sm:static sm:inset-auto sm:h-[550px] sm:w-[396px]"
        >
          {/* Chat Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3.5">
            <div className="min-w-0">
              <h2 className="font-display text-sm font-bold text-slate-900 truncate">
                {t.chat.title}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 truncate">
                {tripPlan
                  ? `${t.chat.contextPrefix}: ${tripPlan.destination} · ${tripPlan.days} ${t.summary.daysLabel}`
                  : t.chat.subtitleDefault}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowSettings((prev) => !prev);
                  setUrlError(null);
                }}
                aria-label={t.chat.settingsAria}
                aria-expanded={showSettings}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer ${
                  showSettings
                    ? 'bg-sky-50 text-[#0284C7]'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
              </button>

              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  aria-label={t.chat.resetAria}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
              )}

              <button
                type="button"
                onClick={() => onToggleOpen(false)}
                aria-label={t.chat.closeAria}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Collapsible Webhook Configuration Panel */}
          {showSettings && (
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3.5">
              <h3 className="font-display text-xs font-bold text-slate-900">
                {t.chat.settingsHeading}
              </h3>

              {serverConfigured ? (
                <p className="mt-1.5 text-xs text-[#0F766E] leading-relaxed">
                  {t.chat.serverConfiguredNote}
                </p>
              ) : (
                <form onSubmit={handleSaveWebhook} className="mt-2 space-y-2.5">
                  <div>
                    <label
                      htmlFor="n8n-webhook-url-input"
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      {t.chat.webhookUrlLabel}
                    </label>
                    <input
                      id="n8n-webhook-url-input"
                      type="url"
                      value={draftUrl}
                      onChange={(e) => {
                        setDraftUrl(e.target.value);
                        setUrlError(null);
                      }}
                      placeholder={t.chat.webhookUrlPlaceholder}
                      className="w-full min-h-[38px] rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                    />
                    {urlError && (
                      <p role="alert" className="mt-1 text-xs font-medium text-rose-600">
                        {urlError}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                      {t.chat.webhookHint}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg bg-[#0284C7] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#0369A1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer"
                    >
                      {urlSavedFlash ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t.chat.savedWebhookMsg}</span>
                        </>
                      ) : (
                        <span>{t.chat.saveWebhookBtn}</span>
                      )}
                    </button>

                    {webhookUrl && (
                      <button
                        type="button"
                        onClick={handleClearWebhook}
                        className="inline-flex min-h-[34px] items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                      >
                        {t.chat.clearWebhookBtn}
                      </button>
                    )}
                  </div>
                </form>
              )}

              <p className="mt-2.5 border-t border-slate-200/80 pt-2 font-mono text-[11px] text-slate-500 leading-snug">
                {t.chat.payloadNote}
              </p>
            </div>
          )}

          {/* Setup Prompt Strip when unconfigured */}
          {!isWebhookReady && !showSettings && (
            <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 bg-amber-50/70 px-4 py-2.5">
              <p className="text-xs text-amber-900 leading-snug">
                {t.chat.setupRequiredBanner}
              </p>
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="rounded-lg bg-amber-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.chat.openSettingsBtn}
              </button>
            </div>
          )}

          {/* Messages Viewport */}
          <div className="flex-1 overflow-y-auto bg-[#F8FAFC] px-4 py-4 space-y-3.5">
            {/* Welcome Assistant Bubble */}
            <div className="flex justify-start">
              <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 leading-relaxed">
                {t.chat.welcomeMessage}
              </div>
            </div>

            {/* Quick Starter Prompts when fresh */}
            {messages.length === 0 && (
              <div className="flex flex-col items-start gap-1.5 pt-1">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:border-[#0284C7] hover:text-[#0284C7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Conversation History */}
            {messages.map((msg) => {
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="flex flex-col items-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#0284C7] px-3.5 py-2.5 text-sm text-white leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </div>
                    <span className="mt-1 font-mono text-[10px] tabular-nums text-slate-400">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              }

              if (msg.role === 'error') {
                return (
                  <div key={msg.id} role="alert" className="flex justify-start">
                    <div className="flex max-w-[90%] items-start gap-2 rounded-2xl rounded-tl-sm border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800 leading-relaxed">
                      <AlertCircle className="mt-0.5 h-4 w-4 text-rose-600 shrink-0" aria-hidden="true" />
                      <span className="whitespace-pre-wrap break-words">{msg.text}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex flex-col items-start">
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                    {msg.text}
                  </div>
                  <span className="mt-1 font-mono text-[10px] tabular-nums text-slate-400">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Sending Indicator */}
            {isSending && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-600">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0284C7]" aria-hidden="true" />
                  <span>{t.chat.sending}</span>
                </div>
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>

          {/* Message Composer */}
          <form
            onSubmit={handleComposerSubmit}
            className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.chat.inputPlaceholder}
              aria-label={t.chat.inputPlaceholder}
              maxLength={2000}
              disabled={isSending}
              className="flex-1 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              aria-label={t.chat.sendAria}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0284C7] text-white transition-colors hover:bg-[#0369A1] disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] cursor-pointer"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
