import { Button, Logo } from "./ui";
import type { Stats } from "../lib/storage/stats";

interface Props {
  stats: Stats;
  muted: boolean;
  onToggleMute: () => void;
  onPlay: () => void;
  onTwoPlayer: () => void;
}

export function Menu({ stats, muted, onToggleMute, onPlay, onTwoPlayer }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <header className="flex items-center justify-between p-6">
        <Logo />
        <button onClick={onToggleMute} className="text-white/60 hover:text-white text-sm font-semibold">
          {muted ? "Sound off" : "Sound on"}
        </button>
      </header>

      <main className="flex-1 grid place-items-center px-6">
        <div className="text-center anim-fadeup">
          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter mb-3">
            numi <span className="text-teal">Pong</span>
          </h1>
          <p className="text-white/50 mb-10 max-w-md mx-auto">
            Classic Pong, unmistakably numi. First to 11, win by 2. Smile included.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={onPlay}>Play</Button>
            <Button variant="ghost" onClick={onTwoPlayer}>Two Player</Button>
          </div>

          {stats.plays > 0 && (
            <div className="mt-12 flex items-center justify-center gap-8 text-sm">
              <Stat label="Played" value={stats.plays} />
              <Stat label="Wins" value={stats.wins} />
              <Stat label="Longest rally" value={stats.longestRally} />
            </div>
          )}
        </div>
      </main>

      <footer className="p-6 text-center text-white/30 text-xs">
        Arrow keys or drag to play. Player two uses W and S. Press P to pause.
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-black text-sun">{value}</span>
      <span className="text-white/40">{label}</span>
    </div>
  );
}
