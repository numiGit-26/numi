import { useEffect, useRef } from "react";
import { GameLoop } from "../../arcade/lib/engine/loop";
import { Input } from "../../arcade/lib/engine/input";
import { Particles } from "../../arcade/lib/engine/particles";
import { Audio } from "../../arcade/lib/engine/audio";
import { Pong, type Side, type MatchStats } from "./logic/pong";
import { getDifficulty, type DifficultyId } from "./config";

const KONAMI = "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a";

interface Props {
  difficultyId: DifficultyId;
  twoPlayer: boolean;
  matchKey: number;
  paused: boolean;
  muted: boolean;
  audio: Audio;
  onScore?: (scorer: Side, p: number, o: number) => void;
  onRally?: (rally: number) => void;
  onGameOver?: (winner: Side, stats: MatchStats) => void;
  onPauseToggle?: () => void;
  onKonami?: () => void;
}

export function PongCanvas(props: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(props.paused);
  const cbRef = useRef(props);
  cbRef.current = props;
  pausedRef.current = props.paused;

  useEffect(() => { props.audio.muted = props.muted; }, [props.muted, props.audio]);

  // Build the game once per match. Restart by bumping matchKey.
  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    const input = new Input();
    const particles = new Particles();
    const audio = props.audio;
    particles.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pong = new Pong(getDifficulty(props.difficultyId), props.twoPlayer, {
      onScore: (s, p, o) => cbRef.current.onScore?.(s, p, o),
      onRally: (r) => cbRef.current.onRally?.(r),
      onGameOver: (w, st) => cbRef.current.onGameOver?.(w, st),
    });

    const glyph = new Image();
    glyph.src = "/brand/numi-glyph.svg";

    let cssW = 0, cssH = 0, dpr = 1;
    const fit = () => {
      const rect = wrap.getBoundingClientRect();
      cssW = Math.max(320, rect.width);
      cssH = Math.max(240, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      pong.resize(cssW, cssH);
    };
    fit();
    pong.start();

    input.attach(canvas);
    input.setHandlers({
      onPauseToggle: () => cbRef.current.onPauseToggle?.(),
      onCode: (h) => { if (h.endsWith(KONAMI)) cbRef.current.onKonami?.(); },
    });

    const ro = new ResizeObserver(fit);
    ro.observe(wrap);

    const update = (dt: number) => {
      if (pausedRef.current) return;
      pong.update(dt, input, particles, audio);
      particles.update(dt);
    };
    const render = (alpha: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      const shake = particles.shakeOffset();
      ctx.save();
      ctx.translate(shake.x, shake.y);
      pong.render(ctx, alpha, glyph);
      particles.render(ctx);
      ctx.restore();
    };

    const loop = new GameLoop(update, render);
    loop.start();

    return () => {
      loop.stop();
      ro.disconnect();
      input.detach(canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.difficultyId, props.twoPlayer, props.matchKey]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
