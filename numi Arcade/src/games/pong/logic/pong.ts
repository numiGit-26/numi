/**
 * numi Pong core logic. Framework-free and engine-driven. The React host
 * feeds it input, particles and audio each fixed step, then renders it.
 */
import type { Input } from "../../../arcade/lib/engine/input";
import type { Particles } from "../../../arcade/lib/engine/particles";
import type { Audio } from "../../../arcade/lib/engine/audio";
import { Difficulty, WIN_SCORE, WIN_BY } from "../config";

export type Side = "player" | "opponent";

export interface MatchStats {
  player: number;
  opponent: number;
  longestRally: number;
  durationMs: number;
}

export interface PongCallbacks {
  onScore?: (scorer: Side, p: number, o: number) => void;
  onRally?: (rally: number) => void;
  onGameOver?: (winner: Side, stats: MatchStats) => void;
}

const COLOR = { teal: "#00AEC7", sun: "#FCE300", navyLight: "#0A3A55", white: "#FFFFFF" };

export class Pong {
  W = 1000;
  H = 600;

  private pPaddle = 300; // left paddle centre y
  private oPaddle = 300; // right paddle centre y
  private bx = 500;
  private by = 300;
  private bvx = 0;
  private bvy = 0;
  private prevBx = 500;
  private prevBy = 300;

  player = 0;
  opponent = 0;
  rally = 0;
  longestRally = 0;
  over = false;
  winner: Side | null = null;

  private startTime = 0;
  private aiError = 0;
  private aiErrorTimer = 0;

  constructor(
    private diff: Difficulty,
    private twoPlayer: boolean,
    private cb: PongCallbacks = {}
  ) {}

  get paddleH() { return this.H * 0.18; }
  get paddleW() { return Math.max(10, this.W * 0.014); }
  get margin() { return this.W * 0.04; }
  get ballR() { return this.H * 0.03; }

  resize(w: number, h: number) {
    const ry = h / this.H;
    this.pPaddle *= ry; this.oPaddle *= ry;
    this.by *= ry; this.prevBy *= ry;
    const rx = w / this.W;
    this.bx *= rx; this.prevBx *= rx;
    this.W = w; this.H = h;
  }

  start() {
    this.player = 0; this.opponent = 0;
    this.rally = 0; this.longestRally = 0;
    this.over = false; this.winner = null;
    this.pPaddle = this.H / 2; this.oPaddle = this.H / 2;
    this.startTime = performance.now();
    this.serve(Math.random() < 0.5 ? "player" : "opponent");
  }

  private serve(toward: Side) {
    this.bx = this.W / 2; this.by = this.H / 2;
    this.prevBx = this.bx; this.prevBy = this.by;
    this.rally = 0;
    const dir = toward === "player" ? -1 : 1;
    const angle = (Math.random() - 0.5) * 0.6; // shallow serve
    const speed = this.W * this.diff.ballSpeed;
    this.bvx = Math.cos(angle) * speed * dir;
    this.bvy = Math.sin(angle) * speed;
  }

  update(dt: number, input: Input, particles: Particles, audio: Audio) {
    if (this.over) return;

    const paddleSpeed = this.H * 1.7;
    // Player paddle (left).
    if (input.touchY != null) {
      this.pPaddle = input.touchY * this.H;
    } else {
      if (input.up) this.pPaddle -= paddleSpeed * dt;
      if (input.down) this.pPaddle += paddleSpeed * dt;
    }
    // Opponent paddle (right): human in two-player, else AI.
    if (this.twoPlayer) {
      if (input.touchY2 != null) this.oPaddle = input.touchY2 * this.H;
      else {
        if (input.up2) this.oPaddle -= paddleSpeed * dt;
        if (input.down2) this.oPaddle += paddleSpeed * dt;
      }
    } else {
      this.updateAI(dt);
    }
    this.clampPaddles();

    // Integrate ball.
    this.prevBx = this.bx; this.prevBy = this.by;
    this.bx += this.bvx * dt;
    this.by += this.bvy * dt;

    this.collide(particles, audio);
  }

  private updateAI(dt: number) {
    this.aiErrorTimer -= dt;
    if (this.aiErrorTimer <= 0) {
      this.aiErrorTimer = 0.25 + Math.random() * 0.3;
      this.aiError = (Math.random() - 0.5) * (1 - this.diff.aiSkill) * this.H * 0.9;
    }
    let target: number;
    if (this.bvx > 0) target = this.by + this.aiError; // ball incoming
    else target = this.H / 2; // recover to centre
    const speed = this.H * this.diff.aiSpeed;
    const diff = target - this.oPaddle;
    const step = Math.sign(diff) * Math.min(Math.abs(diff), speed * dt);
    this.oPaddle += step;
  }

  private clampPaddles() {
    const half = this.paddleH / 2;
    this.pPaddle = Math.max(half, Math.min(this.H - half, this.pPaddle));
    this.oPaddle = Math.max(half, Math.min(this.H - half, this.oPaddle));
  }

