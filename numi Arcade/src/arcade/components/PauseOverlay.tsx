import { Button } from "./ui";

export function PauseOverlay({
  onResume, onRestart, onMenu,
}: { onResume: () => void; onRestart: () => void; onMenu: () => void }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-navy-deep/60 backdrop-blur-md">
      <div className="text-center anim-pop">
        <h2 className="text-4xl font-black tracking-tight mb-8">Paused</h2>
        <div className="flex flex-col items-center gap-3">
          <Button onClick={onResume}>Resume</Button>
          <Button variant="ghost" onClick={onRestart}>Restart</Button>
          <Button variant="ghost" onClick={onMenu}>Main Menu</Button>
        </div>
      </div>
    </div>
  );
}
