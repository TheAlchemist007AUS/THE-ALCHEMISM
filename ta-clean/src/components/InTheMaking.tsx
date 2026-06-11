import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

// ─── Rotating alchemical sigil ────────────────────────────────────────────────
function Sigil({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <circle cx="100" cy="100" r="92" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.6" />
      <circle cx="100" cy="100" r="72" stroke="hsl(var(--primary))" strokeWidth="0.4" opacity="0.35" strokeDasharray="5 4" />
      <circle cx="100" cy="100" r="50" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.25" />
      <polygon points="100,14 174,143 26,143" stroke="hsl(var(--primary))" strokeWidth="1.2" fill="none" opacity="0.65" />
      <polygon points="100,186 26,57 174,57" stroke="hsl(var(--primary))" strokeWidth="1.2" fill="none" opacity="0.40" />
      <line x1="100" y1="6"  x2="100" y2="194" stroke="hsl(var(--primary))" strokeWidth="0.4" opacity="0.18" />
      <line x1="6"   y1="100" x2="194" y2="100" stroke="hsl(var(--primary))" strokeWidth="0.4" opacity="0.18" />
      <polygon points="100,7 106,18 100,29 94,18"  fill="hsl(var(--primary))" opacity="0.75" />
      <polygon points="193,100 182,106 171,100 182,94" fill="hsl(var(--primary))" opacity="0.55" />
      <polygon points="100,193 106,182 100,171 94,182" fill="hsl(var(--primary))" opacity="0.55" />
      <polygon points="7,100 18,106 29,100 18,94"  fill="hsl(var(--primary))" opacity="0.55" />
      <circle cx="100" cy="100" r="7"   fill="hsl(var(--primary))" opacity="0.9" />
      <circle cx="100" cy="100" r="2.5" fill="hsl(var(--primary))" opacity="1"   />
    </svg>
  );
}

// ─── Particle canvas ─────────────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let raf: number;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      r: 0.5 + Math.random() * 1.4,
      op: 0.1 + Math.random() * 0.5,
      od: Math.random() > 0.5 ? 1 : -1,
    }));
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x = (p.x + p.vx + 1) % 1;
        p.y = (p.y + p.vy + 1) % 1;
        p.op += p.od * 0.004;
        if (p.op > 0.6 || p.op < 0.05) p.od *= -1;
        ctx.beginPath();
        ctx.arc(p.x * c.width, p.y * c.height, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,146,42,${p.op})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ─── Main component ───────────────────────────────────────────────────────────
interface InTheMakingProps {
  pageName: string;      // e.g. "Blog"
  pageDesc?: string;     // optional one-liner about what this page will be
}

export default function InTheMaking({ pageName, pageDesc }: InTheMakingProps) {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'hsl(var(--background))' }}
    >
      <ParticleCanvas />

      {/* Outer slow sigil */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ animation: 'spin-slow 60s linear infinite' }}
      >
        <Sigil className="w-[700px] h-[700px] opacity-10" />
      </div>

      {/* Inner counter-rotate */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ animation: 'spin-slow 36s linear infinite reverse' }}
      >
        <Sigil className="w-[380px] h-[380px] opacity-[0.07]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">

        {/* Lock icon */}
        <div
          className="mx-auto mb-8 w-20 h-20 flex items-center justify-center border border-primary/30 rounded-sm"
          style={{ background: 'rgba(201,146,42,0.06)', boxShadow: '0 0 40px rgba(201,146,42,0.15)' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-10 bg-primary opacity-50" />
          <span
            className="text-xs font-semibold tracking-[0.3em] uppercase text-primary"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            In The Making
          </span>
          <div className="h-px w-10 bg-primary opacity-50" />
        </div>

        {/* Page name */}
        <h1
          className="text-5xl md:text-7xl font-bold tracking-widest uppercase mb-6 text-foreground"
          style={{
            fontFamily: 'var(--font-heading)',
            textShadow: '0 0 60px rgba(201,146,42,0.2)',
          }}
        >
          {pageName}
        </h1>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed mb-4 text-base md:text-lg max-w-lg mx-auto">
          {pageDesc ?? 'This page is currently being built. Something great is coming.'}
        </p>

        <p
          className="text-sm font-semibold tracking-widest uppercase mb-10"
          style={{ color: 'hsl(var(--primary))', fontFamily: 'var(--font-heading)' }}
        >
          Transmute. Elevate. Dominate.
        </p>

        {/* Animated dots */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              style={{ animation: `pulse-dot 1.4s ease-in-out ${i * 0.22}s infinite` }}
            />
          ))}
        </div>

        {/* Back home */}
        <Link
          to="/"
          className="inline-block border border-primary/40 text-primary text-sm font-semibold tracking-widest uppercase px-8 py-3 transition-all duration-200 hover:bg-primary hover:text-background hover:border-primary"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          ← Return Home
        </Link>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-dot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
