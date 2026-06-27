# numi Arcade — Repo & Deployment Setup

The GitHub repo `numiGit-26/numi` exists, is public, and is currently empty. Here is exactly how to configure it. Nothing here touches game code. It sets the foundation so we can build cleanly once you approve the plan.

## 1. Initialise and push the starter files

I have created `README.md` and `.gitignore` in this folder. To put them on GitHub, open Terminal and run these commands one at a time:

```bash
cd "/Users/marklong/Documents/Claude/Projects/numi Arcade"
git init
git branch -M main
git add README.md .gitignore
git commit -m "Initial commit: numi Arcade README and gitignore"
git remote add origin https://github.com/numiGit-26/numi.git
git push -u origin main
```

If `git push` asks you to authenticate, sign in with your GitHub account (a browser window or a token prompt). Once done, refresh the repo page and you will see the README rendered.

## 2. Recommended repo settings (on GitHub.com)

Once the first push lands, on the repo's **Settings** page:

Set the default branch to `main`. Under **Branches**, add a protection rule for `main` so future game code goes through pull requests rather than direct commits. This keeps the codebase clean as the arcade grows.

Add a short description and topics to the repo (`games`, `react`, `typescript`, `canvas`, `numi`) so it reads well when shared.

## 3. Vercel hookup (do this now, deploy later)

We can connect the repo to Vercel before any game exists, so deployment is wired from day one.

Go to vercel.com, sign in with GitHub, and import the `numiGit-26/numi` repository. Vercel auto-detects a Vite project once the app scaffold is in place. For now it will simply track the repo. When we build the app, every push to `main` will deploy automatically, and every pull request will get its own preview URL. That preview-per-PR flow is ideal for reviewing game changes visually before they go live.

When we are ready for a public address, we point `arcade.numi.com` (a CNAME in your DNS) at Vercel.

## 4. What I still need from you

The official numi font files (or the exact font names and license) so the game matches brand precisely.

Confirmation of which Super numi asset is the canonical logo for the ball. I have `supernumi_hero.svg` and `supernumi_team_six.svg` in the project, plus the Q3 2026 launch deck. If the Canva "Super numi" design is different, share an export.

## 5. What happens next

Once you have answered the typography question and reviewed the research findings, I will produce the full planning pack: three implementation approaches with trade-offs, my recommendation, the reusable arcade architecture, folder structure, wireframes, moodboard, asset list, risks, and a milestone roadmap. Only after you approve that do we write a single line of game code.
