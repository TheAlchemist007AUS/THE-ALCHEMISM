import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import {
  Gamepad2,
  Music,
  Users,
  Dumbbell,
  ShoppingBag,
  Calendar,
  BookOpen,
  Lock,
  Twitch,
  Youtube,
  Radio,
  ChevronRight,
  Flame,
  Clock } from
'lucide-react';

// ─── Particle Canvas ────────────────────────────────────────────────────────
// ─── Cinematic Eye Hero Canvas ────────────────────────────────────────────────
// Loads the eye image then layers: drifting stars, blinking animation,
// flowing left-side energy waves, eye-shine logos, rotating gold sigil.
function CinematicEyeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let frame = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Load background eye image ──
    const img = new Image();
    img.src = '/images/pages/home/hero.png';
    let imgLoaded = false;
    img.onload = () => { imgLoaded = true; };

    // ── Stars ──────────────────────────────────────────────────────────────────
    interface Star { x:number; y:number; r:number; op:number; opDir:number; speed:number; angle:number; }
    const stars: Star[] = Array.from({ length: 220 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.4 + Math.random() * 1.8,
      op: 0.1 + Math.random() * 0.7,
      opDir: Math.random() > 0.5 ? 1 : -1,
      speed: 0.0002 + Math.random() * 0.0006,
      angle: Math.random() * Math.PI * 2,
    }));

    // ── Waves (left side energy) ────────────────────────────────────────────────
    interface Wave { phaseOffset:number; yBase:number; amp:number; freq:number; speed:number; color:string; width:number; }
    const waves: Wave[] = [
      { phaseOffset:0,    yBase:0.40, amp:22, freq:2.2, speed:0.018, color:'rgba(201,146,42,0.55)', width:2.0 },
      { phaseOffset:0.6,  yBase:0.43, amp:16, freq:2.8, speed:0.022, color:'rgba(220,170,60,0.40)', width:1.4 },
      { phaseOffset:1.2,  yBase:0.46, amp:28, freq:1.8, speed:0.014, color:'rgba(180,120,30,0.30)', width:1.0 },
      { phaseOffset:1.8,  yBase:0.37, amp:12, freq:3.5, speed:0.030, color:'rgba(255,200,80,0.25)', width:0.8 },
      { phaseOffset:2.4,  yBase:0.49, amp:19, freq:2.0, speed:0.016, color:'rgba(201,146,42,0.20)', width:1.6 },
    ];

    // ── Blink state ─────────────────────────────────────────────────────────────
    // eyelid progress 0=open 1=fully closed
    let blinkProgress = 0;
    let blinkState: 'open'|'closing'|'closed'|'opening' = 'open';
    let blinkTimer = 0;
    const BLINK_INTERVAL = 280; // frames between blinks

    // ── Sigil rotation ───────────────────────────────────────────────────────────
    let sigilAngle = 0;

    // ── Draw sigil paths to ctx ──────────────────────────────────────────────────
    const drawSigil = (cx:number, cy:number, r:number, alpha:number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sigilAngle);
      ctx.globalAlpha = alpha;

      const gold = 'rgba(201,146,42,1)';
      const stroke = (op:number, w:number) => { ctx.strokeStyle=gold; ctx.lineWidth=w; ctx.globalAlpha=alpha*op; };

      // Outer circles
      [r, r*0.85, r*0.65, r*0.38].forEach((rad, i) => {
        ctx.beginPath(); ctx.arc(0,0,rad,0,Math.PI*2);
        stroke([0.6,0.4,0.3,0.2][i], [1.2,0.7,0.6,0.4][i]); ctx.stroke();
      });
      // Star of Solomon
      const tri = (pts:[number,number][]) => {
        ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]);
        pts.forEach(p=>ctx.lineTo(p[0],p[1])); ctx.closePath();
      };
      const t1:[number,number][] = [[0,-r*0.85],[r*0.74,r*0.42],[-r*0.74,r*0.42]];
      const t2:[number,number][] = [[0,r*0.85],[r*0.74,-r*0.42],[-r*0.74,-r*0.42]];
      stroke(0.7,1.0); tri(t1); ctx.stroke();
      stroke(0.45,0.8); tri(t2); ctx.stroke();
      // Cross-hairs
      stroke(0.2,0.4);
      [[0,-r,0,r],[-r,0,r,0]].forEach(([x1,y1,x2,y2])=>{ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); });
      // Cardinal diamonds
      stroke(0.8,0); // reset
      [[0,-r],[r,0],[0,r],[-r,0]].forEach(([dx,dy])=>{
        ctx.beginPath();
        ctx.moveTo(dx*1.0, dy*1.0);
        ctx.lineTo(dx*0.06+dy*0.06, dy*0.06+dx*0.06);
        ctx.closePath();
        ctx.fillStyle=gold; ctx.globalAlpha=alpha*0.6; ctx.fill();
      });
      // Centre glow
      const cg = ctx.createRadialGradient(0,0,0,0,0,r*0.12);
      cg.addColorStop(0,'rgba(255,220,100,0.9)');
      cg.addColorStop(1,'rgba(201,146,42,0)');
      ctx.beginPath(); ctx.arc(0,0,r*0.12,0,Math.PI*2);
      ctx.fillStyle=cg; ctx.globalAlpha=alpha*0.9; ctx.fill();

      ctx.restore();
    };

    // ── Draw logos as text (TA triangle + OG) in eye shine ──────────────────────
    let logoMergePhase = 0; // 0-1 oscillating — controls separation/merge
    const drawLogosInEye = (cx:number, cy:number, eyeR:number) => {
      logoMergePhase += 0.004;
      const merge = (Math.sin(logoMergePhase) * 0.5 + 0.5); // 0=apart 1=merged
      const offset = (1 - merge) * eyeR * 0.28;

      ctx.save();
      ctx.clip(); // eye shine clip must be set by caller

      // TA logo (left, gold)
      ctx.font = `bold ${Math.round(eyeR * 0.38)}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.55 + merge * 0.25;
      ctx.fillStyle = 'rgba(201,146,42,1)';
      ctx.shadowBlur = 16; ctx.shadowColor = 'rgba(201,146,42,0.9)';
      ctx.fillText('TA', cx - offset, cy);

      // OG logo (right, bright gold)
      ctx.fillStyle = 'rgba(255,215,80,1)';
      ctx.shadowColor = 'rgba(255,215,80,0.8)';
      ctx.fillText('OG', cx + offset, cy);

      // When fully merged — flash united glyph
      if (merge > 0.85) {
        ctx.globalAlpha = (merge - 0.85) / 0.15 * 0.8;
        ctx.font = `bold ${Math.round(eyeR * 0.45)}px serif`;
        ctx.fillStyle = 'rgba(255,240,140,1)';
        ctx.shadowBlur = 30; ctx.shadowColor = 'rgba(255,230,100,1)';
        ctx.fillText('⟡', cx, cy);
      }

      ctx.restore();
    };

    // ── Main draw loop ────────────────────────────────────────────────────────────
    const draw = () => {
      frame++;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // 1. Background eye image — cover fill
      if (imgLoaded) {
        const iW = img.naturalWidth, iH = img.naturalHeight;
        const scale = Math.max(W / iW, H / iH);
        const dW = iW * scale, dH = iH * scale;
        ctx.drawImage(img, (W - dW) / 2, (H - dH) / 2, dW, dH);
      } else {
        ctx.fillStyle = '#0a0010';
        ctx.fillRect(0, 0, W, H);
      }

      // 2. Vignette overlay — deepen the purple/dark areas, keep centre bright
      const vg = ctx.createRadialGradient(W * 0.55, H * 0.48, H * 0.12, W * 0.5, H * 0.5, H * 0.75);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(0.6, 'rgba(5,0,15,0.35)');
      vg.addColorStop(1, 'rgba(0,0,8,0.72)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

      // 3. Stars drifting
      stars.forEach(s => {
        s.angle += s.speed;
        s.op += s.opDir * 0.004;
        if (s.op > 0.9 || s.op < 0.05) s.opDir *= -1;
        const x = ((s.x + Math.cos(s.angle) * 0.003) % 1) * W;
        const y = ((s.y + Math.sin(s.angle) * 0.002) % 1) * H;
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2);
        const hue = 40 + Math.sin(frame * 0.01 + s.angle) * 20;
        ctx.fillStyle = `hsla(${hue}, 80%, 75%, ${s.op})`;
        ctx.shadowBlur = s.r > 1.2 ? 6 : 0;
        ctx.shadowColor = `hsla(${hue},80%,80%,0.5)`;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // 4. Left-side energy waves (sweep from left edge, ~40% width)
      const waveMaxX = W * 0.52;
      waves.forEach(w => {
        ctx.beginPath();
        for (let px = 0; px <= waveMaxX; px += 2) {
          const t = px / waveMaxX;
          const envelope = Math.pow(Math.sin(t * Math.PI), 0.7) * (1 - t * 0.3);
          const y = H * w.yBase + Math.sin(px / W * w.freq * Math.PI * 2 + frame * w.speed + w.phaseOffset) * w.amp * envelope;
          if (px === 0) {
            ctx.moveTo(px, y);
          } else {
            ctx.lineTo(px, y);
          }
        }
        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.width;
        ctx.globalAlpha = 1;
        ctx.stroke();
      });

      // 5. Eye glow — iris highlight ring
      const eyeCX = W * 0.555, eyeCY = H * 0.47, eyeR = H * 0.09;
      const glow = ctx.createRadialGradient(eyeCX, eyeCY, eyeR * 0.1, eyeCX, eyeCY, eyeR * 1.2);
      glow.addColorStop(0, 'rgba(255,240,180,0.18)');
      glow.addColorStop(0.5, 'rgba(201,146,42,0.08)');
      glow.addColorStop(1, 'rgba(201,146,42,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

      // 6. Logos inside the eye shine — clip to iris ellipse
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(eyeCX, eyeCY, eyeR * 0.55, eyeR * 0.4, 0, 0, Math.PI * 2);
      ctx.clip();
      drawLogosInEye(eyeCX, eyeCY, eyeR * 0.55);
      ctx.restore();

      // 7. Rotating sigil — centred behind the eye
      sigilAngle += 0.004;
      drawSigil(eyeCX, eyeCY, H * 0.38, 0.18);

      // 8. Blink ─────────────────────────────────────────────────────────────────
      blinkTimer++;
      if (blinkState === 'open' && blinkTimer > BLINK_INTERVAL) {
        blinkState = 'closing'; blinkTimer = 0;
      }
      if (blinkState === 'closing') {
        blinkProgress = Math.min(1, blinkProgress + 0.06);
        if (blinkProgress >= 1) { blinkState = 'closed'; blinkTimer = 0; }
      }
      if (blinkState === 'closed' && blinkTimer > 6) {
        blinkState = 'opening';
      }
      if (blinkState === 'opening') {
        blinkProgress = Math.max(0, blinkProgress - 0.05);
        if (blinkProgress <= 0) { blinkState = 'open'; blinkTimer = 0; }
      }

      if (blinkProgress > 0) {
        // Eye region bounding box (approx)
        const eyeTop    = eyeCY - eyeR * 1.1;
        const eyeBottom = eyeCY + eyeR * 0.85;
        const eyeLeft   = eyeCX - eyeR * 2.6;
        const eyeRight  = eyeCX + eyeR * 2.0;
        const midY      = (eyeTop + eyeBottom) / 2;
        const halfH     = (eyeBottom - eyeTop) / 2;

        // Upper eyelid sweeps DOWN
        const upperClose = midY - halfH * (1 - blinkProgress);
        // Lower eyelid sweeps UP
        const lowerClose = midY + halfH * (1 - blinkProgress);

        // Dark eyelid colour — matches skin tone in image
        ctx.fillStyle = '#0a0010';

        // Upper lid
        ctx.beginPath();
        ctx.ellipse(eyeCX, eyeTop + (upperClose - eyeTop) * 0.5, (eyeRight - eyeLeft) * 0.5, Math.abs(upperClose - eyeTop) * 0.5 + 1, 0, Math.PI, 0);
        ctx.fill();

        // Lower lid
        ctx.beginPath();
        ctx.ellipse(eyeCX, eyeBottom - (eyeBottom - lowerClose) * 0.5, (eyeRight - eyeLeft) * 0.5, Math.abs(eyeBottom - lowerClose) * 0.5 + 1, 0, 0, Math.PI);
        ctx.fill();

        // Eyelash fringe glow at lid edges
        if (blinkProgress > 0.2) {
          const lg = ctx.createLinearGradient(eyeLeft, upperClose, eyeLeft, upperClose + 8);
          lg.addColorStop(0, `rgba(20,10,35,${blinkProgress * 0.6})`);
          lg.addColorStop(1, 'rgba(20,10,35,0)');
          ctx.fillStyle = lg;
          ctx.fillRect(eyeLeft, upperClose, eyeRight - eyeLeft, 8);
        }
      }

      // 9. Top & bottom gradient fade — blends into page
      const topFade = ctx.createLinearGradient(0, 0, 0, H * 0.22);
      topFade.addColorStop(0, 'rgba(8,2,18,1)');
      topFade.addColorStop(1, 'rgba(8,2,18,0)');
      ctx.fillStyle = topFade; ctx.fillRect(0, 0, W, H * 0.22);

      const btmFade = ctx.createLinearGradient(0, H * 0.72, 0, H);
      btmFade.addColorStop(0, 'rgba(8,2,18,0)');
      btmFade.addColorStop(1, 'rgba(8,2,18,1)');
      ctx.fillStyle = btmFade; ctx.fillRect(0, H * 0.72, W, H * 0.28);

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
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:1, display:'block' }}
    />
  );
}

// ─── Alchemical SVG Sigil (used in cards & join section) ────────────────────
function AlchemicalSigil({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <circle cx="100" cy="100" r="92" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.5" />
      <circle cx="100" cy="100" r="70" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 3" />
      <circle cx="100" cy="100" r="50" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.25" />
      <polygon points="100,15 174,142 26,142" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" opacity="0.55" />
      <polygon points="100,185 26,58 174,58" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" opacity="0.35" />
      <line x1="100" y1="8" x2="100" y2="192" stroke="hsl(var(--primary))" strokeWidth="0.4" opacity="0.18" />
      <line x1="8" y1="100" x2="192" y2="100" stroke="hsl(var(--primary))" strokeWidth="0.4" opacity="0.18" />
      <circle cx="100" cy="100" r="6" fill="hsl(var(--primary))" opacity="0.8" />
      <circle cx="100" cy="100" r="2.5" fill="hsl(var(--primary))" opacity="1" />
    </svg>
  );
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

// ─── Bento Card ─────────────────────────────────────────────────────────────
interface BentoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  featured?: boolean;
  tag?: string;
}

function BentoCard({ icon, title, description, href, featured, tag }: BentoCardProps) {
  return (
    <Link
      to={href}
      className={`group relative flex flex-col justify-end overflow-hidden border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 ${
      featured ? 'min-h-64' : 'min-h-44'}`
      }
      style={{
        boxShadow: 'none'
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(201,146,42,0.15), inset 0 0 0 1px rgba(201,146,42,0.3)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}>

      {/* Background geometric accent */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <AlchemicalSigil className="w-full h-full" />
      </div>

      {tag &&
      <span className="absolute top-4 right-4 text-xs font-semibold tracking-widest uppercase text-primary border border-primary/40 px-2 py-0.5">
          {tag}
        </span>
      }

      <div className="relative z-10">
        <div className="mb-3 text-primary group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))] transition-all duration-300">
          {icon}
        </div>
        <h3
          className="text-base font-bold tracking-wider text-foreground mb-1 group-hover:text-primary transition-colors duration-200"
          style={{ fontFamily: 'var(--font-heading)' }}>

          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="tracking-widest uppercase font-medium">Explore</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </Link>);

}

// ─── Stream Schedule ─────────────────────────────────────────────────────────
const streamSchedule = [
{ platform: 'Twitch', icon: <Twitch size={16} />, day: 'Monday', time: '8:00 PM AWST', game: 'Variety Stream', live: false },
{ platform: 'YouTube', icon: <Youtube size={16} />, day: 'Wednesday', time: '7:00 PM AWST', game: 'Game Reviews & Reactions', live: false },
{ platform: 'Twitch', icon: <Twitch size={16} />, day: 'Friday', time: '9:00 PM AWST', game: 'Community Night', live: true },
{ platform: 'TikTok', icon: <Radio size={16} />, day: 'Saturday', time: '3:00 PM AWST', game: 'Short Content & Clips', live: false },
{ platform: 'Kick', icon: <Radio size={16} />, day: 'TBA', time: 'Coming Soon', game: 'Live on Kick', live: false }];


// ─── Announcements ───────────────────────────────────────────────────────────
const announcements = [
{
  tag: 'Major Update',
  title: 'The Alchemism Community Portal is Now Live',
  excerpt: 'After months of development, our exclusive community hub is open. Join the inner circle and gain access to members-only content, early drops, and direct access to the OG Clan.',
  date: 'April 25, 2026',
  featured: true
},
{
  tag: 'Music',
  title: 'New EP Dropping This Month',
  excerpt: 'Exclusive tracks available to members first. Sign up to get early access.',
  date: 'April 20, 2026',
  featured: false
},
{
  tag: 'Events',
  title: 'OG Clan Interviews — Season 1',
  excerpt: 'Meet the five originals. Full interview series launching soon.',
  date: 'April 15, 2026',
  featured: false
}];


// ─── Main Page ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <>
      <title>The Alchemism — Transform. Create. Transcend.</title>
      <meta name="description" content="The Alchemism is a dark, multi-faceted creator community covering gaming, music, lifestyle coaching, streaming, and exclusive content. Join the inner circle." />
      <link rel="canonical" href="https://thealchemism.com/" />
      <meta property="og:title" content="The Alchemism — Transform. Create. Transcend." />
      <meta property="og:description" content="The Alchemism is a dark, multi-faceted creator community covering gaming, music, lifestyle coaching, streaming, and exclusive content. Join the inner circle." />
      <meta property="og:url" content="https://thealchemism.com/" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://ogthealchemist.com/api/og?title=The+Alchemism&description=Transform.+Create.+Transcend." />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="The Alchemism — Transform. Create. Transcend." />
      <meta name="twitter:description" content="The Alchemism is a dark, multi-faceted creator community covering gaming, music, lifestyle coaching, streaming, and exclusive content." />
      <meta name="twitter:image" content="https://ogthealchemist.com/api/og?title=The+Alchemism&description=Transform.+Create.+Transcend." />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "The Alchemism",
        "url": "https://thealchemism.com",
        "description": "A dark, multi-faceted creator community covering gaming, music, lifestyle coaching, streaming, and exclusive content.",
        "sameAs": [
          "https://www.twitch.tv/thealchemist007",
          "https://www.youtube.com/@thealchemism",
          "https://www.tiktok.com/@thealchemist1086",
          "https://kick.com/alchy-007",
          "https://www.instagram.com/thealchemism",
          "https://discordapp.com/invite/alchy_007"
        ]
      })}</script>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Cinematic eye — all effects rendered in one canvas */}
        <CinematicEyeCanvas />

        {/* Hero content — sits above canvas */}
        <div className="relative flex flex-col items-center text-center px-4 max-w-4xl mx-auto" style={{ zIndex: 10 }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
            className="flex items-center gap-3 mb-8">

            <div className="h-px w-12 bg-primary" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">The Inner Circle AwaitS

            </span>
            <div className="h-px w-12 bg-primary" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' as const }}
            className="text-6xl md:text-8xl font-bold tracking-widest text-foreground mb-4 leading-none"
            style={{ fontFamily: 'var(--font-heading)', textShadow: '0 0 60px rgba(201,146,42,0.2)' }}>

            THE
            <br />
            <span className="text-primary" style={{ textShadow: '0 0 40px rgba(201,146,42,0.5)' }}>
              ALCHEMISM
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55, ease: 'easeOut' as const }}
            className="text-base md:text-lg text-muted-foreground tracking-widest uppercase mb-10 max-w-xl">Gaming · Music · Coaching · Community · Exclusive ContenT


          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' as const }}
            className="flex flex-col sm:flex-row items-center gap-4">

            <motion.a
              href="#join"
              className="relative px-8 py-4 text-sm font-bold tracking-widest uppercase bg-primary text-background overflow-hidden group"
              style={{ fontFamily: 'var(--font-heading)' }}
              animate={{ boxShadow: ['0 0 10px rgba(201,146,42,0.3)', '0 0 25px rgba(201,146,42,0.6)', '0 0 10px rgba(201,146,42,0.3)'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}>

              Join the Community
            </motion.a>
            <Link
              to="/gaming"
              className="px-8 py-4 text-sm font-semibold tracking-widest uppercase border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
              style={{ fontFamily: 'var(--font-heading)' }}>

              Explore Content
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}>

          <div className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent" />
        </motion.div>
      </section>

      {/* ── SOCIAL PROOF STRIP ───────────────────────────────────────────── */}
      <section className="border-y border-border bg-card/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
            { icon: <Twitch size={18} />, label: 'Twitch', stat: '12.4K', sub: 'Followers' },
            { icon: <Youtube size={18} />, label: 'YouTube', stat: '28.1K', sub: 'Subscribers' },
            { icon: <Radio size={18} />, label: 'TikTok', stat: '45K', sub: 'Followers' },
            { icon: <Users size={18} />, label: 'Discord', stat: '3.2K', sub: 'Members' },
            { icon: <Flame size={18} />, label: 'Streams', stat: '200+', sub: 'Live Sessions' }].
            map((item) =>
            <div key={item.label} className="flex items-center gap-3">
                <div className="text-primary">{item.icon}</div>
                <div>
                  <div className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.stat}
                  </div>
                  <div className="text-xs text-muted-foreground tracking-wide">{item.sub}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── BENTO CONTENT HUB ────────────────────────────────────────────── */}
      <section className="py-24 container mx-auto px-4">
        <FadeUp className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">The Universe</p>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-wider text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}>

            Everything The Alchemism
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Row 1 — featured large cards */}
          <FadeUp delay={0.05} className="lg:col-span-2">
            <BentoCard
              icon={<Gamepad2 size={28} />}
              title="Gaming Hub"
              description="Game reviews, updates, stream schedules across all platforms, and short-form content. The full gaming experience."
              href="/gaming"
              featured
              tag="Live" />

          </FadeUp>
          <FadeUp delay={0.1} className="lg:col-span-2">
            <BentoCard
              icon={<Lock size={28} />}
              title="Exclusive Access"
              description="Members-only music, music videos, early drops, and collaborations. The inner circle gets first access to everything."
              href="/exclusive"
              featured
              tag="Members" />

          </FadeUp>

          {/* Row 2 — standard cards */}
          <FadeUp delay={0.15}>
            <BentoCard
              icon={<Music size={28} />}
              title="Music"
              description="Original tracks, music videos, and exclusive releases."
              href="/music" />

          </FadeUp>
          <FadeUp delay={0.2}>
            <BentoCard
              icon={<Users size={28} />}
              title="OG Clan"
              description="Meet the five originals. Interviews, lore, and clan history."
              href="/og-clan" />

          </FadeUp>
          <FadeUp delay={0.25}>
            <BentoCard
              icon={<Dumbbell size={28} />}
              title="Coaching"
              description="Lifestyle coaching, resources, and personal development."
              href="/coaching" />

          </FadeUp>
          <FadeUp delay={0.3}>
            <BentoCard
              icon={<ShoppingBag size={28} />}
              title="Merch Store"
              description="Official merch, brand deals, and limited drops."
              href="/merch" />

          </FadeUp>

          {/* Row 3 */}
          <FadeUp delay={0.35}>
            <BentoCard
              icon={<Calendar size={28} />}
              title="Events"
              description="Upcoming events, collabs, and influencer partnerships."
              href="/events" />

          </FadeUp>
          <FadeUp delay={0.4} className="sm:col-span-2 lg:col-span-3">
            <BentoCard
              icon={<BookOpen size={28} />}
              title="Blog & Announcements"
              description="Latest updates, community projects, polls, and announcements from The Alchemism universe. Stay in the loop."
              href="/blog"
              featured />

          </FadeUp>
        </div>
      </section>

      {/* ── STREAM SCHEDULE ──────────────────────────────────────────────── */}
      <section className="py-20 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4">
          <FadeUp className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">Go Live</p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-wider text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}>
              Stream Schedule
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 max-w-6xl mx-auto">
            {streamSchedule.map((stream, i) =>
            <FadeUp key={`${stream.platform}-${stream.day}`} delay={i * 0.07}>
                <div
                className={`relative border p-5 transition-all duration-300 ${
                stream.live ?
                'border-primary bg-primary/5' :
                'border-border bg-card hover:border-primary/40'}`
                }>

                  {stream.live &&
                <div className="flex items-center gap-2 mb-3">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                      </span>
                      <span className="text-xs font-bold tracking-widest uppercase text-primary">Live Now</span>
                    </div>
                }
                  <div className="flex items-center gap-2 text-primary mb-3">
                    {stream.icon}
                    <span className="text-xs font-semibold tracking-wide">{stream.platform}</span>
                  </div>
                  <div
                  className="text-sm font-bold text-foreground mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}>
                    {stream.day}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <Clock size={11} />
                    {stream.time}
                  </div>
                  <p className="text-xs text-muted-foreground">{stream.game}</p>
                </div>
              </FadeUp>
            )}
          </div>
        </div>
      </section>

      {/* ── PLATFORM PRESENCE ────────────────────────────────────────────── */}
      <section className="py-20 container mx-auto px-4">
        <FadeUp className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">Find Us</p>
          <h2
            className="text-3xl md:text-4xl font-bold tracking-wider text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}>
            Platform Presence
          </h2>
          <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">
            The Alchemism lives across six platforms. Follow, subscribe, and join the community wherever you are.
          </p>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
          {[
            { label: 'Twitch', sub: 'Live Streams', color: 'border-purple-500/30 hover:border-purple-500/60', text: 'text-purple-400', href: 'https://twitch.tv/thealchemist007', icon: (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>
            )},
            { label: 'YouTube', sub: 'Videos & VODs', color: 'border-red-500/30 hover:border-red-500/60', text: 'text-red-400', href: 'https://www.youtube.com/@thealchemism', icon: (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            )},
            { label: 'TikTok', sub: 'Short Clips', color: 'border-pink-500/30 hover:border-pink-500/60', text: 'text-pink-400', href: 'https://www.tiktok.com/@thealchemist1086', icon: (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            )},
            { label: 'Kick', sub: 'Coming Soon', color: 'border-green-500/30 hover:border-green-500/60', text: 'text-green-400', href: 'https://kick.com/alchy-007', icon: (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M2 2h4v7l5-7h5l-6 8 6 8h-5l-5-7v7H2V2z"/></svg>
            )},
            { label: 'SoundCloud', sub: 'Music', color: 'border-orange-500/30 hover:border-orange-500/60', text: 'text-orange-400', href: 'https://soundcloud.com/stuart-parker-179445015', icon: (
              <svg viewBox="0 0 1200 560" className="w-6 h-6" fill="currentColor"><path d="M0 400c0 55.2 44.8 100 100 100s100-44.8 100-100V280c0-22.1-17.9-40-40-40s-40 17.9-40 40v18C107.6 325 90 307 70 307c-38.7 0-70 31.3-70 70V400zM200 400V300c0-22.1 17.9-40 40-40s40 17.9 40 40v100c0 55.2-44.8 100-100 100s-100-44.8-100-100h120zM320 400V240c0-22.1 17.9-40 40-40s40 17.9 40 40v160c0 55.2-44.8 100-100 100s-100-44.8-100-100h120zM440 400V180c0-22.1 17.9-40 40-40s40 17.9 40 40v220c0 55.2-44.8 100-100 100s-100-44.8-100-100h120zM560 500c44.8 0 80-44.8 80-100V120c0-22.1-17.9-40-40-40s-40 17.9-40 40v280c0 22.1-17.9 40-40 40s-40-17.9-40-40V120c0-22.1-17.9-40-40-40s-40 17.9-40 40V400c0 55.2 35.8 100 80 100h80zM700 500h400c55.2 0 100-44.8 100-100V260c0-55.2-44.8-100-100-100-15.2 0-29.6 3.4-42.4 9.4C1041.8 110.8 992 72 933 72c-81.6 0-147.7 66.4-147.7 148.2 0 5.2.3 10.2.9 15.2C762 242.5 736 275.7 736 315.4V400c0 55.2 35.8 100 80 100H700z"/></svg>
            )},
            { label: 'Spotify', sub: 'Coming Soon', color: 'border-emerald-500/10 opacity-40', text: 'text-emerald-400', href: '#', icon: (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            )},
            { label: 'Discord', sub: 'Community', color: 'border-indigo-500/30 hover:border-indigo-500/60', text: 'text-indigo-400', href: 'https://discordapp.com/invite/alchy_007', icon: (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.134 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            )},
          ].map((p, i) => (
            <FadeUp key={p.label} delay={i * 0.07}>
              <a
                href={p.href === '#' ? undefined : p.href}
                target={p.href === '#' ? undefined : '_blank'}
                rel={p.href === '#' ? undefined : 'noopener noreferrer'}
                onClick={p.href === '#' ? (e) => e.preventDefault() : undefined}
                className={`group block border bg-card p-5 text-center transition-all duration-300 ${p.color} ${p.href === '#' ? 'cursor-not-allowed' : ''}`}
              >
                <div className={`flex justify-center mb-3 ${p.text} group-hover:scale-110 transition-transform duration-200`}>
                  {p.icon}
                </div>
                <p className={`text-xs font-bold mb-0.5 ${p.text}`} style={{ fontFamily: 'var(--font-heading)' }}>
                  {p.label}
                </p>
                <p className="text-xs text-muted-foreground">{p.sub}</p>
              </a>
            </FadeUp>
          ))}
        </div>
      </section>
      <section className="py-24 container mx-auto px-4">
        <FadeUp className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">Latest</p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-wider text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}>

              Announcements
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden md:flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors duration-200">

            View All <ChevronRight size={14} />
          </Link>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Featured */}
          <FadeUp delay={0.05} className="md:col-span-2">
            <div className="group border border-border bg-card p-8 h-full hover:border-primary/40 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-primary" />
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary border border-primary/40 px-2 py-0.5 mb-5">
                {announcements[0].tag}
              </span>
              <h3
                className="text-xl md:text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-200"
                style={{ fontFamily: 'var(--font-heading)' }}>

                {announcements[0].title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{announcements[0].excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{announcements[0].date}</span>
                <Link
                  to="/blog"
                  className="flex items-center gap-1 text-xs font-semibold tracking-widest uppercase text-primary hover:gap-2 transition-all duration-200">

                  Read More <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </FadeUp>

          {/* Smaller cards */}
          <div className="flex flex-col gap-3">
            {announcements.slice(1).map((post, i) =>
            <FadeUp key={post.title} delay={0.1 + i * 0.08}>
                <div className="group border border-border bg-card p-6 hover:border-primary/40 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-primary/50" />
                  <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary border border-primary/30 px-2 py-0.5 mb-3">
                    {post.tag}
                  </span>
                  <h3
                  className="text-sm font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-heading)' }}>

                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
              </FadeUp>
            )}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY SIGN-UP ────────────────────────────────────────────── */}
      <section id="join" className="relative py-28 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/pages/home/community-bg)` }} />

        <div className="absolute inset-0 bg-background/90" />

        {/* Watermark sigil */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AlchemicalSigil className="w-[500px] h-[500px] opacity-5" />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-2xl text-center">
          <FadeUp>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">
                Initiation
              </span>
              <div className="h-px w-12 bg-primary" />
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-wider text-foreground mb-4"
              style={{ fontFamily: 'var(--font-heading)', textShadow: '0 0 40px rgba(201,146,42,0.2)' }}>

              Enter the Inner Circle
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">Join The Alchemism community and gain access to exclusive content, early drops, member-only events/competitions, and direct connection with the OG Clan. This is where the real work happens.

            </p>

            {submitted ?
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-primary bg-primary/10 px-8 py-6">

                <p
                className="text-primary font-bold tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-heading)' }}>

                  Initiation Accepted
                </p>
                <p className="text-sm text-muted-foreground mt-2">Welcome to The Alchemism. Watch your inbox.</p>
              </motion.div> :

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200 text-sm" />

                <motion.button
                type="submit"
                className="px-6 py-3 bg-primary text-background text-sm font-bold tracking-widest uppercase whitespace-nowrap"
                style={{ fontFamily: 'var(--font-heading)' }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(201,146,42,0.4)' }}
                whileTap={{ scale: 0.97 }}>

                  Join Now
                </motion.button>
              </form>
            }

            <p className="text-xs text-muted-foreground mt-4">
              No spam. Unsubscribe anytime. The Alchemism respects your privacy.
            </p>
          </FadeUp>
        </div>
      </section>
    </>);

}