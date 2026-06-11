import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Lock,
  ChevronRight,
  Check,
  Youtube,
  ExternalLink,
  Headphones,
  Disc3,
  Mic2,
  Star,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Track {
  id: number;
  title: string;
  type: 'Single' | 'EP' | 'Collab' | 'Exclusive';
  duration: string;
  released: string;
  description: string;
  imageSlot: string;
  membersOnly: boolean;
  previewAvailable: boolean;
}

interface MemberTier {
  name: string;
  price: string;
  period: string;
  tag?: string;
  description: string;
  perks: string[];
  cta: string;
  featured: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const tracks: Track[] = [
  {
    id: 1,
    title: 'Transmutation',
    type: 'Single',
    duration: '3:42',
    released: 'April 2026',
    description: 'The debut single from The Alchemism. A dark, atmospheric track that sets the tone for everything that follows. Available to all.',
    imageSlot: '/images/pages/music/track-1',
    membersOnly: false,
    previewAvailable: true,
  },
  {
    id: 2,
    title: 'The Formula (EP)',
    type: 'EP',
    duration: '18:24',
    released: 'March 2026',
    description: 'Five tracks. Five elements. The first full EP from The Alchemism explores the philosophy behind the brand through sound.',
    imageSlot: '/images/pages/music/track-2',
    membersOnly: false,
    previewAvailable: true,
  },
  {
    id: 3,
    title: 'Ignition (ft. PRISM)',
    type: 'Collab',
    duration: '4:11',
    released: 'February 2026',
    description: 'A collaboration between the founder and PRISM — the OG Clan\'s resident music producer. Raw energy, refined execution.',
    imageSlot: '/images/pages/music/track-3',
    membersOnly: false,
    previewAvailable: true,
  },
  {
    id: 4,
    title: 'Inner Circle Sessions Vol. 1',
    type: 'Exclusive',
    duration: '34:08',
    released: 'Members Only',
    description: 'Unfiltered studio sessions, unreleased instrumentals, and behind-the-scenes recordings. Only available to Inner Circle members.',
    imageSlot: '/images/pages/music/track-1',
    membersOnly: true,
    previewAvailable: false,
  },
  {
    id: 5,
    title: 'Void State',
    type: 'Exclusive',
    duration: '5:55',
    released: 'Members Only',
    description: 'An unreleased ambient track created during the founding of The Alchemism. Never publicly released.',
    imageSlot: '/images/pages/music/track-2',
    membersOnly: true,
    previewAvailable: false,
  },
  {
    id: 6,
    title: 'Gold Standard (Remix)',
    type: 'Exclusive',
    duration: '4:28',
    released: 'Members Only',
    description: 'The official remix of Transmutation — darker, heavier, and built for members who want to go deeper.',
    imageSlot: '/images/pages/music/track-3',
    membersOnly: true,
    previewAvailable: false,
  },
];

const memberTiers: MemberTier[] = [
  {
    name: 'Initiate',
    price: 'FREE',
    period: '',
    description: 'Start your journey, access public content & join the community.',
    perks: [
      'Access to Respawn Hearts Discord server',
      'Access to all public music & videos',
      'Discord community access',
      'Stream notifications',
    ],
    cta: 'Join Free',
    featured: false,
  },
  {
    name: 'Tier 1 — Inner Circle',
    price: '$4',
    period: '/ month',
    description: 'Step inside the circle. Exclusive perks, badges, and community privileges.',
    perks: [
      'Exclusive emotes',
      'Bronze SIGIL/HEART badge',
      'VIP chat privileges',
      'Free access to Respawn Hearts Discord server content',
      'Free access to THE ALCHEMISM Discord server',
    ],
    cta: 'Join Inner Circle',
    featured: false,
  },
  {
    name: 'Tier 2 — Transcend',
    price: '$9',
    period: '/ month',
    tag: 'Most Popular',
    description: 'Elevate your experience. More access, more perks, more connection.',
    perks: [
      'All Tier 1 perks',
      'More emotes',
      'Silver SIGIL/HEART status',
      'Free access to songs (excl. exclusive tracks & music videos)',
      'Creator chat group',
      'Level-up competitions',
      'Locked website content',
      'Exclusive LIVE chat streams',
      '5% merch discount',
    ],
    cta: 'Transcend',
    featured: true,
  },
  {
    name: 'Tier 3 — Transform',
    price: '$15.99',
    period: '/ month',
    description: 'Full access. Maximum rewards. The complete Alchemism experience.',
    perks: [
      'All Tier 1 & 2 perks',
      'Direct shoutouts',
      'Gold SIGIL/HEART Discord role',
      'Full website access',
      'Discounts on mentoring packages',
      '10% merch discount',
      'Free merch (1 of 3 items)',
      'Early access to new songs',
      'Voting rights on releases',
      'Free entry to quarterly competitions',
      'Play games LIVE with The Alchemist',
      'Send direct messages',
      'Your content edited & uploaded',
    ],
    cta: 'Transform',
    featured: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function AlchemicalSigil({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} fill="none">
      {/* Outer circles */}
      <circle cx="100" cy="100" r="95" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.5" />
      <circle cx="100" cy="100" r="80" stroke="hsl(var(--primary))" strokeWidth="0.4" opacity="0.3" strokeDasharray="4 3" />
      <circle cx="100" cy="100" r="60" stroke="hsl(var(--primary))" strokeWidth="0.6" opacity="0.35" />
      <circle cx="100" cy="100" r="35" stroke="hsl(var(--primary))" strokeWidth="0.4" opacity="0.25" />
      {/* Star of Solomon */}
      <polygon points="100,15 172,140 28,140" stroke="hsl(var(--primary))" strokeWidth="1.2" fill="none" opacity="0.6" />
      <polygon points="100,185 28,60 172,60" stroke="hsl(var(--primary))" strokeWidth="1.2" fill="none" opacity="0.4" />
      {/* Cross hairs */}
      <line x1="100" y1="5" x2="100" y2="195" stroke="hsl(var(--primary))" strokeWidth="0.4" opacity="0.2" />
      <line x1="5" y1="100" x2="195" y2="100" stroke="hsl(var(--primary))" strokeWidth="0.4" opacity="0.2" />
      <line x1="30" y1="30" x2="170" y2="170" stroke="hsl(var(--primary))" strokeWidth="0.3" opacity="0.15" />
      <line x1="170" y1="30" x2="30" y2="170" stroke="hsl(var(--primary))" strokeWidth="0.3" opacity="0.15" />
      {/* Corner diamonds */}
      <polygon points="100,8 106,18 100,28 94,18" fill="hsl(var(--primary))" opacity="0.7" />
      <polygon points="192,100 182,106 172,100 182,94" fill="hsl(var(--primary))" opacity="0.5" />
      <polygon points="100,192 106,182 100,172 94,182" fill="hsl(var(--primary))" opacity="0.5" />
      <polygon points="8,100 18,106 28,100 18,94" fill="hsl(var(--primary))" opacity="0.5" />
      {/* Centre */}
      <circle cx="100" cy="100" r="7" fill="hsl(var(--primary))" opacity="0.9" />
      <circle cx="100" cy="100" r="3" fill="hsl(var(--primary))" opacity="1" />
    </svg>
  );
}

// ─── Animated Music Hero Canvas ───────────────────────────────────────────────
function MusicHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let frame = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Rainbow waveform colours matching the source image
    const waveColors = [
      '#ff0000', '#ff4400', '#ff8800', '#ffcc00',
      '#aaff00', '#00ff88', '#00ccff', '#0088ff',
      '#8800ff', '#ff00cc',
    ];

    // Music note characters
    const noteChars = ['♩', '♪', '♫', '♬', '𝄞', '𝄢'];

    // Pre-create floating notes
    interface Note {
      x: number; y: number; vy: number; vx: number;
      char: string; size: number; opacity: number;
      wobble: number; wobbleSpeed: number; wobbleAmp: number;
      life: number; maxLife: number;
    }

    const notes: Note[] = [];

    const spawnNote = () => {
      notes.push({
        x: 60 + Math.random() * (canvas.width - 120),
        y: canvas.height * 0.55 + (Math.random() - 0.5) * 40,
        vy: -(0.6 + Math.random() * 1.2),
        vx: (Math.random() - 0.5) * 0.5,
        char: noteChars[Math.floor(Math.random() * noteChars.length)],
        size: 18 + Math.random() * 24,
        opacity: 0,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobbleAmp: 1.5 + Math.random() * 2.5,
        life: 0,
        maxLife: 140 + Math.floor(Math.random() * 80),
      });
    };

    // Seed some initial notes
    for (let i = 0; i < 12; i++) spawnNote();

    const draw = () => {
      frame++;
      const W = canvas.width;
      const H = canvas.height;

      // Clear with slight trail
      ctx.clearRect(0, 0, W, H);

      // Black base matching the source image
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      // ── Rainbow waveform bands ──
      const waveY = H * 0.62;        // vertical centre of waveform
      const bandCount = waveColors.length;
      const bandHeight = 28;          // height of each colour band
      const totalHeight = bandCount * bandHeight;

      for (let b = 0; b < bandCount; b++) {
        const yOffset = (b - bandCount / 2) * bandHeight * 0.7;
        const phaseShift = b * 0.4;

        ctx.beginPath();
        ctx.strokeStyle = waveColors[b];
        ctx.lineWidth = bandHeight * 0.5;
        ctx.globalAlpha = 0.85;
        ctx.shadowBlur = 10;
        ctx.shadowColor = waveColors[b];

        for (let x = 0; x <= W; x += 2) {
          const t = x / W;
          // Multi-frequency wave — low freq envelope × high freq detail
          const amp1 = Math.sin(t * Math.PI * 2.5 + frame * 0.025 + phaseShift) * (totalHeight * 0.28);
          const amp2 = Math.sin(t * Math.PI * 8 + frame * 0.055 + phaseShift * 2) * (totalHeight * 0.10);
          const amp3 = Math.sin(t * Math.PI * 18 + frame * 0.09 + phaseShift * 3) * (totalHeight * 0.05);
          // Amplitude envelope — zero at edges, peak in centre
          const envelope = Math.sin(t * Math.PI);
          const y = waveY + yOffset + (amp1 + amp2 + amp3) * envelope;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // ── Spawn a new note occasionally ──
      if (frame % 18 === 0 && notes.length < 28) spawnNote();

      // ── Draw & update notes ──
      for (let i = notes.length - 1; i >= 0; i--) {
        const n = notes[i];
        n.life++;
        n.x += n.vx + Math.sin(n.wobble) * n.wobbleAmp * 0.3;
        n.y += n.vy;
        n.wobble += n.wobbleSpeed;

        // Fade in / fade out
        const progress = n.life / n.maxLife;
        if (progress < 0.15) {
          n.opacity = progress / 0.15;
        } else if (progress > 0.75) {
          n.opacity = 1 - (progress - 0.75) / 0.25;
        } else {
          n.opacity = 1;
        }

        if (n.life > n.maxLife) {
          notes.splice(i, 1);
          continue;
        }

        // White notes with subtle gold glow — matching source image
        ctx.globalAlpha = Math.max(0, n.opacity) * 0.92;
        ctx.font = `${n.size}px serif`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(201,146,42,0.7)';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(n.char, n.x + Math.sin(n.wobble) * n.wobbleAmp, n.y);
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        zIndex: 1, display: 'block',
      }}
    />
  );
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Audio Waveform Visual ────────────────────────────────────────────────────
function WaveformVisual({ playing }: { playing: boolean }) {
  const bars = 28;
  return (
    <div className="flex items-center gap-[2px] h-6">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] bg-primary rounded-full"
          animate={playing ? {
            height: ['4px', `${8 + Math.sin(i * 0.8) * 12 + Math.random() * 8}px`, '4px'],
          } : { height: '4px' }}
          transition={{
            duration: 0.6 + (i % 4) * 0.1,
            repeat: playing ? Infinity : 0,
            delay: i * 0.03,
            ease: 'easeInOut' as const,
          }}
          style={{ height: '4px' }}
        />
      ))}
    </div>
  );
}

