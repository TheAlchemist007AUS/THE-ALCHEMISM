import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { ChevronDown, Play, X, Quote } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ClanMember {
  id: number;
  codename: string;
  realName: string;
  role: string;
  bio: string;
  specialty: string[];
  quote: string;
  imageSlot: string;
  interview: {
    q1: {question: string;answer: string;};
    q2: {question: string;answer: string;};
    q3: {question: string;answer: string;};
  };
}

// ─── Clan Data ────────────────────────────────────────────────────────────────
const clanMembers: ClanMember[] = [
{
  id: 1,
  codename: 'GRIFF',
  realName: 'MAJOR',
  role: 'COMS · Strategist · Leader',
  bio: 'One of two warriors who started put their heads together coming up with the idea of creating a clan, not even looking at anything BIG yet The OG clan was created. Really as a social thing with 5-6 members in mind, that small number of members grew quite quickly in no time — Believing the culture, personalities & comradship of each & every member is what has been a pivotal part of the growth of The OG clan, there is never any drama & everyone is a team player. a vision of a brilliant clan was born, creating lifelong friendships filled with laughs & banter transforming into a well-known clan not to be taken lightly & numbers come far & wide to join the united.',
  specialty: ['Strategy', 'Leading from the top'],
  quote: 'Every great thing begins with a single, deliberate act of will.',
  imageSlot: '/images/og-clan/member-1.png',
  interview: {
    q1: { question: 'What was the original vision for The OG clan?', answer: 'It was never about being big, much the total opposite and just about gaming with the lads. One evening THUGGY and myself were playing and came up with an idea of starting a clan, we have us boys who play all the time so why not? During a gaming session we thought about it and "OG" came up, if I remember rightly I think Thuggy said it and BANG — "OG clan" was born. The two of us rocked it and slowly the other four joined. From that evening on we found heaps of other players like ourselves who wanted to join, it grew from 6 of the originals to where we are today, which is around a solid 90-120 players in OG CLAN!!! All similar to one another and all backing that name all the way in every game win or lose. The OG clan is strong & united, no corner is safe when the OG clan hit the ground running.' },
    q2: { question: 'What makes the OG Clan different from any other group?', answer: 'We didnt come together by accident. Every one of us were chosen because they brought something irreplaceable & always lead from the top. I\'ll admit, I wasn\'t the greatest of players but Id back the lads up till Id get taken down and I ended up with a crew that helped me grow into the better overall player that I am today. They were even there during times in need and those true lads who are my besties in game have become real mates offline, where wed talk to one another most nights — most of them from Perth like myself and others interstate and New Zealand. These legends are OG KING THUGGY, OG LUXKING13, OG ROOFTOP KOREAN, OG DANGLE and OG ALCHEMIST, there are heaps of others like Run and Hide. To all of our members, you all make OG clan what it is today and if I could name everyone, I would. OG ALCHEMIST is close,  weve built a strong bond outside of gaming, hang out heaps, but watching him build this whole project including the two sites and everything else (Ohh, theres more) by himself and work his professional career is an absolutely huge testament in itself and as u can see both THE ALCHEMISM & RESPAWN HEARTS are awesome sites. Hopping online and loading in with these guys is one genuine place where I can switch off from the world and enter this realm where we all have fun, enjoy the humour, joking around and just be ourselves but when we do drop in together we destroy other clans, with a whole heap of banter and laughter — but win or lose they respect the OG CLAN like we respect them.' },
    q3: { question: 'Whats next for The OG clan?', answer: 'I believe the next phase is about scale. Weve built the foundation. Now we open the doors wider — not to mention more content and ideas bigger than ever with Alchey and his project, more community and definitely more transformation. While keeping in mind, we are all here to enjoy, have fun and just reset.' }
  }
},
{
  id: 2,
  codename: 'KING THUGGY',
  realName: 'THUGGY',
  role: 'The Analyst · Quick Decision Maker · Camo Specialist',
  bio: 'THUGGY decodes the noise and finds the signal. A master of narrative and data, he turns raw information into compelling decision making that move squads to action, not to mention his NOW YOU SEE ME NOW YOU DONT APPROACH',
  specialty: ['Analytics', 'Precise Decision Making Under Pressure', 'Hidden Talents'],
  quote: 'The truth is always in the pattern. You just have to know how to read it.',
  imageSlot: '/images/og-clan/member-2.png',
  interview: {
    q1: { question: 'How did you first connect with The Alchemism?', answer: 'I\'d been watching the community grow from the outside. When we reached out to The Alchemist in coming onboard with the OG Clan I knew immediately — there was something rare in the making, then watched a community with actual depth building behind it all.' },
    q2: { question: 'What\'s your role in the day-to-day?', answer: 'I handle the narrative layer. Every piece of content, every campaign — I make sure it tells a story that actually lands. Data tells you what happened. Story tells you why it matters.' },
    q3: { question: 'From a birdseye view of something quite special evolving in front of your eyes, what advice would you give aspiring creators?', answer: 'Stop chasing trends. Find the thing only you can say, and say it relentlessly. Authenticity compounds.' }
  }
},
{
  id: 3,
  codename: 'ROOFTOP KOREAN',
  realName: 'The Disruptor',
  role: 'The Disruptor · Mastermind Behind The Kaos · The Ideas Man',
  bio: 'ROOFY lives at the intersection of chaos and control. Behind the scenes, in game, or in conversation — he pulls people in and doesn\'t let go. The community\'s heartbeat for sure but a real larican a heart with a real serious side when needed.Ohh, not to mention enjoys stirring Alchey up any hance he gets',
  specialty: ['Disrupts anything at a split second when required', 'A true Mastermind in everything he does even if its stirring the pot', 'A True Ideas Man'],
  quote: 'Chaos isn\'t the enemy. It\'s the raw material.',
  imageSlot: '/images/og-clan/member-3.png',
  interview: {
    q1: { question: 'What got you into gaming?', answer: 'I needed an outlet. Gaming was always my thing, but OG Clan turned it into something shared. The moment someone in chat said "this changed my night" — I was locked in.Thats what it is all about' },
    q2: { question: 'How do you build a real community vs just an audience?', answer: 'An audience watches. A community participates. You build community by being genuinely interested and invested in the people, not just the numbers. Show up consistently. Be there if you know someone needs just that ear to listen, Remember names. Create inside moments and the rest will happen' },
    q3: { question: 'Favourite game right now?', answer: 'HAHAHA, like the rest of us Im sure, it would have to be COD Warzone — it just something about coming together as one. But whatever a select few manage to come together and hit the ground running in Warzone but not taking things seriously, just being the laricans we are with load of laughs and much banter we always pull off unforgettable moments, game plays and finish off the evenings with no wins, just legendary moments with absolute legends. Sessions like these are where unforgettable memories are made, brilliant content, thats where I\'m going deep. No casual runs.' }
  }
},
{
  id: 4,
  codename: 'LUXKIING13',
  realName: 'The Visionary',
  role: 'The Fontman · The Deadeye · The Smoothmover',
  bio: 'LUXKIING13 sees what others miss. The creative force behind The OG clans leadership team with baffling movement and speed, he translates his gaming styles right to the very endzone causing confussion and havok for the enemy, always dropping jaws when least expect and dominating from the front, right to the very end.',
  specialty: ['Taking the enemy by suprise', 'Able to get in and out of the tightest of situations', 'The Smoothmover of the crew'],
  quote: 'Light doesn\'t choose a single colour. Neither do I.',
  imageSlot: '/images/og-clan/member-4.png',
  interview: {
    q1: { question: 'How do you approach the creative direction for The Alchemism?', answer: 'Everything starts with feeling. What do we want people to feel when they encounter this brand? Then I work backwards from that. The visuals, the sound, the language — it all has to be consistent with that core feeling.' },
    q2: { question: 'Tell us about the music side of things.', answer: 'The music is personal. It\'s not background noise — it\'s a statement. Every track I put out under The Alchemism banner is meant to be listened to, not just heard.' },
    q3: { question: 'What inspires you most right now?', answer: 'Contrast. Dark and light. Ancient and futuristic. The tension between opposites is where the most interesting things live.' }
  }
},
{
  id: 5,
  codename: 'THE ALCHEMIST',
  realName: 'The Connector · The Streamer/Content Creator',
  role: 'Influencer · Lifestyle Coach · Deadeye Sniper',
  bio: 'Echo amplifies everything he touches. A natural connector who bridges the gap between The Alchemism\'s inner world and the wider community, he makes everyone feel like they belong.',
  specialty: [
    'Master Personal Trainer',
    'Qualified Professional Life Coach',
    'Double Diploma - Community Services & Counselling',
    'Diploma Mental Health',
    'Emergency Response Officer (Mines Rescue & Response)',
    'Therapeutic Care Practitioner Training',
    'Prevention of Suicidal Ideation & Responding to Suicidal Ideation',
    'Lifestyle', 'Coaching', 'Influence',
  ],
  quote: 'The most powerful thing you can do is make someone feel seen.',
  imageSlot: '/images/og-clan/member-5.png',
  interview: {
    q1: { question: 'What does lifestyle coaching mean to you?', answer: 'It means meeting people exactly where they are if their life journey and helping them see where they could be and what they are capable off. Not prescribing a path — helping them find their own. Everyone\'s formula is different.' },
    q2: { question: 'How does The Alchemism approach community differently?', answer: 'We don\'t treat community as a metric. These are real people with real lives. The goal is genuine transformation — not engagement rates.' },
    q3: { question: 'What\'s the most rewarding part of what you do?', answer: 'When someone comes back and says "that conversation changed something for me." That\'s the whole point. That\'s the alchemy.' }
  }
}];


