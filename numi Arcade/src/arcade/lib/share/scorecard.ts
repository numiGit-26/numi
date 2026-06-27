/**
 * Branded score card generation. Renders a 1200x630 share image (LinkedIn /
 * OG sized) entirely on a canvas, so a good rally becomes a shareable post.
 */
export interface ShareData {
  won: boolean;
  label: string;
  player: number;
  opponent: number;
  longestRally: number;
  durationMs: number;
}

export function resultLine(d: ShareData): string {
  const verb = d.won ? "beat" : "lost to";
  return `I just ${verb} ${d.label} at numi Pong ${d.player} to ${d.opponent}, longest rally ${d.longestRally}. Play at arcade.numi`;
}

function loadGlyph(): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = "/brand/numi-glyph.svg";
  });
}

export async function downloadScoreCard(d: ShareData) {
  const W = 1200, H = 630;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0A3A55");
  bg.addColorStop(0.5, "#051C2C");
  bg.addColorStop(1, "#030F18");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glyph = await loadGlyph();
  ctx.drawImage(glyph, 80, 70, 120, 120);

  ctx.fillStyle = "#fff";
  ctx.font = "800 40px Nunito, system-ui, sans-serif";
  ctx.fillText("numi Pong", 215, 150);

  ctx.font = "900 96px Nunito, system-ui, sans-serif";
  ctx.fillStyle = d.won ? "#FCE300" : "#00AEC7";
  ctx.fillText(d.won ? "Victory" : "Good game", 80, 330);

  ctx.fillStyle = "#fff";
  ctx.font = "800 130px Nunito, system-ui, sans-serif";
  ctx.fillText(`${d.player} : ${d.opponent}`, 80, 480);

  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "600 32px Nunito, system-ui, sans-serif";
  ctx.fillText(`vs ${d.label}`, 80, 545);

  ctx.textAlign = "right";
  ctx.fillStyle = "#00AEC7";
  ctx.font = "800 34px Nunito, system-ui, sans-serif";
  ctx.fillText(`Longest rally ${d.longestRally}`, W - 80, 480);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "600 28px Nunito, system-ui, sans-serif";
  ctx.fillText(`${(d.durationMs / 1000).toFixed(1)}s`, W - 80, 525);
  ctx.textAlign = "left";

  await new Promise<void>((resolve) => {
    c.toBlob((blob) => {
      if (!blob) return resolve();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "numi-pong-result.png";
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}