// ─── Track Card ───────────────────────────────────────────────────────────────
function TrackCard({ track, index }: { track: Track; index: number }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const typeColors: Record<string, string> = {
    Single: 'text-primary border-primary/40',
    EP: 'text-secondary border-secondary/40',
    Collab: 'text-accent border-accent/40',
    Exclusive: 'text-primary border-primary/40',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' as const }}
      className={`group relative border bg-card transition-all duration-300 overflow-hidden ${
        track.membersOnly
          ? 'border-primary/30 hover:border-primary/60'
          : 'border-border hover:border-primary/40'
      }`}
    >
      {/* Members-only shimmer top border */}
      {track.membersOnly && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      )}

      <div className="flex gap-0">
        {/* Album art */}
        <div className="relative w-28 h-28 shrink-0 overflow-hidden">
          <img
            src={track.imageSlot}
            alt={track.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              track.membersOnly ? 'grayscale brightness-50' : 'group-hover:scale-110'
            }`}
          />
          {track.membersOnly && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Lock size={20} className="text-primary" />
            </div>
          )}
          {!track.membersOnly && track.previewAvailable && (
            <button
              onClick={() => setPlaying(!playing)}
              className="absolute inset-0 flex items-center justify-center bg-background/0 group-hover:bg-background/50 transition-all duration-300"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              <div className="w-10 h-10 border border-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/60">
                {playing
                  ? <Pause size={14} className="text-primary" />
                  : <Play size={14} className="text-primary ml-0.5" />
                }
              </div>
            </button>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold tracking-widest uppercase border px-1.5 py-0.5 ${typeColors[track.type]}`}>
                  {track.type}
                </span>
                {track.membersOnly && (
                  <span className="text-xs font-bold tracking-widest uppercase border border-primary/40 text-primary px-1.5 py-0.5 flex items-center gap-1">
                    <Lock size={9} /> Members
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{track.duration}</span>
            </div>
            <h3
              className={`text-base font-bold tracking-wide mb-1 transition-colors duration-200 ${
                track.membersOnly ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {track.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{track.description}</p>
          </div>

          <div className="flex items-center justify-between mt-3">
            {playing && !track.membersOnly ? (
              <WaveformVisual playing={playing} />
            ) : (
              <span className="text-xs text-muted-foreground">{track.released}</span>
            )}
            {track.membersOnly ? (
              <a
                href="#membership"
                className="text-xs font-semibold tracking-widest uppercase text-primary hover:underline flex items-center gap-1"
              >
                Unlock <ChevronRight size={10} />
              </a>
            ) : (
              <a
                href="#"
                className="text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                Stream <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Membership Card ──────────────────────────────────────────────────────────
function MembershipCard({ tier, index }: { tier: MemberTier; index: number }) {
  return (
    <FadeUp delay={index * 0.1} className="h-full">
      <div
        className={`relative flex flex-col h-full border p-8 transition-all duration-300 ${
          tier.featured
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/40'
        }`}
      >
        {/* Featured top accent */}
        {tier.featured && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        )}

        {tier.tag && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-primary text-background text-xs font-bold tracking-widest uppercase px-3 py-1">
              {tier.tag}
            </span>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h3
            className="text-xl font-bold tracking-widest text-foreground mb-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {tier.name}
          </h3>
          <div className="flex items-baseline gap-1 mb-3">
            <span
              className="text-4xl font-bold text-primary"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {tier.price}
            </span>
            {tier.period && (
              <span className="text-sm text-muted-foreground">{tier.period}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{tier.description}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-6" />

        {/* Perks */}
        <ul className="flex flex-col gap-3 flex-1 mb-8">
          {tier.perks.map((perk) => (
            <li key={perk} className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center border ${tier.featured ? 'border-primary bg-primary/20' : 'border-border'}`}>
                <Check size={10} className="text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{perk}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="/#join"
          className={`block text-center py-3 text-sm font-bold tracking-widest uppercase transition-all duration-200 ${
            tier.featured
              ? 'bg-primary text-background hover:opacity-90'
              : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
          }`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {tier.cta}
        </a>
      </div>
    </FadeUp>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MusicPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'public' | 'exclusive'>('all');

  const filtered = tracks.filter((t) => {
    if (activeTab === 'public') return !t.membersOnly;
    if (activeTab === 'exclusive') return t.membersOnly;
    return true;
  });

  return (
    <>
      <title>Music & Exclusive Content — The Alchemism</title>
      <meta name="description" content="Original music, exclusive sessions, and members-only content from The Alchemism. Join the Inner Circle for full access." />
      <link rel="canonical" href="https://thealchemism.com/music" />
      <meta property="og:title" content="Music & Exclusive Content — The Alchemism" />
      <meta property="og:description" content="Original music, exclusive sessions, and members-only content from The Alchemism. Join the Inner Circle for full access." />
      <meta property="og:url" content="https://thealchemism.com/music" />
      <meta property="og:type" content="music.playlist" />
      <meta property="og:image" content="https://ogthealchemist.com/api/og?title=Music+%26+Exclusive+Content&description=Original+music+and+members-only+sessions+from+The+Alchemism.&platform=soundcloud" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@TheAlchemi21261" />
      <meta name="twitter:image" content="https://ogthealchemist.com/api/og?title=Music+%26+Exclusive+Content&description=Original+music+and+members-only+sessions+from+The+Alchemism.&platform=soundcloud" />
      {/* SoundCloud / music open graph */}
      <meta property="music:musician" content="https://soundcloud.com/stuart-parker-179445015" />
      <meta name="music:song:disc" content="1" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MusicGroup",
        "name": "The Alchemism",
        "url": "https://thealchemism.com/music",
        "description": "Original music, exclusive sessions, and members-only content from The Alchemism.",
        "genre": ["Hip-Hop", "Electronic", "Alternative"]
      })}</script>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">

        {/* ── Animated music canvas ── */}
        <MusicHeroCanvas />

        {/* Dark vignette so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" style={{ zIndex: 2 }} />

        {/* Gold alchemical sigil — bright, fast */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 3 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' as const }}
        >
          <AlchemicalSigil className="w-[600px] h-[600px]" style={{ opacity: 0.45, filter: 'drop-shadow(0 0 18px rgba(201,146,42,0.9)) drop-shadow(0 0 40px rgba(201,146,42,0.5))' }} />
        </motion.div>

        {/* Counter-rotating inner sigil */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 3 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' as const }}
        >
          <AlchemicalSigil className="w-[320px] h-[320px]" style={{ opacity: 0.3, filter: 'drop-shadow(0 0 12px rgba(201,146,42,0.8))' }} />
        </motion.div>

        <div className="relative text-center px-4 max-w-3xl mx-auto" style={{ zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-px w-12 bg-primary" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">Sound & Vision</span>
            <div className="h-px w-12 bg-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' as const }}
            className="text-6xl md:text-7xl font-bold tracking-widest text-foreground mb-6"
            style={{ fontFamily: 'var(--font-heading)', textShadow: '0 0 60px rgba(201,146,42,0.4)' }}
          >
            MUSIC &{' '}
            <span className="text-primary" style={{ textShadow: '0 0 40px rgba(201,146,42,0.9)' }}>
              MEMBERS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' as const }}
            className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10"
          >
            Original tracks, exclusive studio sessions, music videos, and members-only releases. Some things are for everyone. The best things are for the Inner Circle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: 'easeOut' as const }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <a
              href="#membership"
              className="px-8 py-3 bg-primary text-background text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Join Inner Circle
            </a>
            <a
              href="#tracks"
              className="px-8 py-3 border border-border text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
            >
              Browse Music
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card/40 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              { icon: <Disc3 size={16} />, label: 'Releases', value: '12+' },
              { icon: <Headphones size={16} />, label: 'Streams', value: '180K+' },
              { icon: <Mic2 size={16} />, label: 'Collabs', value: '8' },
              { icon: <Lock size={16} />, label: 'Exclusive Tracks', value: '24+' },
              { icon: <Star size={16} />, label: 'Members', value: '3.2K' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="text-primary">{s.icon}</div>
                <div>
                  <div className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</div>
                  <div className="text-xs text-muted-foreground tracking-wide">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRACKS ───────────────────────────────────────────────────────── */}
      <section id="tracks" className="py-24 container mx-auto px-4">
        <FadeUp className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">Discography</p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-wider text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                The Music
              </h2>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center border border-border overflow-hidden">
              {(['all', 'public', 'exclusive'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-primary text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab === 'public' ? 'Public' : (
                    <span className="flex items-center gap-1"><Lock size={10} /> Members</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </FadeUp>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {filtered.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Members-only notice */}
        {activeTab !== 'public' && (
          <FadeUp delay={0.3} className="mt-8 border border-primary/20 bg-primary/5 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">3 exclusive tracks</span> are locked behind membership. Join the Inner Circle to unlock everything.
              </p>
            </div>
            <a
              href="#membership"
              className="shrink-0 px-5 py-2 bg-primary text-background text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Unlock All
            </a>
          </FadeUp>
        )}
      </section>

      {/* ── MUSIC VIDEOS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-card/20 border-y border-border">
        <div className="container mx-auto px-4">
          <FadeUp className="mb-12 text-center">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">Visual</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-wider text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Music Videos
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
              Full visual productions for select releases. Watch on YouTube or unlock the director's cut as a member.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { title: 'Transmutation — Official Video', views: '42K', duration: '4:02', imageSlot: '/images/pages/music/track-1', public: true },
              { title: 'Ignition ft. PRISM — Official Video', views: '28K', duration: '4:45', imageSlot: '/images/pages/music/track-3', public: true },
              { title: 'Void State — Director\'s Cut', views: 'Members Only', duration: '6:12', imageSlot: '/images/pages/music/track-2', public: false },
            ].map((video, i) => (
              <FadeUp key={video.title} delay={i * 0.08}>
                <div className="group border border-border bg-card hover:border-primary/40 transition-all duration-300 overflow-hidden cursor-pointer">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={video.imageSlot}
                      alt={video.title}
                      className={`w-full h-full object-cover transition-all duration-700 ${video.public ? 'group-hover:scale-105' : 'grayscale brightness-50'}`}
                    />
                    <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors duration-300" />

                    {/* Play / Lock */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {video.public ? (
                        <div className="w-12 h-12 border-2 border-primary flex items-center justify-center bg-background/60 group-hover:bg-primary transition-all duration-300">
                          <Play size={14} className="text-primary group-hover:text-background ml-0.5 transition-colors duration-300" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 border-2 border-primary/50 flex items-center justify-center bg-background/60">
                          <Lock size={14} className="text-primary" />
                        </div>
                      )}
                    </div>

                    <span className="absolute bottom-2 right-2 text-xs font-bold bg-background/80 px-1.5 py-0.5 text-foreground">
                      {video.duration}
                    </span>
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-background/70 px-2 py-0.5">
                      <Youtube size={12} className="text-red-500" />
                      <span className="text-xs text-muted-foreground">{video.views}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-200"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {video.title}
                    </h3>
                    {!video.public && (
                      <a href="#membership" className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1">
                        Unlock with membership <ChevronRight size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.3} className="text-center mt-8">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
            >
              <Youtube size={16} className="text-red-500" />
              View All on YouTube
              <ExternalLink size={12} />
            </a>
          </FadeUp>
        </div>
      </section>

      {/* ── MEMBERSHIP ───────────────────────────────────────────────────── */}
      <section id="membership" className="relative py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/pages/music/members-bg)` }}
        />
        <div className="absolute inset-0 bg-background/95" />

        <div className="relative z-10 container mx-auto px-4">
          <FadeUp className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">Access</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-wider text-foreground mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Choose Your Tier
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
              The Alchemism is free to follow. The Inner Circle is where the real work happens. Choose the level of access that's right for you.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 max-w-7xl mx-auto items-stretch">
            {memberTiers.map((tier, i) => (
              <MembershipCard key={tier.name} tier={tier} index={i} />
            ))}
          </div>

          <FadeUp delay={0.4} className="text-center mt-10">
            <p className="text-xs text-muted-foreground">
              Cancel anytime. No lock-in contracts. Questions?{' '}
              <Link to="/blog" className="text-primary hover:underline">Contact us</Link>.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border bg-card/30">
        <FadeUp className="container mx-auto px-4 text-center max-w-xl">
          <AlchemicalSigil className="w-16 h-16 mx-auto mb-6 opacity-40" />
          <h2
            className="text-3xl font-bold tracking-widest text-foreground mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Sound of The Alchemism
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Music is just one part of the formula. Explore the full universe — gaming, coaching, the OG Clan, and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/gaming"
              className="px-8 py-3 border border-border text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
            >
              Gaming Hub
            </Link>
            <Link
              to="/og-clan"
              className="px-8 py-3 border border-border text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
            >
              OG Clan
            </Link>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