// ─── Alchemical Sigil ─────────────────────────────────────────────────────────
function AlchemicalSigil({ className = '' }: {className?: string;}) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <circle cx="100" cy="100" r="90" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3" />
      <circle cx="100" cy="100" r="60" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.2" />
      <polygon points="100,20 172,140 28,140" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none" opacity="0.4" />
      <polygon points="100,180 28,60 172,60" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none" opacity="0.2" />
      <line x1="100" y1="10" x2="100" y2="190" stroke="hsl(var(--primary))" strokeWidth="0.4" opacity="0.15" />
      <line x1="10" y1="100" x2="190" y2="100" stroke="hsl(var(--primary))" strokeWidth="0.4" opacity="0.15" />
      <circle cx="100" cy="100" r="5" fill="hsl(var(--primary))" opacity="0.6" />
    </svg>);

}

// ─── FadeUp ───────────────────────────────────────────────────────────────────
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

// ─── Interview Modal ──────────────────────────────────────────────────────────
function InterviewModal({ member, onClose }: {member: ClanMember;onClose: () => void;}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-border bg-card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' as const }}>

        {/* Gold top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-primary" />

        {/* Header */}
        <div className="flex items-start justify-between p-8 border-b border-border">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-1">Interview</p>
            <h2
              className="text-3xl font-bold tracking-widest text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}>

              {member.codename}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Close">

            <X size={20} />
          </button>
        </div>

        {/* Quote */}
        <div className="px-8 py-6 border-b border-border/50 bg-muted/30">
          <div className="flex gap-3">
            <Quote size={20} className="text-primary shrink-0 mt-0.5" />
            <p
              className="text-base italic text-foreground/80 leading-relaxed"
              style={{ fontFamily: 'var(--font-heading)' }}>

              {member.quote}
            </p>
          </div>
        </div>

        {/* Q&A */}
        <div className="p-8 flex flex-col gap-8">
          {[member.interview.q1, member.interview.q2, member.interview.q3].map((qa, i) =>
          <div key={i}>
              <p className="text-xs font-bold tracking-widest uppercase text-primary mb-3">
                Q{i + 1} — {qa.question}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{qa.answer}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>);

}

// ─── Member Card ──────────────────────────────────────────────────────────────
function MemberCard({ member, index, onInterview }: {member: ClanMember;index: number;onInterview: (m: ClanMember) => void;}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: 'easeOut' as const }}
      className="group border border-border bg-card hover:border-primary/40 transition-all duration-300 overflow-hidden">

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
        {/* Portrait — cinematic poster */}
        <div className="relative overflow-hidden bg-black" style={{ minHeight: '420px' }}>
          <img
            src={member.imageSlot}
            alt={`${member.codename} — OG Clan cinematic poster`}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            style={{ display: 'block' }} />

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/70 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent md:hidden" />

          {/* Number badge */}
          <div className="absolute top-4 left-4 w-8 h-8 border border-primary flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <span
              className="text-xs font-bold text-primary"
              style={{ fontFamily: 'var(--font-heading)' }}>

              0{member.id}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3
                  className="text-3xl font-bold tracking-widest text-foreground group-hover:text-primary transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-heading)' }}>

                  {member.codename}
                </h3>
                <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">{member.role}</p>
              </div>
            </div>

            {/* Quote */}
            <div className="flex gap-2 my-4 pl-3 border-l-2 border-primary/50">
              <p className="text-sm italic text-muted-foreground leading-relaxed">"{member.quote}"</p>
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{member.bio}</p>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2 mb-6">
              {member.specialty.map((s) =>
              <span
                key={s}
                className="text-xs font-semibold tracking-widest uppercase px-2 py-1 border border-border text-muted-foreground">

                  {s}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onInterview(member)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-heading)' }}>

              <Play size={12} />
              Read Interview
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 px-5 py-2.5 border border-border text-muted-foreground text-xs font-semibold tracking-widest uppercase hover:border-primary hover:text-primary transition-all duration-200">

              {expanded ? 'Less' : 'More'}
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={12} />
              </motion.div>
            </button>
          </div>

          {/* Expanded preview Q&A */}
          <AnimatePresence>
            {expanded &&
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' as const }}
              className="overflow-hidden">

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs font-bold tracking-widest uppercase text-primary mb-2">
                    Q — {member.interview.q1.question}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.interview.q1.answer}</p>
                  <button
                  onClick={() => onInterview(member)}
                  className="mt-4 text-xs font-semibold tracking-widest uppercase text-primary hover:underline">

                    Read Full Interview →
                  </button>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </motion.div>);

}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OGClanPage() {
  const [activeInterview, setActiveInterview] = useState<ClanMember | null>(null);

  return (
    <>
      <title>OG Clan — The Alchemism</title>
      <meta name="description" content="Meet the five originals who founded The Alchemism. Introductions, stories, and exclusive interviews with the OG Clan." />
      <link rel="canonical" href="https://thealchemism.com/og-clan" />
      <meta property="og:title" content="OG Clan — The Alchemism" />
      <meta property="og:description" content="Meet the five originals who founded The Alchemism. Introductions, stories, and exclusive interviews with the OG Clan." />
      <meta property="og:url" content="https://thealchemism.com/og-clan" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://ogthealchemist.com/api/og?title=OG+Clan&description=Meet+the+five+originals+who+founded+The+Alchemism." />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://ogthealchemist.com/api/og?title=OG+Clan&description=Meet+the+five+originals+who+founded+The+Alchemism." />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "OG Clan — The Alchemism",
        "url": "https://thealchemism.com/og-clan",
        "description": "Meet the five originals who founded The Alchemism. Introductions, stories, and exclusive interviews with the OG Clan.",
        "isPartOf": { "@type": "WebSite", "name": "The Alchemism", "url": "https://thealchemism.com" }
      })}</script>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Cinematic video — looping, muted, full bleed */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}>
          <source src="/video/og-clan-cinematic.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay so text reads clearly over the video */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/40 to-background" style={{ zIndex: 1 }} />

        {/* Rotating sigil */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 2 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' as const }}>

          <AlchemicalSigil className="w-[600px] h-[600px] opacity-15" />
        </motion.div>

        <div className="relative text-center px-4 max-w-3xl mx-auto" style={{ zIndex: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
            className="flex items-center justify-center gap-3 mb-8">

            <div className="h-px w-12 bg-primary" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">The Originals</span>
            <div className="h-px w-12 bg-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' as const }}
            className="text-6xl md:text-7xl font-bold tracking-widest text-foreground mb-6"
            style={{ fontFamily: 'var(--font-heading)', textShadow: '0 0 60px rgba(201,146,42,0.2)' }}>

            OG <span className="text-primary" style={{ textShadow: '0 0 40px rgba(201,146,42,0.5)' }}>CLAN</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' as const }}
            className="text-muted-foreground leading-relaxed max-w-xl mx-auto">OG clan was formed by two of the original members with a vision - To build a clan with a reputable approach drawing genuinely amazing individuals from far and wide. Two soon became five, forming an amazing bond of a brotherhood that would last forever. These five would recruit players and make friendships, building The OG clan into a force to be reckoned with, becoming well-known online. These five originals — each bringing an irreplaceable element to the formula. Meet the founders.


          </motion.p>
        </div>
      </section>

      {/* ── LORE STRIP ───────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card/40 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            {[
            { label: 'Founded', value: '2021' },
            { label: 'Originals', value: '5' },
            { label: 'Combined Reach', value: '100K+' },
            { label: 'Interviews', value: 'Season 1' },
            { label: 'Status', value: 'Active' }].
            map((item) =>
            <div key={item.label}>
                <div
                className="text-2xl font-bold text-primary"
                style={{ fontFamily: 'var(--font-heading)' }}>

                  {item.value}
                </div>
                <div className="text-xs text-muted-foreground tracking-widest uppercase mt-1">{item.label}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── MEMBERS ──────────────────────────────────────────────────────── */}
      <section className="py-24 container mx-auto px-4 max-w-5xl">
        <FadeUp className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">The Five</p>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-wider text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}>

            Meet the Originals
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Each member of the OG Clan was chosen for what they bring to the formula. Click "Read Interview" to go deeper.
          </p>
        </FadeUp>

        <div className="flex flex-col gap-4">
          {clanMembers.map((member, i) =>
          <MemberCard
            key={member.id}
            member={member}
            index={i}
            onInterview={setActiveInterview} />

          )}
        </div>
      </section>

      {/* ── CLOSING CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border bg-card/30">
        <FadeUp className="container mx-auto px-4 text-center max-w-xl">
          <AlchemicalSigil className="w-20 h-20 mx-auto mb-6 opacity-40" />
          <h2
            className="text-3xl font-bold tracking-widest text-foreground mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}>

            The Formula Continues
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            The OG Clan laid the foundation. Now the community builds on it. Join The Alchemism and become part of what comes next.
          </p>
          <a
            href="/#join"
            className="inline-flex items-center px-8 py-4 bg-primary text-background text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-heading)' }}>

            Join the Inner Circle
          </a>
        </FadeUp>
      </section>

      {/* ── INTERVIEW MODAL ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeInterview &&
        <InterviewModal member={activeInterview} onClose={() => setActiveInterview(null)} />
        }
      </AnimatePresence>
    </>);

}