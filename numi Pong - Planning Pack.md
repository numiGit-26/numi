# numi Pong — Planning Pack for Sign-Off

**Project:** numi Arcade, Game One: numi Pong
**Prepared for:** Mark Long, Founder, numi
**Status:** Awaiting your approval. No game code will be written until you sign off.
**Date:** 27 June 2026

---

## TL;DR

Build numi Pong as the first game in a reusable numi Arcade, using React, TypeScript, Vite, Tailwind and a custom HTML5 Canvas engine, deployed on Vercel. Ship a local-first V1 that feels premium, plays at 60fps, and carries the Super numi brand through a circular ball with your new glyph embedded. Architect a thin, reusable game engine and an arcade shell now, so numi Snake, Breakout and the rest plug in later with no rework. Recruitment-themed difficulty runs Graduate through to CTO. Three build approaches are below. I recommend Approach A. One licence question is parked for Monday. Everything else is ready to go.

This document covers all fifteen deliverables from your brief. Read the recommendation and milestones if you want the short version. The rest is there for when you want the detail.

---

## 1. Open questions for you

Most decisions are made. These few would sharpen the build, and none of them block us from starting.

The Mohr Rounded webfont licence for public deployment. Parked, with a Monday reminder set. The agreed fallback is a near-identical free rounded sans for the public site if the licence does not cover web embedding.

Winning score for a match. My recommendation is first to 11, win by 2, matching real Pong and giving a satisfying arc without dragging. Tell me if you would prefer first to 7 for faster event play.

Sound on by default, or off until the player opts in. Browsers block audio until the first interaction anyway. I recommend a confident sound-on experience that starts at the first click, with an always-visible mute. Say if you would rather it start muted.

The "smile on load" moment. I have a recommendation in the moodboard section (the Super numi glyph assembling from particles, then bouncing into place). Worth a glance so we are aligned on the first three seconds.

Tone of the recruitment theming. I have pitched it as confident and witty, never cheesy. If anything reads as too much when you see the copy, we dial it back.

## 2. Research: modern browser game development

The premium feel you want does not come from a heavy engine. It comes from three things: a correct game loop, disciplined rendering, and "juice".

**Rendering.** For a game with a handful of moving objects plus particles, HTML5 Canvas 2D is the right tool. It comfortably handles well over a thousand simple draws per frame at 60fps. WebGL and libraries like PixiJS only earn their weight at thousands of sprites, which Pong does not have. Choosing Canvas keeps the bundle small, the code readable, and load times fast, all of which serve a public marketing asset.

**The loop.** The standard is a `requestAnimationFrame` loop with a fixed-timestep update for physics and a separate render pass. Physics is advanced in fixed slices (for example 1/120th of a second) so the game feels identical on a 60Hz laptop and a 144Hz gaming monitor, while rendering interpolates for smoothness. This is the single most important thing for fair, consistent gameplay across devices, and it directly answers your "high refresh-rate monitors" requirement.

**Juice.** This is where "retro toy" becomes "Apple, Linear, Stripe". The techniques are well established and cheap on Canvas: a short screen shake on hard hits, particle bursts on paddle contact and on scores, a brief squash-and-stretch on the ball at impact, easing on every UI transition, and a subtle trail behind the ball. Used with restraint, these create the satisfying, polished feel you described.

**Mobile and touch.** Drag-to-move paddles, large touch targets, a responsive canvas that scales to the viewport, and portrait support. We design mobile-first so the QR-code and event use cases feel native rather than bolted on.

**Accessibility.** Full keyboard control, a reduced-motion mode that respects the operating system setting and cuts shake and particles, high-contrast option, scalable UI text, and ARIA labelling on menus. A fast game can still be considerate.

**Performance.** Target 60fps with headroom to 120fps on capable displays. Techniques: device-pixel-ratio-aware canvas sizing for crisp visuals on retina, object pooling for particles so we never thrash the garbage collector, and offscreen pre-rendering of static elements.

## 3. Best-in-class examples

References worth studying, and what we borrow from each.