  private collide(particles: Particles, audio: Audio) {
    const r = this.ballR;
    // Top / bottom walls.
    if (this.by - r < 0 && this.bvy < 0) {
      this.by = r; this.bvy *= -1;
      audio.play("wall"); particles.burst(this.bx, this.by, COLOR.teal, 8, 160);
    } else if (this.by + r > this.H && this.bvy > 0) {
      this.by = this.H - r; this.bvy *= -1;
      audio.play("wall"); particles.burst(this.bx, this.by, COLOR.teal, 8, 160);
    }

    const half = this.paddleH / 2;
    const px = this.margin + this.paddleW;
    const ox = this.W - this.margin - this.paddleW;

    // Left paddle.
    if (this.bvx < 0 && this.bx - r < px && this.bx - r > this.margin - r) {
      if (Math.abs(this.by - this.pPaddle) < half + r) {
        this.bx = px + r;
        this.reflect(this.pPaddle, 1, particles, audio);
      }
    }
    // Right paddle.
    if (this.bvx > 0 && this.bx + r > ox && this.bx + r < this.W - this.margin + r) {
      if (Math.abs(this.by - this.oPaddle) < half + r) {
        this.bx = ox - r;
        this.reflect(this.oPaddle, -1, particles, audio);
      }
    }

    // Scoring.
    if (this.bx + r < 0) this.score("opponent");
    else if (this.bx - r > this.W) this.score("player");
  }

  private reflect(paddleY: number, dir: 1 | -1, particles: Particles, audio: Audio) {
    const rel = (this.by - paddleY) / (this.paddleH / 2); // -1..1
    const bounce = Math.max(-1, Math.min(1, rel));
    const speed = Math.hypot(this.bvx, this.bvy) * 1.04; // accelerate slightly
    const maxAngle = 0.9;
    const angle = bounce * maxAngle;
    this.bvx = Math.cos(angle) * speed * dir;
    this.bvy = Math.sin(angle) * speed;
    this.rally += 1;
    this.longestRally = Math.max(this.longestRally, this.rally);
    this.cb.onRally?.(this.rally);
    audio.play("paddle");
    particles.burst(this.bx, this.by, COLOR.sun, 18, 260);
    particles.addShake(6);
  }

  private score(scorer: Side) {
    if (scorer === "player") this.player += 1; else this.opponent += 1;
    this.cb.onScore?.(scorer, this.player, this.opponent);
    this.rally = 0;

    const lead = Math.abs(this.player - this.opponent);
    const top = Math.max(this.player, this.opponent);
    if (top >= WIN_SCORE && lead >= WIN_BY) {
      this.over = true;
      this.winner = this.player > this.opponent ? "player" : "opponent";
      this.cb.onGameOver?.(this.winner, {
        player: this.player, opponent: this.opponent,
        longestRally: this.longestRally,
        durationMs: performance.now() - this.startTime,
      });
      return;
    }
    this.serve(scorer === "player" ? "opponent" : "player");
  }

  render(c: CanvasRenderingContext2D, alpha: number, glyph: HTMLImageElement | null) {
    const W = this.W, H = this.H;
    // Centre seam.
    c.save();
    c.strokeStyle = "rgba(255,255,255,0.12)";
    c.lineWidth = Math.max(2, W * 0.003);
    c.setLineDash([H * 0.03, H * 0.025]);
    c.beginPath(); c.moveTo(W / 2, 0); c.lineTo(W / 2, H); c.stroke();
    c.restore();

    // Paddles.
    const ph = this.paddleH, pw = this.paddleW, half = ph / 2;
    const radius = pw / 2;
    this.roundRect(c, this.margin, this.pPaddle - half, pw, ph, radius);
    c.fillStyle = COLOR.teal; c.fill();
    this.roundRect(c, W - this.margin - pw, this.oPaddle - half, pw, ph, radius);
    c.fillStyle = COLOR.white; c.fill();

    // Ball with interpolation.
    const bx = this.prevBx + (this.bx - this.prevBx) * alpha;
    const by = this.prevBy + (this.by - this.prevBy) * alpha;
    const r = this.ballR;

    // Trail glow.
    const grad = c.createRadialGradient(bx, by, r * 0.2, bx, by, r * 1.9);
    grad.addColorStop(0, "rgba(0,174,199,0.35)");
    grad.addColorStop(1, "rgba(0,174,199,0)");
    c.fillStyle = grad;
    c.beginPath(); c.arc(bx, by, r * 1.9, 0, Math.PI * 2); c.fill();

    // Ball body.
    c.save();
    c.beginPath(); c.arc(bx, by, r, 0, Math.PI * 2); c.closePath();
    c.fillStyle = COLOR.navyLight; c.fill();
    c.lineWidth = Math.max(1.5, r * 0.12);
    c.strokeStyle = "rgba(255,255,255,0.65)"; c.stroke();
    // Embedded glyph.
    if (glyph && glyph.complete) {
      c.clip();
      const s = r * 1.7;
      c.drawImage(glyph, bx - s / 2, by - s / 2, s, s);
    }
    c.restore();
  }

  private roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }
}
