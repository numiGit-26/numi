/**
 * numi Pong configuration. Difficulty levels are themed as a tech career
 * ladder, Graduate through to CTO. Each plays genuinely differently:
 * a faster, smarter opponent and a quicker ball as you climb.
 */
export type DifficultyId = "graduate" | "mid" | "senior" | "staff" | "principal" | "cto";

export interface Difficulty {
  id: DifficultyId;
  label: string;
  blurb: string;
  /** Opponent max paddle speed as a fraction of field height per second. */
  aiSpeed: number;
  /** 0..1, how accurately the AI predicts the ball. Lower misses more. */
  aiSkill: number;
  /** Ball base speed as a fraction of field width per second. */
  ballSpeed: number;
}

export const DIFFICULTIES: Difficulty[] = [
  { id: "graduate", label: "Graduate", blurb: "Eager, still learning the ropes.", aiSpeed: 0.85, aiSkill: 0.55, ballSpeed: 0.52 },
  { id: "mid", label: "Mid-Level", blurb: "Solid and dependable.", aiSpeed: 1.05, aiSkill: 0.7, ballSpeed: 0.6 },
  { id: "senior", label: "Senior", blurb: "Reads the play two moves ahead.", aiSpeed: 1.25, aiSkill: 0.8, ballSpeed: 0.68 },
  { id: "staff", label: "Staff Engineer", blurb: "Quietly excellent. Rarely caught out.", aiSpeed: 1.45, aiSkill: 0.88, ballSpeed: 0.76 },
  { id: "principal", label: "Principal", blurb: "Sets the standard for everyone else.", aiSpeed: 1.7, aiSkill: 0.93, ballSpeed: 0.84 },
  { id: "cto", label: "CTO", blurb: "Relentless. You will have to earn this.", aiSpeed: 2.0, aiSkill: 0.98, ballSpeed: 0.94 },
];

export const WIN_SCORE = 11; // first to 11, win by 2
export const WIN_BY = 2;

export function getDifficulty(id: DifficultyId): Difficulty {
  return DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[0];
}
