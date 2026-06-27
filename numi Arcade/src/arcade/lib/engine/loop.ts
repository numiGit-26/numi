/**
 * Fixed-timestep game loop with render interpolation.
 * Physics advances in fixed slices so gameplay feels identical on a
 * 60Hz laptop and a 144Hz monitor. Rendering interpolates for smoothness.
 */
export type UpdateFn = (fixedDt: number) => void;
export type RenderFn = (alpha: number) => void;

const FIXED_DT = 1 / 120; // 120 physics updates per second
const MAX_FRAME = 0.25; // clamp huge gaps (e.g. tab was backgrounded)

export class GameLoop {
  private raf = 0;
  private last = 0;
  private acc = 0;
  private running = false;

  constructor(private update: UpdateFn, private render: RenderFn) {}

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.acc = 0;
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private tick = (now: number) => {
    if (!this.running) return;
    let frame = (now - this.last) / 1000;
    this.last = now;
    if (frame > MAX_FRAME) frame = MAX_FRAME;
    this.acc += frame;
    while (this.acc >= FIXED_DT) {
      this.update(FIXED_DT);
      this.acc -= FIXED_DT;
    }
    this.render(this.acc / FIXED_DT);
    this.raf = requestAnimationFrame(this.tick);
  };
}

export { FIXED_DT };
