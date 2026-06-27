/**
 * Input manager. Keyboard for desktop, drag for touch. Also tracks a
 * recent key history so games can detect cheat codes (the Konami code).
 */
export class Input {
  up = false;
  down = false;
  // Player 2 (human vs human)
  up2 = false;
  down2 = false;
  // Normalised paddle target from touch, 0..1 of canvas height, or null.
  touchY: number | null = null;
  touchY2: number | null = null;

  private history: string[] = [];
  private onCode?: (code: string) => void;
  private onPauseToggle?: () => void;

  attach(el: HTMLElement) {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    el.addEventListener("touchstart", this.onTouch, { passive: false });
    el.addEventListener("touchmove", this.onTouch, { passive: false });
    el.addEventListener("touchend", this.onTouchEnd);
  }

  detach(el: HTMLElement) {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    el.removeEventListener("touchstart", this.onTouch);
    el.removeEventListener("touchmove", this.onTouch);
    el.removeEventListener("touchend", this.onTouchEnd);
  }

  setHandlers(opts: { onCode?: (code: string) => void; onPauseToggle?: () => void }) {
    this.onCode = opts.onCode;
    this.onPauseToggle = opts.onPauseToggle;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp": this.up = true; e.preventDefault(); break;
      case "ArrowDown": this.down = true; e.preventDefault(); break;
      case "w": case "W": this.up2 = true; break;
      case "s": case "S": this.down2 = true; break;
      case "p": case "P": case "Escape": this.onPauseToggle?.(); break;
    }
    this.history.push(e.key);
    if (this.history.length > 12) this.history.shift();
    this.onCode?.(this.history.join(","));
  };

  private onKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp": this.up = false; break;
      case "ArrowDown": this.down = false; break;
      case "w": case "W": this.up2 = false; break;
      case "s": case "S": this.down2 = false; break;
    }
  };

  private onTouch = (e: TouchEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i];
      const x = t.clientX - rect.left;
      const y = (t.clientY - rect.top) / rect.height;
      if (x < rect.width / 2) this.touchY2 = y; else this.touchY = y;
    }
  };

  private onTouchEnd = () => {
    this.touchY = null;
    this.touchY2 = null;
  };
}
