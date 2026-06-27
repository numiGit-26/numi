import { Logo } from "./ui";
import { DIFFICULTIES, type DifficultyId } from "../../games/pong/config";

export function DifficultySelect({
  onPick, onBack,
}: { onPick: (id: DifficultyId) => void; onBack: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <header className="flex items-center justify-between p-6">
        <Logo />
        <button onClick={onBack} className="text-white/60 hover:text-white text-sm font-semibold">Back</button>
      </header>
      <main className="flex-1 grid place-items-center px-6 pb-10">
        <div className="w-full max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-center mb-2">Choose your opponent</h2>
          <p className="text-center text-white/45 mb-8">How good is the engineer across the table?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DIFFICULTIES.map((d, i) => (
              <button
                key={d.id}
                onClick={() => onPick(d.id)}
                className="group text-left rounded-2xl p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal/60 transition-all anim-fadeup"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold">{d.label}</span>
                  <Meter level={i + 1} />
                </div>
                <span className="text-white/45 text-sm leading-snug">{d.blurb}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function Meter({ level }: { level: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className={`w-1.5 h-3 rounded-sm ${i < level ? "bg-teal" : "bg-white/15"}`} />
      ))}
    </span>
  );
}
