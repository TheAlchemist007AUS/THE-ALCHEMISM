import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Nav structure ────────────────────────────────────────────────────────────
const primaryNav = [
  { href: '/',          label: 'Home' },
  { href: '/gaming',    label: 'Gaming' },
  { href: '/music',     label: 'Music' },
  { href: '/og-clan',   label: 'OG Clan' },
  { href: '/coaching',  label: 'Coaching' },
  { href: '/blog',      label: 'Blog', locked: true },
];

const moreNav = [
  { href: '/exclusive', label: 'Exclusive',          locked: true },
  { href: '/merch',     label: 'Merch' },
  { href: '/events',    label: 'Events & Collabs',   locked: true },
  { href: '/resources', label: 'Resources & Deals',  locked: true },
  { href: '/clips',     label: 'Clips & Shorts' },
];

// ─── More dropdown ────────────────────────────────────────────────────────────
function MoreDropdown({ currentPath }: { currentPath: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = moreNav.some((i) => i.href === currentPath);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative flex items-center gap-1 px-3 py-2 text-xs font-medium tracking-widest uppercase transition-colors duration-200 ${
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        More
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
        {isActive && (
          <span className="absolute bottom-0 left-3 right-3 h-px bg-primary" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' as const }}
            className="absolute right-0 top-full mt-1 w-48 border border-border bg-card shadow-xl z-50 overflow-hidden"
          >
            {moreNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-xs font-medium tracking-widest uppercase border-b border-border/50 last:border-0 transition-colors duration-150 ${
                  currentPath === item.href
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <span>{item.label}</span>
                {(item as any).locked && (
                  <span className="flex items-center gap-1 text-[9px] text-primary/50 border border-primary/20 px-1.5 py-0.5 rounded-sm leading-none tracking-wider ml-2 shrink-0">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    SOON
                  </span>
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const allNav = [...primaryNav, ...moreNav];

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                <polygon
                  points="16,2 30,28 2,28"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                  fill="none"
                  className="group-hover:drop-shadow-[0_0_6px_hsl(var(--primary))] transition-all duration-300"
                />
                <polygon
                  points="16,30 2,4 30,4"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.5"
                  className="group-hover:drop-shadow-[0_0_6px_hsl(var(--primary))] transition-all duration-300"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="3"
                  fill="hsl(var(--primary))"
                  className="group-hover:drop-shadow-[0_0_4px_hsl(var(--primary))] transition-all duration-300"
                />
              </svg>
            </div>
            <span
              className="text-lg font-bold tracking-widest text-foreground group-hover:text-primary transition-colors duration-300"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              THE ALCHEMISM
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {primaryNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative px-3 py-2 text-xs font-medium tracking-widest uppercase transition-colors duration-200 group flex items-center gap-1.5 ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                  {(item as any).locked && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  )}
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-px bg-primary transition-all duration-300 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
            <MoreDropdown currentPath={location.pathname} />
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/exclusive"
              className="hidden md:inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest uppercase border border-primary text-primary hover:bg-primary hover:text-background transition-all duration-200"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Join
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' as const }}
            className="lg:hidden border-t border-border bg-card overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-0">
              {allNav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`py-3 px-2 text-sm font-medium tracking-widest uppercase border-b border-border/50 transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/exclusive"
                className="mt-3 py-3 text-center text-xs font-semibold tracking-widest uppercase border border-primary text-primary hover:bg-primary hover:text-background transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Join the Community
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
