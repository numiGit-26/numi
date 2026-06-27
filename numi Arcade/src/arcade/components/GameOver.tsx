import { useState } from "react";
import { Button } from "./ui";
import { downloadScoreCard, resultLine, type ShareData } from "../lib/share/scorecard";

interface Props {
  won: boolean;
  label: string;
  player: number;
  opponent: number;
  longestRally: number;
  durationMs: number;
  onPlayAgain: () => void;
  onMenu: () => void;
}

const WIN_LINES = [
  "Hired. You raised the bar.",
  "Offer accepted. Clean win.",
  "That is senior-level form.",
];
const LOSS_LINES = [
  "Strong pipeline. Go again.",
  "Close. The next round is yours.",
  "Good rallies. Run it back.",
];

export function GameOver(p: Props) {
  const [copied, setCopied] = useState(false);
  const data: ShareData = {
    won: p.won, label: p.label, player: p.player,
    opponent: p.opponent, longestRally: p.longestRally, durationMs: p.durationMs,
  };
  const line = (p.won ? WIN_LINES : LOSS_LINES)[Math.floor(Math.random() * 3)];

  const copy = async () => {
    try { await navigator.clipboard.writeText(resultLine(data)); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };

  return (
    <div className="absolute inset-0 grid place-items-center bg-navy-deep/70 backdrop-blur-md px-6">
      <div className="text-center anim-pop max-w-md">
        <h2 className="text-5xl font-black tracking-tighter mb-2" style={{ color: p.won ? "#FCE300" : "#00AEC7" }}>
          {p.won ? "Victory" : "Good game"}
        </h2>
        <p className="text-white/55 mb-6">{line}</p>

        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex flex-col"><span className="text-4xl font-black text-teal">{p.player}</span><span className="text-white/40 text-xs uppercase tracking-wide">You</span></div>
          <span className="text-white/25">:</span>
          <div className="flex flex-col"><span className="text-4xl font-black">{p.opponent}</span><span className="text-white/40 text-xs uppercase tracking-wide">{p.label}</span></div>
        </div>

        <div className="flex items-center justify-center gap-8 mb-8 text-sm">
          <div className="flex flex-col"><span className="text-xl font-black text-sun">{p.longestRally}</span><span className="text-white/40">Longest rally</span></div>
          <div className="flex flex-col"><span className="text-xl font-black text-sun">{(p.durationMs / 1000).toFixed(1)}s</span><span className="text-white/40">Match time</span></div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button onClick={p.onPlayAgain}>Play Again</Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => downloadScoreCard(data)}>Share card</Button>
            <Button variant="ghost" onClick={copy}>{copied ? "Copied" : "Copy result"}</Button>
          </div>
          <Button variant="ghost" onClick={p.onMenu}>Main Menu</Button>
        </div>
      </div>
    </div>
  );
}
