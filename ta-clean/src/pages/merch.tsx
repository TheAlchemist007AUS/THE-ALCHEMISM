import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import {
  ArrowRight,
  ExternalLink,
  Flame,
  Package,
  RefreshCw,
  Shield,
  ShoppingBag,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react';

const STORE_URL = 'https://thealchemist007-shop.fourthwall.com';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function AlchemicalSigil({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <circle cx="100" cy="100" r="90" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.4" />
      <polygon points="100,20 172,140 28,140" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none" opacity="0.5" />
      <polygon points="100,180 28,60 172,60" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none" opacity="0.3" />
      <circle cx="100" cy="100" r="5" fill="hsl(var(--primary))" opacity="0.7" />
    </svg>
  );
}

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MerchPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  const perks = [
    { icon: <Truck size={18} className="text-primary" />, label: 'Worldwide Shipping', desc: 'Delivered to your door anywhere on the planet.' },
    { icon: <Shield size={18} className="text-primary" />, label: 'Quality Guaranteed', desc: 'Premium materials. Every piece built to last.' },
    { icon: <RefreshCw size={18} className="text-primary" />, label: 'Easy Returns', desc: 'Hassle-free returns within 30 days.' },
    { icon: <Package size={18} className="text-primary" />, label: 'Limited Drops', desc: 'Exclusive runs. Once they\'re gone, they\'re gone.' },
  ];

  const categories = [
    { label: 'Apparel', icon: '👕', desc: 'Hoodies, tees, joggers' },
    { label: 'Accessories', icon: '🧢', desc: 'Caps, bags, gear' },
    { label: 'Collectibles', icon: '✦', desc: 'Limited edition pieces' },
    { label: 'Members Only', icon: '🔒', desc: 'Exclusive OG drops' },
  ];

  return (
    <>
      <Helmet>
        <title>Merch Store — The Alchemism</title>
        <meta name="description" content="Official Alchemism merchandise on Fourthwall. Premium apparel, accessories, and collectibles. Limited drops. Members-only exclusives." />
        <link rel="canonical" href="https://thealchemism.com/merch" />
        <meta property="og:title" content="Merch Store — The Alchemism" />
        <meta property="og:description" content="Official Alchemism merchandise. Premium apparel, accessories, and collectibles. Limited drops. Members-only exclusives." />
        <meta property="og:url" content="https://thealchemism.com/merch" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ogthealchemist.com/api/og?title=Merch+Store&description=Official+Alchemism+merchandise.+Premium+apparel+and+limited+drops." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://ogthealchemist.com/api/og?title=Merch+Store&description=Official+Alchemism+merchandise.+Premium+apparel+and+limited+drops." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: 'The Alchemism Merch Store',
          url: STORE_URL,
          description: 'Official Alchemism merchandise — premium apparel, accessories, and collectibles.',
          seller: { '@type': 'Organization', name: 'The Alchemism', url: 'https://thealchemism.com' },
        })}</script>
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/pages/merch/hero)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/65 to-background" />

        {/* Rotating sigil */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' as const }}
        >
          <AlchemicalSigil className="w-[520px] h-[520px] opacity-10" />
        </motion.div>

        {/* Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{ left: `${12 + i * 11}%`, top: `${18 + (i % 3) * 28}%` }}
            animate={{ y: [-8, 8, -8], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' as const, delay: i * 0.3 }}
          />
        ))}

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-px w-12 bg-primary" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">
              Official Store
            </span>
            <div className="h-px w-12 bg-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' as const }}
            className="text-5xl md:text-7xl font-bold tracking-widest text-foreground mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
              textShadow: '0 0 60px rgba(201,146,42,0.2)',
            }}
          >
            THE{' '}
            <span className="text-primary" style={{ textShadow: '0 0 40px rgba(201,146,42,0.5)' }}>
              MERCH
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' as const }}
            className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10"
          >
            Premium apparel, accessories, and limited collectibles. Wear the alchemy.
            Powered by Fourthwall — worldwide shipping, quality guaranteed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: 'easeOut' as const }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3 bg-primary text-background text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <ShoppingBag size={15} /> Visit The Store
            </a>
            <a
              href="#notify"
              className="flex items-center gap-2 px-8 py-3 border border-border text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
            >
              Get Drop Alerts <ArrowRight size={13} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── COMING SOON BANNER ───────────────────────────────────────────── */}
      <section className="border-y border-primary/30 bg-primary/5 py-5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 flex-wrap text-center">
            <Flame size={14} className="text-primary" />
            <p className="text-sm font-bold tracking-widest uppercase text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              Store Launching Soon
            </p>
            <span className="text-muted-foreground text-xs">—</span>
            <p className="text-xs text-muted-foreground">
              The Fourthwall store is being stocked. Sign up below to be first in line when drops go live.
            </p>
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              Preview the store <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </section>

      {/* ── WHAT'S COMING ────────────────────────────────────────────────── */}
      <section className="py-20 container mx-auto px-4">
        <FadeUp className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">
            What's Dropping
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold tracking-wider text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Collection
          </h2>
          <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">
            Four categories. Limited quantities. Built for the community that lives the alchemy.
          </p>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {categories.map((cat, i) => (
            <FadeUp key={cat.label} delay={i * 0.08}>
              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-border bg-card hover:border-primary/50 transition-all duration-300 p-6 text-center"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <p
                  className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {cat.label}
                </p>
                <p className="text-xs text-muted-foreground">{cat.desc}</p>
              </a>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── STORE EMBED / CTA ────────────────────────────────────────────── */}
      <section className="py-4 pb-20 container mx-auto px-4">
        <FadeUp>
          <div className="border border-border bg-card overflow-hidden">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <AlchemicalSigil className="w-7 h-7 opacity-60" />
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                    The Alchemism Store
                  </p>
                  <p className="text-xs text-muted-foreground">Powered by Fourthwall</p>
                </div>
              </div>
              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                Open store <ExternalLink size={11} />
              </a>
            </div>

            {/* Coming soon state */}
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' as const }}
                className="mb-8"
              >
                <AlchemicalSigil className="w-24 h-24 opacity-30" />
              </motion.div>

              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-primary" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">
                  Coming Soon
                </span>
                <Sparkles size={14} className="text-primary" />
              </div>

              <h3
                className="text-2xl font-bold text-foreground mb-3 tracking-wider"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Products Dropping Shortly
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-8">
                The store is being stocked with premium pieces. Visit the Fourthwall store directly
                to join the mailing list and be first to know when drops go live.
              </p>

              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3 bg-primary text-background text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <ShoppingBag size={15} /> Go to Fourthwall Store
              </a>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── PERKS ────────────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-border bg-card/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {perks.map((p, i) => (
              <FadeUp key={p.label} delay={i * 0.07}>
                <div className="text-center">
                  <div className="flex justify-center mb-3">{p.icon}</div>
                  <p className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                    {p.label}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERS BANNER ───────────────────────────────────────────────── */}
      <section className="py-12 border-t border-border">
        <FadeUp className="container mx-auto px-4">
          <div className="border border-primary/30 bg-primary/5 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <Zap size={22} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p
                  className="text-sm font-bold tracking-widest uppercase text-primary mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  OG Tier Members
                </p>
                <p className="text-sm text-muted-foreground max-w-md">
                  OG Tier members get early access to every drop, exclusive colourways, and
                  members-only pieces that never hit the public store.
                </p>
              </div>
            </div>
            <a
              href="/music"
              className="shrink-0 flex items-center gap-2 px-6 py-3 border border-primary text-sm font-bold tracking-widest uppercase text-primary hover:bg-primary hover:text-background transition-all duration-200"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Join OG Tier <ArrowRight size={13} />
            </a>
          </div>
        </FadeUp>
      </section>

      {/* ── DROP NOTIFY ──────────────────────────────────────────────────── */}
      <section id="notify" className="py-20 border-t border-border">
        <FadeUp className="container mx-auto px-4 max-w-xl text-center">
          <AlchemicalSigil className="w-12 h-12 mx-auto mb-6 opacity-40" />
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">
            Drop Alerts
          </p>
          <h2
            className="text-3xl font-bold tracking-widest text-foreground mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Be First In Line
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Enter your email and we'll hit you the moment new drops go live. No spam — just the
            signal when it matters.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-primary font-semibold"
            >
              <Sparkles size={16} />
              You're on the list. Watch your inbox.
            </motion.div>
          ) : (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-background text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity whitespace-nowrap"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Notify Me
              </button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4 opacity-60">
            No spam. Unsubscribe anytime.
          </p>
        </FadeUp>
      </section>
    </>
  );
}
