import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart2, Check, ChevronRight, RefreshCw } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PollOption {
  id: string;
  label: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt?: string;
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const POLLS: Poll[] = [
  {
    id: 'poll-1',
    question: 'What content do you want more of from The Alchemism?',
    options: [
      { id: 'a', label: 'Deep-dive mindset articles', votes: 312 },
      { id: 'b', label: 'Stream VODs & highlights', votes: 198 },
      { id: 'c', label: 'Behind-the-scenes music content', votes: 241 },
      { id: 'd', label: 'Coaching breakdowns & case studies', votes: 175 },
    ],
    totalVotes: 926,
    endsAt: 'May 5, 2026',
  },
  {
    id: 'poll-2',
    question: 'Which platform do you primarily follow The Alchemism on?',
    options: [
      { id: 'a', label: 'Twitch', votes: 287 },
      { id: 'b', label: 'YouTube', votes: 354 },
      { id: 'c', label: 'TikTok', votes: 219 },
      { id: 'd', label: 'Discord', votes: 166 },
    ],
    totalVotes: 1026,
    endsAt: 'May 10, 2026',
  },
  {
    id: 'poll-3',
    question: 'What\'s the biggest barrier stopping you from levelling up right now?',
    options: [
      { id: 'a', label: 'Lack of consistency', votes: 441 },
      { id: 'b', label: 'No clear direction or strategy', votes: 298 },
      { id: 'c', label: 'Time — too much going on', votes: 372 },
      { id: 'd', label: 'Mindset & self-belief', votes: 215 },
    ],
    totalVotes: 1326,
    endsAt: 'May 15, 2026',
  },
];

// ─── Single Poll ──────────────────────────────────────────────────────────────
function SinglePoll({ poll }: { poll: Poll }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  const [localVotes, setLocalVotes] = useState<Record<string, number>>(
    Object.fromEntries(poll.options.map((o) => [o.id, o.votes]))
  );
  const [localTotal, setLocalTotal] = useState(poll.totalVotes);

  function handleVote() {
    if (!selected || voted) return;
    setLocalVotes((prev) => ({ ...prev, [selected]: prev[selected] + 1 }));
    setLocalTotal((t) => t + 1);
    setVoted(true);
  }

  function handleReset() {
    setSelected(null);
    setVoted(false);
    setLocalVotes(Object.fromEntries(poll.options.map((o) => [o.id, o.votes])));
    setLocalTotal(poll.totalVotes);
  }

  const maxVotes = Math.max(...Object.values(localVotes));

  return (
    <div className="flex flex-col h-full">
      <h3
        className="text-sm font-bold text-foreground leading-snug mb-5"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {poll.question}
      </h3>

      <div className="flex flex-col gap-2 flex-1">
        <AnimatePresence mode="wait">
          {!voted ? (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2"
            >
              {poll.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className={`relative w-full text-left px-4 py-3 border text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-between gap-3 ${
                    selected === opt.id
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  <span>{opt.label}</span>
                  {selected === opt.id && (
                    <span className="w-4 h-4 bg-primary flex items-center justify-center shrink-0">
                      <Check size={10} className="text-background" />
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-2"
            >
              {poll.options.map((opt) => {
                const votes = localVotes[opt.id];
                const pct = localTotal > 0 ? Math.round((votes / localTotal) * 100) : 0;
                const isWinner = votes === maxVotes;
                const isSelected = opt.id === selected;

                return (
                  <div key={opt.id} className="relative overflow-hidden border border-border">
                    {/* Bar fill */}
                    <motion.div
                      className={`absolute inset-y-0 left-0 ${isWinner ? 'bg-primary/20' : 'bg-muted/60'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.1 }}
                    />
                    <div className="relative flex items-center justify-between px-4 py-3 gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        {isSelected && (
                          <span className="w-4 h-4 bg-primary flex items-center justify-center shrink-0">
                            <Check size={9} className="text-background" />
                          </span>
                        )}
                        <span
                          className={`text-xs font-semibold truncate ${
                            isWinner ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {opt.label}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold shrink-0 tabular-nums ${
                          isWinner ? 'text-primary' : 'text-muted-foreground'
                        }`}
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {localTotal.toLocaleString()} votes
          {poll.endsAt && <> · Ends {poll.endsAt}</>}
        </span>

        {!voted ? (
          <button
            onClick={handleVote}
            disabled={!selected}
            className={`flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase transition-all duration-200 ${
              selected
                ? 'text-primary hover:gap-2.5'
                : 'text-muted-foreground cursor-not-allowed'
            }`}
          >
            Vote <ChevronRight size={11} />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw size={10} /> Vote again
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Poll Widget (exported) ───────────────────────────────────────────────────
export default function PollWidget() {
  const [activePoll, setActivePoll] = useState(0);

  return (
    <div className="border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <BarChart2 size={15} className="text-primary" />
          <span
            className="text-xs font-bold tracking-widest uppercase text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Community Poll
          </span>
        </div>
        {/* Poll tabs */}
        <div className="flex items-center gap-1">
          {POLLS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActivePoll(i)}
              className={`w-6 h-6 text-xs font-bold border transition-all duration-200 ${
                activePoll === i
                  ? 'bg-primary border-primary text-background'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Poll body */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePoll}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' as const }}
          >
            <SinglePoll poll={POLLS[activePoll]} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