Stripe and Linear marketing sites, for motion language: confident easing, restraint, and the sense that every transition is intentional.

Raycast and Apple product pages, for the "premium dark surface with a single glowing accent" aesthetic, which maps perfectly onto your navy and teal palette.

GamePix and modern HTML5 arcade portals, for arcade shell patterns: a clean game-select grid, consistent chrome around each game, and shareable deep links.

Classic juice references such as Vlambeer's talks on game feel, for the particle, shake and squash techniques that make simple mechanics feel alive.

The original Pong, for the discipline of the core: two paddles, one ball, a centre line, a score. We honour that simplicity and add polish around it rather than complexity inside it.

## 4. Three implementation approaches

All three share the same outer shell: a React and TypeScript app built with Vite and Tailwind, deployed on Vercel, local-first. They differ in how the game itself is rendered and run.

**Approach A — React shell plus a custom Canvas 2D engine.**
We build a small, bespoke game engine (loop, input, audio, particles, collision) in plain TypeScript, with React handling all menus, overlays and chrome. The engine is game-agnostic so future arcade titles reuse it.

**Approach B — React shell plus Phaser.**
Phaser is a full, batteries-included 2D game framework. It brings physics, input, audio and a scene system out of the box. React wraps it for menus and routing.

**Approach C — React shell plus PixiJS.**
PixiJS is a high-performance WebGL renderer. We get maximum visual-effects headroom (shaders, advanced particles) while writing our own game logic on top.

## 5. Pros and cons of each

**Approach A, custom Canvas engine.**
For: smallest bundle and fastest load, total control over feel, no framework lock-in, code that a senior engineer enjoys reading, and an engine we shape precisely for the arcade. Against: we write more ourselves, including the particle and audio helpers, so slightly more upfront engineering. Risk is low because Pong is simple and the engine surface is small.

**Approach B, Phaser.**
For: fastest path to a working game, lots built in, big community. Against: heavier bundle (hundreds of kilobytes), an opinionated structure that fights React, and a "game engine" texture that can feel generic rather than bespoke. Harder to make it feel unmistakably numi, and heavier to reuse cleanly across a branded arcade shell.

**Approach C, PixiJS.**
For: stunning effects ceiling, WebGL performance for future particle-heavy games. Against: overkill for Pong, more complexity, larger bundle, and a steeper path to simple, crisp UI. Better held in reserve for a future title like numi Asteroids if one ever needs it.

## 6. Recommendation

**Approach A.** Build a custom Canvas 2D engine behind a React shell.

It gives the premium, bespoke feel you want, the smallest and fastest footprint for a public asset, and the cleanest reusable core for the wider arcade. Crucially, we design the engine behind a clear interface, so if a future game ever needs WebGL we can drop PixiJS in for that one title without touching the rest. We get simplicity now and an open door later. This also best honours your stated priority of long-term maintainability over short-term speed.

On the ball, confirmed direction: a perfectly circular ball with the Super numi glyph embedded prominently, rendered in the yellow-to-teal gradient with a subtle metallic ring nod to the shield. Round physics means flawless, predictable gameplay, and the brand still lands every bounce.

## 7. Milestone-based implementation plan

Each milestone is a reviewable checkpoint. We build, you look, we iterate.

**Milestone 0, foundations.** Initialise the repo, Vite and TypeScript scaffold, Tailwind, design tokens from the numi palette, fonts wired in, Vercel connected. Output: a deployed empty shell at a preview URL.

**Milestone 1, playable core.** The engine loop, paddles, ball physics, collisions, scoring, and the Super numi ball. Keyboard control. No polish yet. Output: a real game of Pong you can play.

**Milestone 2, feel.** Juice pass. Particles, screen shake, ball trail, squash-and-stretch, sound effects, smooth easing. This is the "make it premium" milestone. Output: it stops feeling like a demo and starts feeling like numi.

**Milestone 3, opponents and modes.** AI opponent with difficulty levels (Graduate to CTO), human-versus-human, pause, resume, restart, game over and victory flows. Output: a complete single-game experience.

