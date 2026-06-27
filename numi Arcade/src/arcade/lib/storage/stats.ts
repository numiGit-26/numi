/**
 * Local-first persistence. Stats live in the browser today, behind this
 * interface. A cloud backend can implement the same shape later for global
 * and office leaderboards with no change to game code.
 */
export interface MatchRecord {
  date: number;
  difficulty: string;
  won: boolean;
  player: number;
  opponent: number;
  longestRally: number;
  durationMs: number;
}

export interface Stats {
  plays: number;
  wins: number;
  longestRally: number;
  bestWinMs: number | null;
  history: MatchRecord[];
}

const KEY = "numi-pong-stats-v1";

const EMPTY: Stats = { plays: 0, wins: 0, longestRally: 0, bestWinMs: null, history: [] };

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY };
  }
}

export function recordMatch(r: MatchRecord): Stats {
  const s = loadStats();
  s.plays += 1;
  if (r.won) s.wins += 1;
  s.longestRally = Math.max(s.longestRally, r.longestRally);
  if (r.won && (s.bestWinMs == null || r.durationMs < s.bestWinMs)) s.bestWinMs = r.durationMs;
  s.history = [r, ...s.history].slice(0, 25);
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
  return s;
}
