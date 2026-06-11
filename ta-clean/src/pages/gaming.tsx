import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Twitch,
  Youtube,
  Radio,
  Monitor,
  Clock,
  Star,
  ChevronRight,
  ExternalLink,
  Flame,
  Trophy,
  Zap,
  Filter } from
'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface GameReview {
  id: number;
  title: string;
  genre: string;
  rating: number;
  platform: string[];
  summary: string;
  verdict: string;
  imageSlot: string;
  tag?: string;
}

interface StreamEntry {
  platform: 'Twitch' | 'YouTube' | 'TikTok' | 'Kick';
  day: string;
  time: string;
  content: string;
  description: string;
  live: boolean;
  icon: React.ReactNode;
  href: string;
}

interface ClipEntry {
  title: string;
  platform: string;
  views: string;
  duration: string;
  game: string;
  imageSlot: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const streamSchedule: StreamEntry[] = [
{
  platform: 'Twitch',
  day: 'Monday',
  time: '8:00 PM AWST',
  content: 'Variety Stream',
  description: 'Open variety — whatever\'s in rotation. Chat picks the vibe.',
  live: false,
  icon: <Twitch size={18} />,
  href: 'https://twitch.tv/thealchemist007'
},
{
  platform: 'YouTube',
  day: 'Wednesday',
  time: '7:00 PM AWST',
  content: 'Game Reviews & Reactions',
  description: 'Deep-dive reviews, first impressions, and hot takes on new releases.',
  live: false,
  icon: <Youtube size={18} />,
  href: 'https://www.youtube.com/@thealchemism'
},
{
  platform: 'Twitch',
  day: 'Friday',
  time: '9:00 PM AWST',
  content: 'Community Night',
  description: 'The OG Clan goes live with the community. Collabs, challenges, chaos.',
  live: true,
  icon: <Twitch size={18} />,
  href: 'https://twitch.tv/thealchemist007'
},
{
  platform: 'TikTok',
  day: 'Saturday',
  time: '3:00 PM AWST',
  content: 'Short Content & Clips',
  description: 'Best moments, highlights, and short-form gaming content.',
  live: false,
  icon: <Radio size={18} />,
  href: 'https://www.tiktok.com/@thealchemist1086'
},
{
  platform: 'Kick',
  day: 'TBA',
  time: 'Coming Soon',
  content: 'Live on Kick',
  description: 'Kick channel launching soon. Follow to be notified when we go live.',
  live: false,
  icon: <Radio size={18} />,
  href: 'https://kick.com/alchy-007'
},
{
  platform: 'YouTube',
  day: 'Sunday',
  time: '5:00 PM AWST',
  content: 'Weekly Wrap-Up',
  description: 'Recap of the week\'s gaming, news, and community highlights.',
  live: false,
  icon: <Youtube size={18} />,
  href: 'https://www.youtube.com/@thealchemism'
}];


const gameReviews: GameReview[] = [
{
  id: 1,
  title: 'Elden Ring: Shadow of the Erdtree',
  genre: 'Action RPG',
  rating: 9.5,
  platform: ['PC', 'PS5', 'Xbox'],
  summary: 'FromSoftware\'s expansion delivers the same punishing brilliance as the base game, with a world that rewards patience and punishes arrogance. The new weapons and boss designs are some of the best in the series.',
  verdict: 'Essential. If you survived the base game, this is non-negotiable.',
  imageSlot: '/images/pages/gaming/review-1',
  tag: 'Featured'
},
{
  id: 2,
  title: 'Helldivers 2',
  genre: 'Co-op Shooter',
  rating: 8.8,
  platform: ['PC', 'PS5'],
  summary: 'A rare co-op shooter that actually demands teamwork. The live-service model is done right — the community drives the narrative, and every session feels consequential.',
  verdict: 'Best co-op experience in years. Bring friends.',
  imageSlot: '/images/pages/gaming/review-2'
},
{
  id: 3,
  title: 'Hollow Knight: Silksong',
  genre: 'Metroidvania',
  rating: 9.2,
  platform: ['PC', 'Switch', 'Xbox'],
  summary: 'The wait was worth it. Silksong refines everything that made the original great and adds layers of complexity that will keep speedrunners busy for years.',
  verdict: 'A masterclass in the genre. Instant classic.',
  imageSlot: '/images/pages/gaming/review-3',
  tag: 'Top Pick'
}];


const recentClips: ClipEntry[] = [
{
  title: 'Insane 1v5 Clutch — Community Night',
  platform: 'Twitch',
  views: '24.3K',
  duration: '2:14',
  game: 'Valorant',
  imageSlot: '/images/pages/gaming/hero'
},
{
  title: 'First Boss Down — Elden Ring DLC',
  platform: 'YouTube',
  views: '18.7K',
  duration: '4:32',
  game: 'Elden Ring',
  imageSlot: '/images/pages/gaming/review-1'
},
{
  title: 'Speed Any% World Record Attempt',
  platform: 'Twitch',
  views: '31.1K',
  duration: '1:08:44',
  game: 'Hollow Knight',
  imageSlot: '/images/pages/gaming/review-3'
}];


const platformColors: Record<string, string> = {
  Twitch: '#9146FF',
  YouTube: '#FF0000',
  TikTok: '#69C9D0',
  Kick: '#53FC18'
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function AlchemicalSigil({ className = '' }: {className?: string;}) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <circle cx="100" cy="100" r="90" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3" />
      <polygon points="100,20 172,140 28,140" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none" opacity="0.4" />
      <polygon points="100,180 28,60 172,60" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none" opacity="0.2" />
      <circle cx="100" cy="100" r="5" fill="hsl(var(--primary))" opacity="0.6" />
    </svg>);

}

