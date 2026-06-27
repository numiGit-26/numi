interface Props {
  player: number;
  opponent: number;
  rally: number;
  label: string;
  muted: boolean;
  onPause: () => void;
  onToggleMute: () => void;
}

export function Hud({ player, opponent, rally, label, muted, onPause, onToggleMute }: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 p-4 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-5 bg-black/20 backdrop-blur-md rounded-full px-5 py-2">
          <Score who="You" value={player} accent="text-teal" />
          <span className="text-white/25 text-sm">vs</span>
          <Score who={label} value={opponent} accent="text-white" />
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <button onClick={onToggleMute} className="rounded-full bg-black/20 backdrop-blur-md px-3 py-2 text-xs font-semibold text-white/70 hover:text-white">
            {muted ? "Unmute" : "Mute"}
          </button>
          <button onClick={onPause} className="rounded-full bg-black/20 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white/70 hover:text-white">
            Pause
          </button>
        </div>
      </div>
      {rally >= 3 && (
        <div className="mt-3 text-center anim-pop">
          <span className="text-sun font-black text-sm tracking-wide">RALLY {rally}</span>
        </div>
      )}
    </div>
  );
}

function Score({ who, value, accent }: { who: string; value: number; accent: string }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className={`text-2xl font-black ${accent}`}>{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-white/40 mt-1">{who}</span>
    </div>
  );
}
