/**
 * Client-side analytics helper — POSTs events to /api/events on the
 * Cloudflare paywall Worker, which writes them into the shared
 * Analytics Engine dataset `ath_events`.
 *
 * Imported once from BaseLayout (side-effectful: auto-fires `pageview`
 * on load and `pageview_end` on unload). Additional components can
 * import { track } to fire custom events.
 *
 * Respects DNT / GPC — no events fire when either is set.
 */

const PROPERTY = (import.meta.env.PUBLIC_ATH_PROPERTY as string | undefined) ?? 'magazine.abovethehook.com';
const ENDPOINT = (import.meta.env.PUBLIC_ATH_EVENTS_ENDPOINT as string | undefined) ?? '/api/events';

interface TrackPayload {
  session_id: string;
  event_type: string;
  property: string;
  url: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  context?: string;
  value?: number;
  duration_ms?: number;
  scroll_depth?: number;
}

const hasNavigator = typeof navigator !== 'undefined';
const hasWindow = typeof window !== 'undefined';

// DNT / GPC — either signal disables analytics entirely.
function respectsOptOut(): boolean {
  if (!hasNavigator) return true;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; doNotTrack?: string };
  if (nav.globalPrivacyControl === true) return true;
  if (nav.doNotTrack === '1') return true;
  return false;
}

function getSessionId(): string {
  try {
    const existing = sessionStorage.getItem('ath_session');
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    sessionStorage.setItem('ath_session', fresh);
    return fresh;
  } catch {
    // sessionStorage can throw in private browsing on some browsers.
    return crypto.randomUUID();
  }
}

function utmParams(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') ?? undefined,
      utm_medium: params.get('utm_medium') ?? undefined,
      utm_campaign: params.get('utm_campaign') ?? undefined,
    };
  } catch {
    return {};
  }
}

function send(payload: TrackPayload, useBeacon: boolean): void {
  const body = JSON.stringify(payload);
  try {
    if (useBeacon && hasNavigator && typeof navigator.sendBeacon === 'function') {
      // text/plain avoids a CORS preflight and is what sendBeacon does best.
      const blob = new Blob([body], { type: 'text/plain' });
      navigator.sendBeacon(ENDPOINT, blob);
      return;
    }
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      /* fail silently — analytics must never break the site */
    });
  } catch {
    /* ditto */
  }
}

export function track(
  eventType: string,
  context: Record<string, unknown> = {},
  value?: number,
): void {
  if (!hasWindow || respectsOptOut()) return;
  const payload: TrackPayload = {
    session_id: getSessionId(),
    event_type: eventType,
    property: PROPERTY,
    url: window.location.pathname,
    referrer: document.referrer || undefined,
    ...utmParams(),
    context: Object.keys(context).length ? JSON.stringify(context) : undefined,
    value,
  };
  send(payload, false);
}

function initPageLifecycle(): void {
  if (!hasWindow || respectsOptOut()) return;

  // Auto pageview on initial load.
  track('pageview');

  const pageStart = performance.now();
  let maxScroll = 0;

  const onScroll = () => {
    const body = document.body;
    const height = Math.max(body.scrollHeight, document.documentElement.scrollHeight);
    if (height <= 0) return;
    const pct = Math.min(
      100,
      Math.round(((window.scrollY + window.innerHeight) / height) * 100),
    );
    if (pct > maxScroll) maxScroll = pct;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Fire pageview_end via sendBeacon so it survives tab close.
  // `pagehide` is preferred over `beforeunload` — it also fires on
  // bfcache-eligible navigations (Safari/Firefox) where `beforeunload`
  // never runs.
  const fireEnd = () => {
    const payload: TrackPayload = {
      session_id: getSessionId(),
      event_type: 'pageview_end',
      property: PROPERTY,
      url: window.location.pathname,
      duration_ms: Math.round(performance.now() - pageStart),
      scroll_depth: maxScroll,
    };
    send(payload, true);
  };

  // Pagehide covers tab close + back-forward cache unload.
  window.addEventListener('pagehide', fireEnd, { once: true });

  // visibilitychange → hidden catches cases where the tab is backgrounded
  // and the browser will later discard it without firing pagehide
  // (notably mobile Safari). Fire once — subsequent re-show/hide won't
  // re-fire because the listener self-removes after first hidden state.
  const onVisibilityHidden = () => {
    if (document.visibilityState === 'hidden') {
      document.removeEventListener('visibilitychange', onVisibilityHidden);
      fireEnd();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityHidden);
}

initPageLifecycle();
