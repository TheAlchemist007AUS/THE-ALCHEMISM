import { useState, useEffect } from 'react';

const CONSENT_KEY = 'cookie-consent';

function initAnalytics(): void {
  const domain = 'thealchemism.com';
  if (document.querySelector(`script[data-domain="${domain}"]`)) return;
  const s = document.createElement('script');
  s.defer = true;
  s.dataset.domain = domain;
  s.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(s);
  window.dispatchEvent(new Event('cookie-consent-accepted'));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') { initAnalytics(); return; }
    if (consent === 'declined') return;
    setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
    initAnalytics();
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border p-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          We use analytics to improve your experience.{' '}
          <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>
        </p>
        <div className="flex gap-3 shrink-0">
          <button onClick={decline} className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground transition-colors">
            Decline
          </button>
          <button onClick={accept} className="px-4 py-2 text-sm bg-primary text-background hover:opacity-90 transition-opacity">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