function FadeUp({ children, delay = 0, className = '' }: {children: React.ReactNode;delay?: number;className?: string;}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' as const }}
      className={className}>

      {children}
    </motion.div>);

}

function StarRating({ rating }: {rating: number;}) {
  const full = Math.floor(rating / 2);
  const half = rating % 2 >= 1;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) =>
      <Star
        key={i}
        size={12}
        className={i < full ? 'text-primary fill-primary' : i === full && half ? 'text-primary fill-primary opacity-50' : 'text-border'}
        fill={i < full ? 'currentColor' : 'none'} />

      )}
      <span className="text-xs font-bold text-primary ml-1">{rating}/10</span>
    </div>);

}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GamingPage() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const genres = ['All', 'Action RPG', 'Co-op Shooter', 'Metroidvania'];

  const filtered = activeFilter === 'All' ?
  gameReviews :
  gameReviews.filter((g) => g.genre === activeFilter);

  return (
    <>
      <title>Gaming Hub — The Alchemism</title>
      <meta name="description" content="Game reviews, stream schedules, clips, and gaming content from The Alchemism. Covering PC, console, and everything in between." />
      <link rel="canonical" href="https://thealchemism.com/gaming" />
      <meta property="og:title" content="Gaming Hub — The Alchemism" />
      <meta property="og:description" content="Game reviews, stream schedules, clips, and gaming content from The Alchemism. Covering PC, console, and everything in between." />
      <meta property="og:url" content="https://thealchemism.com/gaming" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://ogthealchemist.com/api/og?title=Gaming+Hub&description=Game+reviews%2C+stream+schedules+and+gaming+content+from+The+Alchemism.&platform=kick" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@TheAlchemi21261" />
      <meta name="twitter:image" content="https://ogthealchemist.com/api/og?title=Gaming+Hub&description=Game+reviews%2C+stream+schedules+and+gaming+content+from+The+Alchemism.&platform=kick" />
      {/* Kick channel */}
      <meta name="kick:channel" content="alchy-007" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Gaming Hub — The Alchemism",
        "url": "https://thealchemism.com/gaming",
        "description": "Game reviews, stream schedules, clips, and gaming content from The Alchemism.",
        "isPartOf": { "@type": "WebSite", "name": "The Alchemism", "url": "https://thealchemism.com" }
      })}</script>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[65vh] flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/pages/gaming/hero)` }} />

        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/60 to-background" />

        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' as const }}>

          <AlchemicalSigil className="w-[500px] h-[500px] opacity-10" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
            className="flex items-center justify-center gap-3 mb-8">

            <div className="h-px w-12 bg-primary" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">The Alchemism</span>
            <div className="h-px w-12 bg-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' as const }}
            className="text-6xl md:text-7xl font-bold tracking-widest text-foreground mb-6"
            style={{ fontFamily: 'var(--font-heading)', textShadow: '0 0 60px rgba(201,146,42,0.2)' }}>

            GAMING <span className="text-primary" style={{ textShadow: '0 0 40px rgba(201,146,42,0.5)' }}>HUB</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' as const }}
            className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">Reviews, stream schedules, clips, and gaming content. This is where The Alchemist plays.


          </motion.p>

          {/* Platform links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: 'easeOut' as const }}
            className="flex items-center justify-center gap-3 flex-wrap">

            {[
            { label: 'Twitch', href: '#', icon: <Twitch size={16} />, color: '#9146FF' },
            { label: 'YouTube', href: '#', icon: <Youtube size={16} />, color: '#FF0000' },
            { label: 'TikTok', href: '#', icon: <Radio size={16} />, color: '#69C9D0' }].
            map((p) =>
            <a
              key={p.label}
              href={p.href}
              className="flex items-center gap-2 px-4 py-2 border border-border bg-card/60 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200">

                <span style={{ color: p.color }}>{p.icon}</span>
                {p.label}
                <ExternalLink size={10} />
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card/40 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
            { icon: <Flame size={16} />, label: 'Streams', value: '200+' },
            { icon: <Trophy size={16} />, label: 'Games Reviewed', value: '48' },
            { icon: <Zap size={16} />, label: 'Clips Published', value: '320+' },
            { icon: <Monitor size={16} />, label: 'Platforms', value: '4' },
            { icon: <Star size={16} />, label: 'Avg Rating', value: '8.9' }].
            map((s) =>
            <div key={s.label} className="flex items-center gap-3">
                <div className="text-primary">{s.icon}</div>
                <div>
                  <div className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</div>
                  <div className="text-xs text-muted-foreground tracking-wide">{s.label}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── STREAM SCHEDULE ──────────────────────────────────────────────── */}
      <section className="py-24 container mx-auto px-4">
        <FadeUp className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">Go Live</p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-wider text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}>

                Stream Schedule
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">All times in AWST (Perth, Australia). Follow on your platform to get notified.</p>
          </div>
        </FadeUp>

        {/* Schedule grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {streamSchedule.map((stream, i) =>
          <FadeUp key={stream.day} delay={i * 0.07}>
              <a
              href={stream.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col border p-6 transition-all duration-300 hover:-translate-y-1 ${
              stream.live ?
              'border-primary bg-primary/5 hover:bg-primary/10' :
              'border-border bg-card hover:border-primary/40'}`
              }>

                {/* Live badge */}
                {stream.live &&
              <div className="flex items-center gap-2 mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    <span className="text-xs font-bold tracking-widest uppercase text-primary">Live Tonight</span>
                  </div>
              }

                {/* Platform */}
                <div
                className="flex items-center gap-2 mb-4"
                style={{ color: platformColors[stream.platform] }}>

                  {stream.icon}
                  <span className="text-xs font-bold tracking-widest uppercase">{stream.platform}</span>
                </div>

                {/* Day + time */}
                <h3
                className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-200"
                style={{ fontFamily: 'var(--font-heading)' }}>

                  {stream.day}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <Clock size={11} />
                  {stream.time}
                </div>

                {/* Content */}
                <p className="text-sm font-semibold text-foreground mb-2">{stream.content}</p>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{stream.description}</p>

                {/* Watch link */}
                <div className="flex items-center gap-1 mt-4 text-xs font-semibold tracking-widest uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Watch <ExternalLink size={10} />
                </div>
              </a>
            </FadeUp>
          )}
        </div>

        {/* Timezone note */}
        <FadeUp delay={0.4} className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Schedule subject to change. Follow on{' '}
            <a href="#" className="text-primary hover:underline">Twitch</a> or{' '}
            <a href="#" className="text-primary hover:underline">YouTube</a> for live notifications.
          </p>
        </FadeUp>
      </section>

      {/* ── GAME REVIEWS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-card/20 border-y border-border">
        <div className="container mx-auto px-4">
          <FadeUp className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">Reviewed</p>
                <h2
                  className="text-4xl md:text-5xl font-bold tracking-wider text-foreground"
                  style={{ fontFamily: 'var(--font-heading)' }}>

                  Game Reviews
                </h2>
              </div>

              {/* Genre filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={14} className="text-muted-foreground" />
                {genres.map((g) =>
                <button
                  key={g}
                  onClick={() => setActiveFilter(g)}
                  className={`px-3 py-1.5 text-xs font-semibold tracking-widest uppercase border transition-all duration-200 ${
                  activeFilter === g ?
                  'border-primary text-primary bg-primary/10' :
                  'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'}`
                  }>

                    {g}
                  </button>
                )}
              </div>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {filtered.map((game, i) =>
            <FadeUp key={game.id} delay={i * 0.08}>
                <div className="group border border-border bg-card hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col h-full">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                    src={game.imageSlot}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />

                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    {game.tag &&
                  <span className="absolute top-3 left-3 text-xs font-bold tracking-widest uppercase px-2 py-1 bg-primary text-background">
                        {game.tag}
                      </span>
                  }
                    {/* Rating overlay */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 border border-border">
                      <Star size={11} className="text-primary fill-primary" />
                      <span className="text-xs font-bold text-primary">{game.rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-xs font-semibold tracking-widest uppercase text-primary border border-primary/30 px-2 py-0.5 mb-2 inline-block">
                          {game.genre}
                        </span>
                        <h3
                        className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200 mt-2"
                        style={{ fontFamily: 'var(--font-heading)' }}>

                          {game.title}
                        </h3>
                      </div>
                    </div>

                    <StarRating rating={game.rating} />

                    {/* Platforms */}
                    <div className="flex gap-1.5 mt-3 mb-4">
                      {game.platform.map((p) =>
                    <span key={p} className="text-xs text-muted-foreground border border-border px-1.5 py-0.5">
                          {p}
                        </span>
                    )}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{game.summary}</p>

                    {/* Verdict */}
                    <div className="border-l-2 border-primary pl-3 mt-auto">
                      <p className="text-xs font-bold tracking-widest uppercase text-primary mb-1">Verdict</p>
                      <p className="text-xs text-muted-foreground italic">{game.verdict}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            )}
          </div>

          <FadeUp delay={0.3} className="text-center mt-10">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200">

              View All Reviews <ChevronRight size={14} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── RECENT CLIPS ─────────────────────────────────────────────────── */}
      <section className="py-24 container mx-auto px-4">
        <FadeUp className="mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">Highlights</p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-wider text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}>

                Recent Clips
              </h2>
            </div>
            <a
              href="#"
              className="hidden md:flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">

              All Clips <ChevronRight size={14} />
            </a>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentClips.map((clip, i) =>
          <FadeUp key={clip.title} delay={i * 0.08}>
              <div className="group border border-border bg-card hover:border-primary/40 transition-all duration-300 overflow-hidden cursor-pointer">
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  <img
                  src={clip.imageSlot}
                  alt={clip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />

                  <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors duration-300" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-2 border-primary flex items-center justify-center bg-background/60 group-hover:bg-primary transition-all duration-300">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-primary group-hover:border-l-background ml-1 transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Duration */}
                  <span className="absolute bottom-2 right-2 text-xs font-bold bg-background/80 px-1.5 py-0.5 text-foreground">
                    {clip.duration}
                  </span>

                  {/* Platform badge */}
                  <span
                  className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5"
                  style={{ background: platformColors[clip.platform] + '33', color: platformColors[clip.platform], border: `1px solid ${platformColors[clip.platform]}66` }}>

                    {clip.platform}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">{clip.game}</p>
                  <h3
                  className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-200 mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}>

                    {clip.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Flame size={11} className="text-primary" />
                    {clip.views} views
                  </div>
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border bg-card/30">
        <FadeUp className="container mx-auto px-4 text-center max-w-xl">
          <AlchemicalSigil className="w-16 h-16 mx-auto mb-6 opacity-40" />
          <h2
            className="text-3xl font-bold tracking-widest text-foreground mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}>

            Never Miss a Stream
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Join the community to get notified for every stream, early access to reviews, and exclusive gaming content for members only.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/#join"
              className="px-8 py-3 bg-primary text-background text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-heading)' }}>

              Join the Community
            </a>
            <Link
              to="/og-clan"
              className="px-8 py-3 border border-border text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200">

              Meet the OG Clan
            </Link>
          </div>
        </FadeUp>
      </section>
    </>);

}