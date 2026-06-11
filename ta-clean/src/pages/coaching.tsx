import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Brain,
  Flame,
  Target,
  Users,
  Zap,
  Shield,
  Clock,
  Check,
  Quote,
  Star } from
'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CoachingArea {
  icon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
  outcomes: string[];
  imageSlot: string;
}

interface Testimonial {
  quote: string;
  name: string;
  handle: string;
  tier: string;
  rating: number;
}

interface FAQ {
  question: string;
  answer: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const coachingAreas: CoachingArea[] = [
{
  icon: <Brain size={22} />,
  title: 'Mindset & Mental Performance',
  tagline: 'The formula starts in the mind.',
  description:
  'Most people fail not because they lack skill — they fail because their thinking is working against them. This coaching stream focuses on rewiring the mental patterns that keep you stuck: self-doubt, inconsistency, fear of visibility, and the inability to follow through.',
  outcomes: [
  'Identify and dismantle limiting belief systems',
  'Build unshakeable consistency in high-pressure situations',
  'Develop a performance mindset that compounds over time',
  'Learn to operate from clarity, not anxiety'],

  imageSlot: '/images/pages/coaching/mindset'
},
{
  icon: <Flame size={22} />,
  title: 'Lifestyle Design & Discipline',
  tagline: 'Build a life that runs on your terms.',
  description:
  'Discipline isn\'t punishment — it\'s freedom. This stream is about designing a daily structure that supports your goals, eliminating the noise that drains your energy, and building habits that make excellence the default, not the exception.',
  outcomes: [
  'Design a daily routine aligned with your actual goals',
  'Eliminate energy drains and decision fatigue',
  'Build sustainable habits that don\'t require willpower',
  'Create a lifestyle that reflects who you\'re becoming'],

  imageSlot: '/images/pages/coaching/lifestyle'
},
{
  icon: <Target size={22} />,
  title: 'Content Creation & Personal Brand',
  tagline: 'Turn who you are into what you build.',
  description:
  'The Alchemism was built on authentic content and a clear identity. This stream teaches you how to find your voice, build an audience that actually cares, and turn your unique perspective into a brand that opens doors.',
  outcomes: [
  'Clarify your niche, voice, and content identity',
  'Build a consistent content system that doesn\'t burn you out',
  'Grow an engaged audience across platforms',
  'Monetise your brand without selling out'],

  imageSlot: '/images/pages/coaching/growth'
}];


const testimonials: Testimonial[] = [
{
  quote:
  'Three months in and I\'ve completely rebuilt how I approach my day. The mindset work alone was worth ten times what I paid. I\'m not the same person who signed up.',
  name: 'Jordan K.',
  handle: '@jordank_creates',
  tier: 'Inner Circle',
  rating: 5
},
{
  quote:
  'I\'d been trying to start my content channel for two years. After one session with the OG Clan coaching framework, I had a clear plan and posted my first video within a week. Now I\'m at 4K subscribers.',
  name: 'Mia T.',
  handle: '@mia.transmutes',
  tier: 'OG Tier',
  rating: 5
},
{
  quote:
  'The lifestyle design module changed everything. I stopped trying to be productive and started being intentional. Completely different energy.',
  name: 'Remy A.',
  handle: '@remyalchemy',
  tier: 'Inner Circle',
  rating: 5
},
{
  quote:
  'Honest, direct, no fluff. The Alchemism coaching doesn\'t tell you what you want to hear — it tells you what you need to hear. That\'s rare.',
  name: 'Sasha W.',
  handle: '@sashawrites',
  tier: 'Inner Circle',
  rating: 5
}];


const faqs: FAQ[] = [
{
  question: 'Who is the coaching designed for?',
  answer:
  'Anyone who feels like they\'re operating below their potential — creators, gamers, entrepreneurs, or anyone building something from scratch. You don\'t need to be at a certain level. You need to be ready to do the work.'
},
{
  question: 'Is this one-on-one coaching or group-based?',
  answer:
  'Both. Inner Circle members get access to group coaching sessions, community accountability, and structured frameworks. OG Tier members get direct access to the OG Clan for more personalised guidance. One-on-one sessions are available on request.'
},
{
  question: 'How much time do I need to commit?',
  answer:
  'The frameworks are designed to work with your existing schedule. Most members see meaningful results with 30–60 minutes of intentional work per day. The goal is quality over quantity.'
},
{
  question: 'What makes The Alchemism coaching different?',
  answer:
  'We\'re practitioners, not theorists. Everything we teach is something we\'ve lived. The OG Clan built The Alchemism from nothing — the coaching is the actual formula we used, not a generic self-help framework.'
},
{
  question: 'Can I access coaching content without a paid membership?',
  answer:
  'Free members get access to public coaching content — articles, videos, and community discussions. The structured programmes, live sessions, and direct access are exclusive to Inner Circle and OG Tier members.'
},
{
  question: 'How do I get started?',
  answer:
  'Join the Inner Circle to access the full coaching library and live sessions. If you want the most direct path, go OG Tier for personal access to the clan. Either way — the first step is showing up.'
}];


const processSteps = [
{
  number: '01',
  title: 'Diagnose',
  description: 'Identify exactly where you are, what\'s holding you back, and what the gap looks like between your current state and where you want to be.'
},
{
  number: '02',
  title: 'Formulate',
  description: 'Build a personalised framework — not a generic plan. Your formula is specific to your goals, your strengths, and your constraints.'
},
{
  number: '03',
  title: 'Transmute',
  description: 'Execute with accountability. The work happens here. Consistent action, honest feedback, and iterative refinement until the results compound.'
},
{
  number: '04',
  title: 'Elevate',
  description: 'Once the foundation is solid, we scale. Bigger goals, higher standards, and a version of yourself that keeps raising the ceiling.'
}];


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

function FadeUp({
  children,
  delay = 0,
  className = ''




}: {children: React.ReactNode;delay?: number;className?: string;}) {
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

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({ faq, index }: {faq: FAQ;index: number;}) {
  const [open, setOpen] = useState(false);
  return (
    <FadeUp delay={index * 0.06}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left border border-border bg-card hover:border-primary/40 transition-all duration-200 overflow-hidden">

        <div className="flex items-center justify-between gap-4 p-6">
          <span
            className="text-sm font-semibold text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}>

            {faq.question}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 text-primary">

            <ChevronDown size={16} />
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {open &&
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' as const }}>

              <div className="px-6 pb-6 border-t border-border/50 pt-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </button>
    </FadeUp>);

}

// ─── Coaching Area Card ───────────────────────────────────────────────────────
function CoachingCard({ area, index }: {area: CoachingArea;index: number;}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' as const }}
      className={`grid grid-cols-1 lg:grid-cols-2 border border-border bg-card overflow-hidden group hover:border-primary/40 transition-all duration-300`}>

      {/* Image — alternates sides */}
      <div className={`relative h-64 lg:h-auto overflow-hidden ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
        <img
          src={area.imageSlot}
          alt={area.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />

        <div className={`absolute inset-0 ${isEven ? 'bg-gradient-to-r from-transparent to-card/70' : 'bg-gradient-to-l from-transparent to-card/70'} hidden lg:block`} />
        <div className="absolute inset-0 bg-gradient-to-t from-card/70 to-transparent lg:hidden" />
        {/* Icon badge */}
        <div className="absolute top-4 left-4 w-10 h-10 border border-primary bg-background/80 flex items-center justify-center text-primary">
          {area.icon}
        </div>
      </div>

      {/* Content */}
      <div className={`p-8 lg:p-10 flex flex-col justify-center ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-3">
          {area.tagline}
        </p>
        <h3
          className="text-2xl md:text-3xl font-bold tracking-wide text-foreground mb-4 group-hover:text-primary transition-colors duration-300"
          style={{ fontFamily: 'var(--font-heading)' }}>

          {area.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{area.description}</p>

        {/* Outcomes */}
        <ul className="flex flex-col gap-2 mb-8">
          {area.outcomes.map((o) =>
          <li key={o} className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="mt-0.5 w-4 h-4 shrink-0 border border-primary/40 flex items-center justify-center">
                <Check size={9} className="text-primary" />
              </div>
              {o}
            </li>
          )}
        </ul>

        <a
          href="#membership"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary hover:gap-3 transition-all duration-200">

          Start This Journey <ArrowRight size={13} />
        </a>
      </div>
    </motion.div>);

}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CoachingPage() {
  return (
    <>
      <title>Coaching & Lifestyle — The Alchemism</title>
      <meta name="description" content="Lifestyle coaching, mindset transformation, and personal development from The Alchemism. Four stages: Diagnose, Formulate, Transmute, Elevate." />
      <link rel="canonical" href="https://thealchemism.com/coaching" />
      <meta property="og:title" content="Coaching & Lifestyle — The Alchemism" />
      <meta property="og:description" content="Lifestyle coaching, mindset transformation, and personal development from The Alchemism. Four stages: Diagnose, Formulate, Transmute, Elevate." />
      <meta property="og:url" content="https://thealchemism.com/coaching" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://ogthealchemist.com/api/og?title=Coaching+%26+Lifestyle&description=Mindset+transformation+and+personal+development+from+The+Alchemism." />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://ogthealchemist.com/api/og?title=Coaching+%26+Lifestyle&description=Mindset+transformation+and+personal+development+from+The+Alchemism." />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "The Alchemism Coaching",
        "url": "https://thealchemism.com/coaching",
        "description": "Lifestyle coaching, mindset transformation, and personal development. Four stages: Diagnose, Formulate, Transmute, Elevate.",
        "provider": { "@type": "Organization", "name": "The Alchemism", "url": "https://thealchemism.com" },
        "serviceType": "Life Coaching"
      })}</script>
      <meta
        name="description"
        content="Mindset, lifestyle design, and personal brand coaching from The Alchemism OG Clan. Real frameworks. Real results. No fluff." />


      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/pages/coaching/hero)` }} />

        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/65 to-background" />

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
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">
              The Alchemism
            </span>
            <div className="h-px w-12 bg-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' as const }}
            className="text-6xl md:text-7xl font-bold tracking-widest text-foreground mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
              textShadow: '0 0 60px rgba(201,146,42,0.2)'
            }}>

            COACHING &{' '}
            <span
              className="text-primary"
              style={{ textShadow: '0 0 40px rgba(201,146,42,0.5)' }}>

              LIFESTYLE
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' as const }}
            className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">The Alchemism didn't get here by accident. Every result was the product of a formula — mindset, discipline, and deliberate action. Now The Alchemist teaches it.



          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: 'easeOut' as const }}
            className="flex items-center justify-center gap-3 flex-wrap">

            <a
              href="#coaching-areas"
              className="px-8 py-3 bg-primary text-background text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-heading)' }}>

              Explore Coaching
            </a>
            <a
              href="#membership"
              className="px-8 py-3 border border-border text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200">

              View Membership
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card/40 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
            { icon: <Users size={16} />, label: 'Members Coached', value: '500+' },
            { icon: <Target size={16} />, label: 'Coaching Streams', value: '3' },
            { icon: <Zap size={16} />, label: 'Live Sessions / Month', value: '8' },
            { icon: <Shield size={16} />, label: 'Satisfaction Rate', value: '97%' },
            { icon: <Clock size={16} />, label: 'Avg. Transformation', value: '90 Days' }].
            map((s) =>
            <div key={s.label} className="flex items-center gap-3">
                <div className="text-primary">{s.icon}</div>
                <div>
                  <div
                  className="text-lg font-bold text-foreground"
                  style={{ fontFamily: 'var(--font-heading)' }}>

                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground tracking-wide">{s.label}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ───────────────────────────────────────────────────── */}
      <section className="py-24 container mx-auto px-4 max-w-3xl text-center">
        <FadeUp>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-4">
            The Philosophy
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-wider text-foreground mb-8"
            style={{ fontFamily: 'var(--font-heading)' }}>

            Alchemy is a Process
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="text-muted-foreground leading-relaxed text-base mb-6">The ancient alchemists believed that base metals could be transformed into gold through the right process. The Alchemist, also known as Alchey by his closest counterparts believes the same about people. You are not fixed. You are not finished. You are raw material — and with the right formula, the transformation is inevitable.




          </p>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="text-muted-foreground leading-relaxed text-base">The Alchemism coaching isn't about motivation. Motivation fades. It's about building systems, rewiring patterns, and creating the conditions where growth becomes the path of least resistance. That's the formula. That's what The Alchemist teaches.



          </p>
        </FadeUp>
      </section>

      {/* ── THE PROCESS ──────────────────────────────────────────────────── */}
      <section className="py-20 border-y border-border bg-card/20">
        <div className="container mx-auto px-4">
          <FadeUp className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">
              How It Works
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-wider text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}>

              The Four Stages
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {processSteps.map((step, i) =>
            <FadeUp key={step.number} delay={i * 0.1}>
                <div className="relative border border-border bg-card p-6 h-full hover:border-primary/40 transition-all duration-300 group">
                  {/* Connector line */}
                  {i < processSteps.length - 1 &&
                <div className="hidden lg:block absolute top-8 -right-2 w-4 h-px bg-primary/30 z-10" />
                }
                  <div
                  className="text-4xl font-bold text-primary/20 mb-4 group-hover:text-primary/40 transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-heading)' }}>

                    {step.number}
                  </div>
                  <h3
                  className="text-lg font-bold tracking-widest text-foreground mb-3 group-hover:text-primary transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-heading)' }}>

                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </FadeUp>
            )}
          </div>
        </div>
      </section>

      {/* ── COACHING AREAS ───────────────────────────────────────────────── */}
      <section id="coaching-areas" className="py-24 container mx-auto px-4">
        <FadeUp className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">
            What We Cover
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-wider text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}>

            Coaching Streams
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Three focused areas. Each one a pillar of the formula. Work one stream or all three —
            the depth is there either way.
          </p>
        </FadeUp>

        <div className="flex flex-col gap-4">
          {coachingAreas.map((area, i) =>
          <CoachingCard key={area.title} area={area} index={i} />
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-card/20 border-y border-border">
        <div className="container mx-auto px-4">
          <FadeUp className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">
              Results
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-wider text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}>

              What Members Say
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {testimonials.map((t, i) =>
            <FadeUp key={t.handle} delay={i * 0.08}>
                <div className="border border-border bg-card p-6 h-full hover:border-primary/40 transition-all duration-300 flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) =>
                  <Star key={j} size={12} className="text-primary fill-primary" />
                  )}
                  </div>

                  {/* Quote */}
                  <div className="flex gap-3 flex-1 mb-6">
                    <Quote size={18} className="text-primary shrink-0 mt-0.5 opacity-60" />
                    <p className="text-sm text-muted-foreground leading-relaxed italic">{t.quote}</p>
                  </div>

                  {/* Attribution */}
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.handle}</p>
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase border border-primary/40 text-primary px-2 py-1">
                      {t.tier}
                    </span>
                  </div>
                </div>
              </FadeUp>
            )}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP CTA ───────────────────────────────────────────────── */}
      <section id="membership" className="py-28 container mx-auto px-4">
        <FadeUp className="max-w-4xl mx-auto">
          <div className="relative border border-primary/30 bg-card overflow-hidden">
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left — copy */}
              <div className="p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-border">
                <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-4">
                  Access
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold tracking-wider text-foreground mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}>

                  Ready to Start the Transformation?
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  The coaching content, live sessions, and community are all inside the membership.
                  Choose your tier and start the formula today.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/music#membership"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
                    style={{ fontFamily: 'var(--font-heading)' }}>

                    View Membership Tiers <ChevronRight size={14} />
                  </Link>
                  <a
                    href="/#join"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200">

                    Join Free First
                  </a>
                </div>
              </div>

              {/* Right — quick perks */}
              <div className="p-10 lg:p-14">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
                  What's included
                </p>
                <ul className="flex flex-col gap-4">
                  {[
                  'Full access to all 3 coaching streams',
                  'Monthly live group coaching sessions',
                  'Private community & accountability groups',
                  'Exclusive frameworks and workbooks',
                  'Direct Q&A with the OG Clan',
                  'Early access to new content drops'].
                  map((perk) =>
                  <li key={perk} className="flex items-start gap-3">
                      <div className="mt-0.5 w-4 h-4 shrink-0 border border-primary/40 bg-primary/10 flex items-center justify-center">
                        <Check size={9} className="text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{perk}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-card/20 border-t border-border">
        <div className="container mx-auto px-4 max-w-2xl">
          <FadeUp className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">
              Questions
            </p>
            <h2
              className="text-4xl font-bold tracking-wider text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}>

              FAQ
            </h2>
          </FadeUp>

          <div className="flex flex-col gap-2">
            {faqs.map((faq, i) =>
            <FAQItem key={faq.question} faq={faq} index={i} />
            )}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <FadeUp className="container mx-auto px-4 text-center max-w-xl">
          <AlchemicalSigil className="w-16 h-16 mx-auto mb-6 opacity-40" />
          <h2
            className="text-3xl font-bold tracking-widest text-foreground mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}>

            The Formula is Waiting
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Every version of yourself that you want to become is on the other side of consistent,
            deliberate action. The Alchemism gives you the framework. You bring the will.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/og-clan"
              className="px-8 py-3 border border-border text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200">

              Meet the OG Clan
            </Link>
            <Link
              to="/gaming"
              className="px-8 py-3 border border-border text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200">

              Gaming Hub
            </Link>
          </div>
        </FadeUp>
      </section>
    </>);

}