import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  Eye,
  Filter,
  Flame,
  Gamepad2,
  Heart,
  MessageCircle,
  Mic2,
  Play,
  Share2,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type ClipCategory = 'all' | 'gaming' | 'lifestyle' | 'music' | 'moments';

interface Clip {
  id: number;
  category: Exclude<ClipCategory, 'all'>;
  title: string;
  description: string;
  duration: string;
  views: string;
  likes: string;
  platform: 'twitch' | 'youtube' | 'tiktok' | 'instagram';
  tag?: string;
  featured?: boolean;
  hot?: boolean;
  imageSlot: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const clips: Clip[] = [
  {
    id: 1,
    category: 'gaming',
    title: 'The Clutch That Broke The Internet',
    description: '1v4 elimination with 3 seconds on the clock. The OG Clan goes absolutely mental.',
    duration: '0:47',
    views: '84.2K',
    likes: '6.1K',
    platform: 'twitch',
    tag: 'Top Clip',
    featured: true,
    hot: true,
    imageSlot: '/images/pages/clips/thumb-1',
  },
  {
    id: 2,
    category: 'gaming',
    title: 'Thuggy\'s Camo Build Goes Wrong',
    description: 'The most unexpected camo fail turned highlight reel. Classic Thuggy energy.',
    duration: '1:12',
    views: '41.8K',
    likes: '3.4K',
    platform: 'youtube',
    hot: true,
    imageSlot: '/images/pages/clips/thumb-2',
  },
  {
    id: 3,
    category: 'lifestyle',
    title: 'Morning Routine of a Creator',
    description: 'What the first 90 minutes of the day actually looks like when you\'re building something real.',
    duration: '2:34',
    views: '29.5K',
    likes: '2.8K',
    platform: 'tiktok',
    imageSlot: '/images/pages/clips/thumb-3',
  },
  {
    id: 4,
    category: 'moments',
    title: 'OG Clan First Win Together',
    description: 'The moment the whole squad finally clicked. This one hits different every time.',
    duration: '0:58',
    views: '67.3K',
    likes: '5.9K',
    platform: 'twitch',
    tag: 'Historic',
    hot: true,
    imageSlot: '/images/pages/clips/thumb-4',
  },
  {
    id: 5,
    category: 'lifestyle',
    title: 'The Mindset Shift That Changed Everything',
    description: 'One conversation that rewired how the whole team approaches pressure and performance.',
    duration: '1:48',
    views: '52.1K',
    likes: '4.7K',
    platform: 'instagram',
    imageSlot: '/images/pages/clips/thumb-5',
  },
  {
    id: 6,
    category: 'music',
    title: 'Making a Track From Scratch — 60 Seconds',
    description: 'From blank session to finished loop in under a minute. The alchemy in real time.',
    duration: '0:59',
    views: '38.6K',
    likes: '3.2K',
    platform: 'tiktok',
    imageSlot: '/images/pages/clips/thumb-6',
  },
  {
    id: 7,
    category: 'gaming',
    title: 'When The Callout Was Perfect',
    description: 'Comms so clean the enemy team probably heard it. Textbook OG Clan coordination.',
    duration: '0:33',
    views: '22.4K',
    likes: '1.9K',
    platform: 'twitch',
    imageSlot: '/images/pages/clips/thumb-1',
  },
  {
    id: 8,
    category: 'moments',
    title: 'The Alchemist\'s First 1000 Followers',
    description: 'The moment it stopped being a dream and started being real. Unfiltered reaction.',
    duration: '1:05',
    views: '44.7K',
    likes: '4.1K',
    platform: 'twitch',
    tag: 'Milestone',
    imageSlot: '/images/pages/clips/thumb-4',
  },
  {
    id: 9,
    category: 'lifestyle',
    title: 'Why We Don\'t Chase Clout',
    description: 'A 90-second breakdown of the philosophy that keeps The Alchemism grounded while growing.',
    duration: '1:28',
    views: '31.2K',
    likes: '3.6K',
    platform: 'instagram',
    imageSlot: '/images/pages/clips/thumb-3',
  },
  {
    id: 10,
    category: 'music',
    title: 'Unreleased Beat Preview — Inner Circle Exclusive',
    description: 'A 45-second taste of what\'s coming. Full track drops for members first.',
    duration: '0:45',
    views: '18.9K',
    likes: '2.3K',
    platform: 'youtube',
    tag: 'Members',
    imageSlot: '/images/pages/clips/thumb-6',
  },
  {
    id: 11,
    category: 'gaming',
    title: 'Squad Wipe — No Comms Needed',
    description: 'Sometimes the team is so locked in, words aren\'t required. Pure instinct.',
    duration: '0:41',
    views: '35.8K',
    likes: '2.7K',
    platform: 'twitch',
    imageSlot: '/images/pages/clips/thumb-2',
  },
  {
    id: 12,
    category: 'moments',
    title: 'The Night Everything Almost Fell Apart',
    description: 'Real talk about the moment the community nearly didn\'t make it — and what pulled it back.',
    duration: '2:11',
    views: '58.4K',
    likes: '5.2K',
    platform: 'youtube',
    tag: 'Must Watch',
    imageSlot: '/images/pages/clips/thumb-5',
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const platformConfig = {
  twitch: { label: 'Twitch', color: 'bg-purple-600', textColor: 'text-purple-400' },
  youtube: { label: 'YouTube', color: 'bg-red-600', textColor: 'text-red-400' },
  tiktok: { label: 'TikTok', color: 'bg-pink-600', textColor: 'text-pink-400' },
  instagram: { label: 'Instagram', color: 'bg-orange-500', textColor: 'text-orange-400' },
};

const categoryConfig: Record<Exclude<ClipCategory, 'all'>, { label: string; icon: React.ReactNode }> = {
  gaming: { label: 'Gaming', icon: <Gamepad2 size={12} /> },
  lifestyle: { label: 'Lifestyle', icon: <Zap size={12} /> },
  music: { label: 'Music', icon: <Mic2 size={12} /> },
  moments: { label: 'Moments', icon: <Trophy size={12} /> },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function AlchemicalSigil({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <circle cx="100" cy="100" r="90" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3" />
      <polygon points="100,20 172,140 28,140" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none" opacity="0.4" />
      <polygon points="100,180 28,60 172,60" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none" opacity="0.2" />
      <circle cx="100" cy="100" r="5" fill="hsl(var(--primary))" opacity="0.6" />
    </svg>
  );
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
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

// ─── Clip Card ────────────────────────────────────────────────────────────────
function ClipCard({ clip, index }: { clip: Clip; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [hovered, setHovered] = useState(false);
  const platform = platformConfig[clip.platform];
  const cat = categoryConfig[clip.category];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.05, ease: 'easeOut' as const }}
      className="group border border-border bg-card hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted/20">
        <img
          src={clip.imageSlot}
          alt={clip.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

        {/* Play button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            className="w-12 h-12 border-2 border-primary bg-background/60 backdrop-blur-sm flex items-center justify-center"
          >
            <Play size={18} className="text-primary ml-0.5" fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 text-xs font-bold text-foreground">
          {clip.duration}
        </div>

        {/* Hot badge */}
        {clip.hot && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-primary/90 px-2 py-0.5">
            <Flame size={9} className="text-background" />
            <span className="text-xs font-bold text-background tracking-wide">HOT</span>
          </div>
        )}

        {/* Custom tag */}
        {clip.tag && !clip.hot && (
          <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm border border-border px-2 py-0.5">
            <span className="text-xs font-bold text-foreground tracking-wide">{clip.tag}</span>
          </div>
        )}

        {/* Platform dot */}
        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${platform.color}`} />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category + platform */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            {cat.icon} {cat.label}
          </span>
          <span className={`text-xs font-bold ${platform.textColor}`}>{platform.label}</span>
        </div>

        <h3
          className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-200 mb-1.5 leading-snug"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {clip.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
          {clip.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye size={10} /> {clip.views}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart size={10} /> {clip.likes}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-muted-foreground hover:text-primary transition-colors duration-150">
              <Share2 size={12} />
            </button>
            <button className="text-muted-foreground hover:text-primary transition-colors duration-150">
              <MessageCircle size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Featured Clip ────────────────────────────────────────────────────────────
function FeaturedClip({ clip }: { clip: Clip }) {
  const [hovered, setHovered] = useState(false);
  const platform = platformConfig[clip.platform];

  return (
    <FadeUp className="relative border border-primary/30 bg-card overflow-hidden group cursor-pointer"
    >
      <div
        className="relative h-72 md:h-96 overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={clip.imageSlot}
          alt={clip.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center md:items-end md:justify-start md:p-10">
          <motion.div
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.25 }}
            className="w-16 h-16 border-2 border-primary bg-background/50 backdrop-blur-sm flex items-center justify-center"
          >
            <Play size={24} className="text-primary ml-1" fill="currentColor" />
          </motion.div>
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center gap-1 bg-primary px-3 py-1 text-xs font-bold text-background tracking-widest uppercase">
              <Flame size={10} /> Featured Clip
            </span>
            <span className={`text-xs font-bold ${platform.textColor}`}>{platform.label}</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-bold text-foreground mb-2 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {clip.title}
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mb-4 hidden md:block">
            {clip.description}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye size={11} /> {clip.views} views
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Heart size={11} /> {clip.likes} likes
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={11} /> {clip.duration}
            </span>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ClipsPage() {
  const [activeFilter, setActiveFilter] = useState<ClipCategory>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('popular');

  const filters: { id: ClipCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Clips', icon: <Zap size={12} /> },
    { id: 'gaming', label: 'Gaming', icon: <Gamepad2 size={12} /> },
    { id: 'lifestyle', label: 'Lifestyle', icon: <Users size={12} /> },
    { id: 'music', label: 'Music', icon: <Mic2 size={12} /> },
    { id: 'moments', label: 'Moments', icon: <Trophy size={12} /> },
  ];

  const featuredClip = clips.find((c) => c.featured)!;
  const gridClips = clips.filter((c) => !c.featured);

  const filtered =
    activeFilter === 'all'
      ? gridClips
      : gridClips.filter((c) => c.category === activeFilter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'popular') {
      return parseFloat(b.views) - parseFloat(a.views);
    }
    return b.id - a.id;
  });

  // Stats
  const totalViews = clips.reduce((acc, c) => {
    const n = parseFloat(c.views);
    return acc + n;
  }, 0);

  return (
    <>
      <title>Clips & Short Content — The Alchemism</title>
      <meta name="description" content="The best clips, highlights, and short-form content from The Alchemism — gaming moments, lifestyle content, music previews, and community milestones." />
      <link rel="canonical" href="https://thealchemism.com/clips" />
      <meta property="og:title" content="Clips & Short Content — The Alchemism" />
      <meta property="og:description" content="The best clips, highlights, and short-form content from The Alchemism — gaming moments, lifestyle content, music previews, and community milestones." />
      <meta property="og:url" content="https://thealchemism.com/clips" />
      <meta property="og:type" content="video.other" />
      <meta property="og:image" content="https://ogthealchemist.com/api/og?title=Clips+%26+Shorts&description=Gaming+moments%2C+lifestyle+content+and+music+previews+from+The+Alchemism.&platform=tiktok" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@TheAlchemi21261" />
      <meta name="twitter:image" content="https://ogthealchemist.com/api/og?title=Clips+%26+Shorts&description=Gaming+moments%2C+lifestyle+content+and+music+previews+from+The+Alchemism.&platform=tiktok" />
      {/* TikTok share optimisation */}
      <meta name="tiktok:creator" content="@thealchemist1086" />
      <meta property="og:video:type" content="text/html" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "VideoGallery",
        "name": "Clips & Short Content — The Alchemism",
        "url": "https://thealchemism.com/clips",
        "description": "Gaming moments, lifestyle content, music previews, and community milestones from The Alchemism.",
        "publisher": { "@type": "Organization", "name": "The Alchemism", "url": "https://thealchemism.com" }
      })}</script>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/pages/clips/hero)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/60 to-background" />

        {/* Rotating sigil */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' as const }}
        >
          <AlchemicalSigil className="w-[480px] h-[480px] opacity-10" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{ y: [-8, 8, -8], opacity: [0.2, 0.7, 0.2] }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut' as const,
              delay: i * 0.3,
            }}
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
              The Alchemism
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
            CLIPS &{' '}
            <span className="text-primary" style={{ textShadow: '0 0 40px rgba(201,146,42,0.5)' }}>
              SHORTS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' as const }}
            className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10"
          >
            The raw moments, the highlights, the milestones. Short-form content from across The
            Alchemism universe — gaming, lifestyle, music, and everything in between.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: 'easeOut' as const }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <a
              href="#clips"
              className="px-8 py-3 bg-primary text-background text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Watch Now
            </a>
            <Link
              to="/gaming"
              className="px-8 py-3 border border-border text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
            >
              Full Streams
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card/40 py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              { value: `${Math.round(totalViews)}K+`, label: 'Total views' },
              { value: `${clips.length}+`, label: 'Clips available' },
              { value: '4', label: 'Platforms' },
              { value: 'Weekly', label: 'New drops' },
              { value: '60s', label: 'Avg clip length' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED CLIP ────────────────────────────────────────────────── */}
      <section className="py-16 container mx-auto px-4">
        <FadeUp className="flex items-center gap-3 mb-8">
          <Flame size={16} className="text-primary" />
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Featured</p>
        </FadeUp>
        <FeaturedClip clip={featuredClip} />
      </section>

      {/* ── CLIPS GRID ───────────────────────────────────────────────────── */}
      <section id="clips" className="pb-24 container mx-auto px-4">
        {/* Controls */}
        <FadeUp className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-2">
              All Content
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-wider text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Browse Clips
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Sort */}
            <div className="flex items-center border border-border overflow-hidden">
              {(['popular', 'recent'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 ${
                    sortBy === s ? 'bg-muted/40 text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s === 'popular' ? <TrendingUp size={10} /> : <Clock size={10} />}
                  {s === 'popular' ? 'Popular' : 'Recent'}
                </button>
              ))}
            </div>

            {/* Filter icon label */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter size={11} />
              <span className="tracking-wide">Filter:</span>
            </div>
          </div>
        </FadeUp>

        {/* Category filters */}
        <FadeUp delay={0.05} className="flex items-center gap-2 flex-wrap mb-8">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-widest uppercase border transition-all duration-200 ${
                activeFilter === f.id
                  ? 'bg-primary border-primary text-background'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </FadeUp>

        {/* Platform legend */}
        <FadeUp delay={0.08} className="flex items-center gap-4 flex-wrap mb-10">
          {Object.entries(platformConfig).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${val.color}`} />
              <span className="text-xs text-muted-foreground">{val.label}</span>
            </div>
          ))}
        </FadeUp>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${sortBy}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {sorted.map((clip, i) => (
              <ClipCard key={clip.id} clip={clip} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {sorted.length === 0 && (
          <div className="text-center py-20 text-muted-foreground text-sm">
            No clips in this category yet. Check back soon.
          </div>
        )}
      </section>

      {/* ── PLATFORM LINKS ───────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border bg-card/10">
        <div className="container mx-auto px-4">
          <FadeUp className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">
              Follow The Alchemism
            </p>
            <h2
              className="text-3xl font-bold tracking-wider text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Watch Live & Follow Along
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { platform: 'Twitch', color: 'border-purple-500/30 hover:border-purple-500/60', text: 'text-purple-400', desc: 'Live streams & VODs', icon: '🎮' },
              { platform: 'YouTube', color: 'border-red-500/30 hover:border-red-500/60', text: 'text-red-400', desc: 'Long-form content', icon: '▶' },
              { platform: 'TikTok', color: 'border-pink-500/30 hover:border-pink-500/60', text: 'text-pink-400', desc: 'Short clips & trends', icon: '♪' },
              { platform: 'Instagram', color: 'border-orange-500/30 hover:border-orange-500/60', text: 'text-orange-400', desc: 'Behind the scenes', icon: '◈' },
            ].map((p, i) => (
              <FadeUp key={p.platform} delay={i * 0.08}>
                <div className={`border bg-card p-5 text-center transition-all duration-300 cursor-pointer group ${p.color}`}>
                  <div className={`text-2xl mb-3 ${p.text}`}>{p.icon}</div>
                  <p className={`text-sm font-bold mb-1 ${p.text}`} style={{ fontFamily: 'var(--font-heading)' }}>
                    {p.platform}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERS CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <FadeUp className="container mx-auto px-4 max-w-2xl text-center">
          <AlchemicalSigil className="w-14 h-14 mx-auto mb-6 opacity-40" />
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-4">
            Members Get More
          </p>
          <h2
            className="text-3xl font-bold tracking-widest text-foreground mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Exclusive Clips & Early Access
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Inner Circle and OG Tier members get access to uncut streams, behind-the-scenes clips,
            unreleased music previews, and content that never makes it to public platforms.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/exclusive"
              className="flex items-center gap-2 px-8 py-3 bg-primary text-background text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Sparkles size={14} /> Unlock The Vault
            </Link>
            <Link
              to="/gaming"
              className="flex items-center gap-2 px-8 py-3 border border-border text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
            >
              Gaming Hub <ArrowRight size={13} />
            </Link>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
