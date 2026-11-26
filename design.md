# Design: 潘勒斯的个人主页 (Arcana · Engineering Is Magic)

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: playful
- Shape of the first page: Lab Stage (dark 波波/ZOMPOPO character bay) + numbered scene modules
- Theme: Hum base for reading pages; `/` uses Lab direction C (user-chosen 2026-11-24)
- Axes: light/grotesque display + green-lime on `/`, rounded-sans/chromatic-yellow elsewhere · posture: full-palette

## Tokens
`tokens.css` is the source of truth. The roles:
```css
:root {
  --color-paper: oklch(97% 0.012 95);  --color-paper-2: oklch(94.5% 0.018 95);  --color-paper-3: oklch(91% 0.022 95);
  --color-ink: oklch(20% 0.014 255);  --color-ink-2: oklch(29% 0.014 255);  --color-muted: oklch(47% 0.014 255);  --color-rule: oklch(87% 0.016 95);
  --color-accent: oklch(87% 0.175 96);  --color-accent-ink: oklch(20% 0.014 255);  --color-focus: oklch(50% 0.17 250);
  --font-display: "Chillax", ui-rounded, ui-sans-serif, sans-serif;  --font-body: var(--font-display);  --font-outlier: "Geist Mono", ui-monospace, monospace;
  --font-lab-display: "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
  --color-lab-panel: oklch(20% 0.012 150);  --color-lab-accent: oklch(90% 0.19 125);  --color-lab-signal: oklch(46% 0.12 140);
  --radius-lab: 8px;  --radius-lab-control: 4px;
  --radius-card: 24px;  --radius-pill: 999px;  --rule-hair: 1px;
  --shadow-card: 0 1px 2px oklch(20% 0.014 255 / 0.06), 0 12px 28px -14px oklch(20% 0.014 255 / 0.22);
}
```
The spacing scale, the type scale, the easings and the durations are the scaffold's and live in `tokens.css`.

## Controls
- Primary: accent (pear) fill · ink text · radius-stock 16px · 44–52px height
- Secondary: paper-2 fill + edge border · ink text · same radius and height
- Press: card-stock feel — translateY(2px) + tighter shadow on :active; --ease-spring in, --ease-snap back
- Lab homepage overrides: lime fill + panel ink + 4px radius for primary; outlined secondary; square nav links and theme toggle.

## Motion
- Character: calm; one reveal per page (staggered --i, transform+opacity only, 120/220/420ms); under reduced motion everything ends at once.
- Pose switching uses a quiet 180ms dissolve, never a bounce or hop.

## Visual tone (2026-11-24)
- Editorial first, playful second: the mascot is an identifier, not the subject of every section.
- Avoid sticker clusters, candy-colour glows, circular character badges and horizontal mobile carousels.
- On `/`, 波波 sits in a dark technical bay. Scenes are numbered 16:9 modules in a bordered three-cell index on desktop and bordered rows on mobile; this is the chosen Lab structure, not the rejected sticker/carousel treatment.
- Interior pages keep Hum reading surfaces; align them to Lab only when directed.

## Dark mode (user requirement, 2026-11-24)
- Dark is an opt-in mode derived from the same Hum hues (never an inversion); nav toggle, choice persisted in localStorage.
- Body text ≥16px and labels/captions ≥13px in BOTH modes; every dark text/background pair ≥4.5:1.
- Chinese body on dark: weight ≥500 (or a brighter ink step).

## Pages (hero posture per route)
- `/` Lab Stage · `/about` Split · `/blog` Index · `/blog/[slug]` Rows (read) · `/research` Index · `/research/[...slug]` Rows (read) · `/space-now` Pinned · `/solar-watch` Band

## Signature
- On `/`: dark character bay + technical grid + numbered modules + square controls; 波波 rides the Lab stage.
- Reading pages: torn-paper seams between sections; card-stock press on every control.

## Exports
`tokens.css` in this project.
