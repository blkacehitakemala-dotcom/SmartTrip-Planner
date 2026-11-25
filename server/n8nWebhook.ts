import dns from 'node:dns/promises';
import net from 'node:net';

export interface N8nTripContext {
  destination: string;
  days: number;
  travelers: number;
  style: string;
  totalEstimateIdr: number;
  summary: string;
}

export interface N8nForwardParams {
  targetUrl: string;
  authToken?: string;
  message: string;
  sessionId: string;
  language: 'id' | 'en';
  currency: 'IDR' | 'USD';
  tripContext?: N8nTripContext | null;
}

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata.google.internal',
  'metadata',
  'instance-data',
]);

function isBlockedIpv4(ip: string): boolean {
  const parts = ip.split('.').map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true;
  }
  const [a, b] = parts;
  if (a === 0) return true; // 0.0.0.0/8
  if (a === 10) return true; // 10.0.0.0/8 private
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 CGNAT
  if (a === 127) return true; // 127.0.0.0/8 loopback
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local / cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 private
  if (a === 192 && b === 168) return true; // 192.168.0.0/16 private
  if (a === 192 && b === 0 && parts[2] === 0) return true;
  if (a === 198 && (b === 18 || b === 19)) return true; // benchmark
  if (a >= 224) return true; // multicast & reserved
  return false;
}

export function isBlockedIpAddress(ip: string): boolean {
  const trimmed = ip.trim().toLowerCase().replace(/^\[|\]$/g, '');
  const version = net.isIP(trimmed);
  if (version === 4) {
    return isBlockedIpv4(trimmed);
  }
  if (version === 6) {
    if (trimmed === '::' || trimmed === '::1') return true;
    // IPv4-mapped IPv6 e.g. ::ffff:127.0.0.1
    if (trimmed.startsWith('::ffff:')) {
      const mapped = trimmed.slice('::ffff:'.length);
      if (net.isIP(mapped) === 4) {
        return isBlockedIpv4(mapped);
      }
      return true;
    }
    // Unique local fc00::/7 (fc.. / fd..) or link-local fe80::/10 (fe8.. / fe9.. / fea.. / feb..)
    if (/^(fc|fd|fe[89ab]|ff)/.test(trimmed)) return true;
    return false;
  }
  return true;
}

export function validateWebhookUrlStructure(
  rawUrl: string
): { valid: true; url: URL } | { valid: false; reason: string } {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return { valid: false, reason: 'Webhook URL is required.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { valid: false, reason: 'Invalid webhook URL format.' };
  }

  if (parsed.protocol !== 'https:') {
    return { valid: false, reason: 'Webhook URL must use HTTPS.' };
  }

  if (parsed.username || parsed.password) {
    return { valid: false, reason: 'Webhook URL must not include embedded credentials.' };
  }

  const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!host || BLOCKED_HOSTNAMES.has(host) || host.endsWith('.local') || host.endsWith('.internal')) {
    return { valid: false, reason: 'Private or local webhook hosts are not allowed.' };
  }

  if (net.isIP(host) !== 0 && isBlockedIpAddress(host)) {
    return { valid: false, reason: 'Private or loopback IP addresses are not allowed.' };
  }

  return { valid: true, url: parsed };
}

export function extractN8nReplyText(payload: unknown): string | null {
  if (payload == null) return null;

  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const extracted = extractN8nReplyText(item);
      if (extracted) return extracted;
    }
    return null;
  }

  if (typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    const preferredKeys = [
      'output',
      'reply',
      'response',
      'text',
      'message',
      'answer',
      'content',
      'result',
    ];
    for (const key of preferredKeys) {
      const val = obj[key];
      if (typeof val === 'string' && val.trim().length > 0) {
        return val.trim();
      }
    }
    if (obj.data && typeof obj.data === 'object') {
      return extractN8nReplyText(obj.data);
    }
    if (obj.json && typeof obj.json === 'object') {
      return extractN8nReplyText(obj.json);
    }
  }

  return null;
}

export async function forwardToN8nWebhook(params: N8nForwardParams): Promise<string> {
  const checked = validateWebhookUrlStructure(params.targetUrl);
  if (!checked.valid) {
    throw new Error(checked.reason);
  }

  const hostname = checked.url.hostname.replace(/^\[|\]$/g, '');
  if (net.isIP(hostname) === 0) {
    const resolved = await dns.lookup(hostname, { all: true });
    if (!resolved.length || resolved.some((entry) => isBlockedIpAddress(entry.address))) {
      throw new Error('Resolved webhook address is not a public network host.');
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain;q=0.9',
  };

  if (params.authToken && params.authToken.trim().length > 0) {
    headers.Authorization = `Bearer ${params.authToken.trim()}`;
  }

  const bodyPayload = {
    chatInput: params.message,
    message: params.message,
    sessionId: params.sessionId,
    language: params.language,
    currency: params.currency,
    source: 'smarttrip-planner',
    timestamp: new Date().toISOString(),
    tripContext: params.tripContext ?? null,
  };

  const response = await fetch(checked.url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(bodyPayload),
    redirect: 'manual',
    signal: AbortSignal.timeout(25000),
  });

  if (response.status >= 300 && response.status < 400) {
    throw new Error('Webhook redirects are not supported. Use the final HTTPS webhook URL.');
  }

  const rawText = await response.text();
  if (!response.ok) {
    throw new Error(`n8n webhook returned HTTP ${response.status}.`);
  }

  const trimmedText = rawText.trim();
  if (!trimmedText) {
    return params.language === 'id'
      ? 'Pesan diterima oleh workflow n8n, namun belum ada teks balasan yang dikembalikan.'
      : 'Message received by the n8n workflow, but no reply text was returned.';
  }

  try {
    const json = JSON.parse(trimmedText);
    const extracted = extractN8nReplyText(json);
    if (extracted) return extracted;
    return JSON.stringify(json, null, 2);
  } catch {
    return trimmedText;
  }
}