**Milestone 4, the app around the game.** Loading screen, animated intro, menu, settings, difficulty select, local stats and history, dark mode, fullscreen, mobile and touch controls. Output: it feels like an app, not a toy.

**Milestone 5, brand and delight.** Easter eggs, recruitment theming, celebration animations, sound branding, the smile-on-load moment, and a polish sweep on accessibility and performance. Output: launch-ready V1.

**Milestone 6, share and ship.** Branded score cards, share links, OG images, final QA across devices, and production deploy. Output: numi Pong live, ready for events and LinkedIn.

Local-first leaderboards ship within V1. The cloud leaderboard is a fast follow once you want it, and the architecture already expects it.

## 8. Wireframe ideas

Described in words, to be designed in Milestone 0.

**Loading screen.** Centred Super numi glyph on deep navy, assembling from particles, a thin teal progress line beneath.

**Main menu.** numi wordmark top-left, a large "Play" call to action, then Difficulty, Two Player, Stats, Settings. Generous whitespace, one glowing teal accent, the glyph idling with a gentle float.

**Difficulty select.** Six cards, Graduate to CTO, each with a one-line witty descriptor and a difficulty meter. Selecting one animates into the game.

**Game screen.** Minimal. Two paddles, centre line as a soft dotted seam, score in Mohr Rounded at the top, the Super numi ball in play. A subtle vignette frames the action. Pause control top-right.

**Pause overlay.** Frosted blur over the frozen game, Resume, Restart, Settings, Quit.

**Victory screen.** Celebration particles in brand colours, the result, key stats (longest rally, fastest points), and a "Share your win" button that generates a branded score card.

## 9. Visual moodboard

The feeling: a premium dark product surface, not a neon arcade cabinet.

Surfaces in deep navy `#051C2C` and `#030F18`, with navy mid-tones for depth. The single hero accent is numi teal `#00AEC7`, used for glow, the ball gradient and active states. numi yellow `#FCE300` is the spark colour, reserved for highlights, celebration and the glyph, so it always feels special. White for crisp type.

Motion language borrowed from Linear and Stripe: confident, eased, never bouncy for its own sake. Soft glows rather than hard neon. Subtle grain or a dot texture as a nod to the Super numi shield's perforated metal, used very lightly. Mohr Rounded throughout for warmth and brand fidelity.

The smile-on-load moment, my recommendation: the glyph assembles from a scatter of teal and yellow particles, settles, then gives one satisfying bounce off the bottom of the screen before the menu fades in. Three seconds, and it tells the visitor everything about the care behind numi.

## 10. Technical architecture

A single Vite React app, structured in two layers.

**The arcade shell.** Routing, the game-select experience, shared chrome, settings, theming via design tokens, local-first persistence, and share-card generation. This is brand-owned and shared by every game.

**The game engine.** A small, framework-free TypeScript core: the fixed-timestep loop, an input system (keyboard, touch, gamepad), an audio manager, a pooled particle system, and collision helpers. Game-agnostic, so every arcade title reuses it.

**A game module contract.** Each game, starting with Pong, implements a simple interface: setup, update, render, teardown, plus its own config and UI. Adding a new game means adding a module and registering it. No changes to the shell or engine. This is what makes the arcade real rather than aspirational.

**Persistence.** Local-first via the browser, behind a storage interface. Stats, history and a local leaderboard implement that interface today. A cloud backend (for example Supabase or Vercel storage) implements the same interface later, so global and office leaderboards plug in with no rework to game code.

**Deployment.** Vercel from day one. Every push to main deploys, every pull request gets a preview URL for visual review before merge.

## 11. Folder structure

```
numi/
  public/
    fonts/                 # Mohr Rounded woff2 (licence permitting) or fallback
    sounds/                # paddle, wall, score, win, ui clicks
    brand/                 # super numi glyph, wordmark, favicon
    og/                    # social share image templates
  src/
    arcade/
      components/          # shared UI: menu, overlays, buttons
      hooks/
      lib/
        engine/            # reusable core: loop, input, audio, particles, collision
        storage/           # local-first persistence + leaderboard interface
        share/             # branded score-card generation
      theme/               # numi design tokens (colour, type, spacing, motion)
      routes/              # arcade shell routing and game select
    games/
      pong/
        components/        # pong-specific overlays
        logic/             # pong game module: setup, update, render
        config.ts          # difficulty, speeds, scoring
        index.ts           # registers pong with the arcade
    App.tsx
    main.tsx
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  tailwind.config.ts
  vercel.json
  README.md
```

