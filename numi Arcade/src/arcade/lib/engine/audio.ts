/**
 * Tiny Web Audio synth. No asset files needed: every sound is generated.
 * Audio context is created lazily on the first user interaction so it
 * complies with browser autoplay rules.
 */
type Sound = "paddle" | "wall" | "score" | "win" | "ui";

export class Audio {
  private ctx: AudioContext | null = null;
  muted = false;

  private ensure() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new Ctx();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  unlock() { this.ensure(); }

  play(sound: Sound) {
    if (this.muted) return;
    const ctx = this.ensure();
    const now = ctx.currentTime;
    const cfg: Record<Sound, { f: number; to: number; dur: number; type: OscillatorType; gain: number }> = {
      paddle: { f: 440, to: 620, dur: 0.08, type: "triangle", gain: 0.18 },
      wall: { f: 240, to: 200, dur: 0.07, type: "sine", gain: 0.14 },
      score: { f: 300, to: 520, dur: 0.22, type: "sawtooth", gain: 0.16 },
      win: { f: 520, to: 880, dur: 0.5, type: "triangle", gain: 0.2 },
      ui: { f: 660, to: 720, dur: 0.05, type: "sine", gain: 0.1 },
    };
    const s = cfg[sound];
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = s.type;
    osc.frequency.setValueAtTime(s.f, now);
    osc.frequency.exponentialRampToValueAtTime(s.to, now + s.dur);
    g.gain.setValueAtTime(s.gain, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + s.dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + s.dur + 0.02);
  }
}
