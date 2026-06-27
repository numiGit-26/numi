# numi Pong — How to Play and Ship

The game is built and the production build passes. Bundle is tiny (about 54KB gzipped), so it loads fast.

## Play it locally

Open Terminal and run these three lines:

```bash
cd "/Users/marklong/Documents/Claude/Projects/numi Arcade"
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:5173). To stop, press Control and C in Terminal.

Controls: Arrow keys or drag to move your paddle. Player two uses W and S. Press P or Escape to pause. There is a hidden mode if you remember the old Konami code.

## Put it live on the internet

This is the same flow from REPO_SETUP.md, now with the real app in place.

```bash
cd "/Users/marklong/Documents/Claude/Projects/numi Arcade"
git init
git branch -M main
git add .
git commit -m "numi Pong v1: playable build, arcade architecture"
git remote add origin https://github.com/numiGit-26/numi.git
git push -u origin main
```

Then on vercel.com, sign in with GitHub and import `numiGit-26/numi`. Vercel detects Vite automatically and gives you a live URL. Every future push deploys, and every pull request gets its own preview link. When you are ready, point arcade.numi.com at Vercel.

## What is in this V1

A complete, on-brand single game: loading screen, menu, six career-themed difficulties from Graduate to CTO, two-player mode, pause and resume, victory and game-over flows, local stats, sound, particles, screen shake, the Super numi glyph as the ball, a downloadable branded score card, and a hidden Konami mode. All built on a reusable arcade engine so the next games drop in cleanly.

## Notes

The font currently uses Nunito, a close free stand-in for Mohr Rounded, until the licence question is settled on Monday. Swapping in Mohr Rounded later is a one-file change once we have the web licence and the woff2 files.

The glyph in the ball is a clean recreation of the Super numi mark. When you drop the official vector into `public/brand/numi-glyph.svg`, it flows through everywhere automatically.
