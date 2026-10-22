'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { site } from '@/config/site';

type Consent = 'loading' | 'pending' | 'accepted' | 'declined';
const storageKey = 'pixelconvert-analytics-consent';
const changeEvent = 'pixelconvert-analytics-choice';

function readConsent(): Consent {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value === 'accepted' || value === 'declined' ? value : 'pending';
  } catch {
    return 'pending';
  }
}

function subscribeConsent(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(changeEvent, callback);
  };
}

export default function AnalyticsConsent() {
  const stored = useSyncExternalStore(subscribeConsent, readConsent, () => 'loading');
  const [temporaryChoice, setTemporaryChoice] = useState<Consent | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const choice = temporaryChoice ?? stored;

  useEffect(() => {
    if (!site.gaMeasurementId || choice !== 'accepted' || document.getElementById('pixelconvert-ga')) return;
    const analyticsWindow = window as Window & {
      dataLayer?: unknown[][];
      gtag?: (...args: unknown[]) => void;
    };
    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    analyticsWindow.gtag = (...args) => { analyticsWindow.dataLayer?.push(args); };
    analyticsWindow.gtag('js', new Date());
    // GA4 enhanced measurement handles SPA navigation. Do not add manual page_view calls.
    analyticsWindow.gtag('config', site.gaMeasurementId);
    const script = document.createElement('script');
    script.id = 'pixelconvert-ga';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(site.gaMeasurementId)}`;
    document.head.appendChild(script);
  }, [choice]);

  if (!site.gaMeasurementId) return null;

  function choose(value: 'accepted' | 'declined') {
    const wasLoaded = Boolean(document.getElementById('pixelconvert-ga'));
    try { window.localStorage.setItem(storageKey, value); } catch { /* non-persistent preference */ }
    setTemporaryChoice(value);
    window.dispatchEvent(new Event(changeEvent));
    setSettingsOpen(false);
    // Remove the already loaded GA script/data on withdrawal, not just the banner.
    if (value === 'declined' && wasLoaded) window.location.reload();
  }

  return <>
    <button type="button" className="analytics-settings" onClick={() => setSettingsOpen(true)}>
      Analytics settings
    </button>
    {(choice === 'pending' || settingsOpen) && <section className="analytics-consent" role="region" aria-label="Analytics consent">
      <div>
        <strong>Help improve PixelConvert?</strong>
        <p>Optional Google Analytics measures visits and may set cookies. Your image files are never sent. You can change this choice here anytime.</p>
      </div>
      <div className="analytics-consent-actions">
        <button type="button" onClick={() => choose('declined')}>Reject analytics</button>
        <button type="button" className="button primary" onClick={() => choose('accepted')}>Accept analytics</button>
      </div>
    </section>}
  </>;
}
