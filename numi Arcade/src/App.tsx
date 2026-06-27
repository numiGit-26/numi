import { useCallback, useMemo, useRef, useState } from "react";
import { Loading } from "./arcade/components/Loading";
import { Menu } from "./arcade/components/Menu";
import { DifficultySelect } from "./arcade/components/DifficultySelect";
import { Hud } from "./arcade/components/Hud";
import { PauseOverlay } from "./arcade/components/PauseOverlay";
import { GameOver } from "./arcade/components/GameOver";
import { PongCanvas } from "./games/pong/PongCanvas";
import { Audio } from "./arcade/lib/engine/audio";
import { getDifficulty, type DifficultyId } from "./games/pong/config";
import { loadStats, recordMatch, type Stats } from "./arcade/lib/storage/stats";
import type { Side, MatchStats } from "./games/pong/logic/pong";

type Screen = "loading" | "menu" | "difficulty" | "playing" | "over";

interface Result extends MatchStats { won: boolean; label: string; }

export function App() {
  const audioRef = useRef(new Audio());
  const [screen, setScreen] = useState<Screen>("loading");
  const [difficultyId, setDifficultyId] = useState<DifficultyId>("graduate");
  const [twoPlayer, setTwoPlayer] = useState(false);
  const [matchKey, setMatchKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [scores, setScores] = useState({ p: 0, o: 0 });
  const [rally, setRally] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [toast, setToast] = useState<string | null>(null);

  const label = twoPlayer ? "Player 2" : getDifficulty(difficultyId).label;

  const startMatch = useCallback((id: DifficultyId, twoP: boolean) => {
    audioRef.current.unlock();
    setDifficultyId(id);
    setTwoPlayer(twoP);
    setScores({ p: 0, o: 0 });
    setRally(0);
    setResult(null);
    setPaused(false);
    setMatchKey((k) => k + 1);
    setScreen("playing");
  }, []);

  const onGameOver = useCallback((winner: Side, st: MatchStats) => {
    const won = winner === "player";
    const lbl = twoPlayerRef.current ? "Player 2" : getDifficulty(diffRef.current).label;
    setResult({ ...st, won, label: lbl });
    setStats(recordMatch({
      date: Date.now(), difficulty: lbl, won,
      player: st.player, opponent: st.opponent,
      longestRally: st.longestRally, durationMs: st.durationMs,
    }));
    audioRef.current.play("win");
    setScreen("over");
  }, []);

  // Refs so the stable onGameOver reads current settings.
  const twoPlayerRef = useRef(twoPlayer); twoPlayerRef.current = twoPlayer;
  const diffRef = useRef(difficultyId); diffRef.current = difficultyId;

  const toggleMute = () => { audioRef.current.unlock(); setMuted((m) => !m); };
  const togglePause = useCallback(() => { setPaused((p) => !p); }, []);

  const onKonami = useCallback(() => {
    setToast("CTO mode unlocked");
    setTimeout(() => setToast(null), 2200);
    startMatch("cto", false);
  }, [startMatch]);

  const game = useMemo(() => (
    <PongCanvas
      difficultyId={difficultyId}
      twoPlayer={twoPlayer}
      matchKey={matchKey}
      paused={paused || screen !== "playing"}
      muted={muted}
      audio={audioRef.current}
      onScore={(_s, p, o) => setScores({ p, o })}
      onRally={(r) => setRally(r)}
      onGameOver={onGameOver}
      onPauseToggle={togglePause}
      onKonami={onKonami}
    />
  ), [difficultyId, twoPlayer, matchKey, paused, muted, screen, onGameOver, togglePause, onKonami]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {(screen === "playing" || screen === "over") && game}

      {screen === "loading" && <Loading onDone={() => setScreen("menu")} />}

      {screen === "menu" && (
        <Menu
          stats={stats}
          muted={muted}
          onToggleMute={toggleMute}
          onPlay={() => { audioRef.current.unlock(); setScreen("difficulty"); }}
          onTwoPlayer={() => startMatch("senior", true)}
        />
      )}

      {screen === "difficulty" && (
        <DifficultySelect onPick={(id) => startMatch(id, false)} onBack={() => setScreen("menu")} />
      )}

      {screen === "playing" && (
        <>
          <Hud
            player={scores.p}
            opponent={scores.o}
            rally={rally}
            label={label}
            muted={muted}
            onPause={togglePause}
            onToggleMute={toggleMute}
          />
          {paused && (
            <PauseOverlay
              onResume={() => setPaused(false)}
              onRestart={() => startMatch(difficultyId, twoPlayer)}
              onMenu={() => setScreen("menu")}
            />
          )}
        </>
      )}

      {screen === "over" && result && (
        <GameOver
          won={result.won}
          label={result.label}
          player={result.player}
          opponent={result.opponent}
          longestRally={result.longestRally}
          durationMs={result.durationMs}
          onPlayAgain={() => startMatch(difficultyId, twoPlayer)}
          onMenu={() => setScreen("menu")}
        />
      )}

      {toast && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-sun text-navy-deep font-extrabold px-5 py-2 rounded-full anim-pop">
          {toast}
        </div>
      )}
    </div>
  );
}