## 12. Asset list

What we have, and what we still need.

Have: the Super numi glyph (from your shared image and the supernumi SVGs), the core palette, and the brand kit in Drive.

Need from the brand kit: the Super numi glyph as a clean transparent SVG or high-resolution PNG for the ball, the numi wordmark, and the Mohr Rounded weights converted to woff2 for web (licence permitting).

To create during the build: a small set of sound effects (paddle hit, wall bounce, score, victory, UI clicks), an optional soft ambient bed, a favicon set, OG share-image templates for LinkedIn, and a couple of lightweight particle textures.

## 13. Risks

**Font licence.** Mohr Rounded is a paid font and web embedding needs the right licence. Parked for Monday, with a clean free fallback ready, so this never blocks the build.

**Scope.** Your brief is rich, and rightly ambitious. The risk is trying to ship everything in V1. Mitigation: the milestone plan ships a beautiful core first, then layers extras, so we always have something excellent to show.

**Mobile performance.** Low-end phones can struggle with heavy effects. Mitigation: object pooling, a performance budget, and an automatic effects reduction on weaker devices.

**Audio autoplay.** Browsers block sound until the first interaction. Mitigation: audio initialises on the first click, with a visible mute, so it always behaves correctly.

**Frame-rate fairness.** Without care, the game plays differently on a 144Hz monitor. Mitigation: the fixed-timestep loop, designed in from the start.

**Leaderboard integrity, later.** A public cloud leaderboard invites cheating. Mitigation: server-side validation and rate limiting when we add the backend, not before.

## 14. Future roadmap, the numi Arcade

V1 is numi Pong, local-first, live on Vercel.

Then, in rough order: the arcade shell with a game-select home, a cloud leaderboard and optional player profiles, achievements and unlocks, and the next titles dropped in through the game module contract (Snake and Breakout are the natural second and third games). After that, an events and kiosk mode for conference stands and QR codes, LinkedIn share campaigns with branded score cards, office and weekly leaderboards, and eventually tournament and challenge modes. The endpoint is arcade.numi.com: play, compete, unlock, and discover numi along the way.

## 15. Everything else

**Recruitment theming.** Difficulty levels named Graduate, Mid-Level, Senior, Staff Engineer, Principal and CTO, each with a witty one-liner and a genuinely different AI. Confident and clever, never cheesy, and never interrupting play.

**Easter eggs.** The Konami code unlocks a hidden "CTO mode". A developer mode toggles an FPS and physics overlay for the engineers who will inevitably poke around. Hidden colour themes. The occasional well-placed engineering or product in-joke on the menus and victory screen. Plenty more where those came from.

**Branding opportunities, done tastefully.** The glyph as the ball. Brand-colour particles and celebrations. Mohr Rounded throughout. A motion language that feels like numi. Subtle sound branding on key moments. None of it forced.

**Leaderboards.** Local highs and personal bests in V1: highest score, longest rally, fastest win. Global, weekly and office boards arrive with the cloud backend, on the same interface.

**Social sharing.** Beautiful branded score cards generated on the victory screen, share links, and LinkedIn-ready OG images, so a great rally becomes a post.

**Community use.** Designed mobile-first for QR codes at events and meetups, a kiosk mode for conference stands, and share mechanics that turn players into reach. A memorable, on-brand way to engage candidates, clients and the wider product and engineering community.

---

## Sign-off

If you are happy with Approach A and this plan, reply with your go and I will start at Milestone 0. If you want to change the winning score, the sound default, the recruitment tone, or anything else, tell me and I will fold it in before we begin. The Monday licence question runs in parallel and does not hold us up.
