/**
 * Pooled particle system. Pre-allocates particles so we never thrash the
 * garbage collector during play. Also owns a small screen-shake impulse.
 */
interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number; color: string; alive: boolean;
}

export class Particles {
  private pool: Particle[] = [];
  private shake = 0;
  reducedMotion = false;

  constructor(count = 400) {
    for (let i = 0; i < count; i++) {
      this.pool.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, size: 0, color: "#fff", alive: false });
    }
  }

  burst(x: number, y: number, color: string, amount = 16, speed = 220) {
    if (this.reducedMotion) amount = Math.min(amount, 4);
    let spawned = 0;
    for (const p of this.pool) {
      if (p.alive) continue;
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.3 + Math.random() * 0.7);
      p.x = x; p.y = y;
      p.vx = Math.cos(a) * s;
      p.vy = Math.sin(a) * s;
      p.max = p.life = 0.4 + Math.random() * 0.5;
      p.size = 2 + Math.random() * 3;
      p.color = color;
      p.alive = true;
      if (++spawned >= amount) break;
    }
  }

  addShake(amount: number) {
    if (this.reducedMotion) return;
    this.shake = Math.min(this.shake + amount, 16);
  }

  update(dt: number) {
    for (const p of this.pool) {
      if (!p.alive) continue;
      p.life -= dt;
      if (p.life <= 0) { p.alive = false; continue; }
      p.vy += 320 * dt; // gentle gravity
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    this.shake *= Math.pow(0.001, dt); // fast decay
    if (this.shake < 0.2) this.shake = 0;
  }

  shakeOffset(): { x: number; y: number } {
    if (this.shake === 0) return { x: 0, y: 0 };
    return {
      x: (Math.random() - 0.5) * this.shake,
      y: (Math.random() - 0.5) * this.shake,
    };
  }

  render(c: CanvasRenderingContext2D) {
    for (const p of this.pool) {
      if (!p.alive) continue;
      c.globalAlpha = Math.max(0, p.life / p.max);
      c.fillStyle = p.color;
      c.beginPath();
      c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;
  }
}
