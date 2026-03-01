# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the game

Open `index.html` directly in a browser — no server, no build step, no dependencies.

```bash
# WSL / Linux
wslview index.html
# or
explorer.exe "$(wslpath -w index.html)"
```

There are no tests, no linter, and no package manager in this project.

## GitHub workflow

After every change: commit with a descriptive message and push to `https://github.com/sklnhunt/testAIproject`.

```bash
git add <specific files>
git commit -m "brief description of what changed and why"
git push
```

## Architecture

### No ES modules — shared `window.G` namespace

All JS files use `window.G = window.G || {}` and attach classes/functions to `G`. Scripts must be loaded in the exact order declared in `index.html` because each file depends on the ones before it:

```
constants → sprites → input → particles → effects →
bullet → enemy → player → wave → levels → hud → ui → main
```

**Never use `import`/`export`** — they are blocked on `file://` URLs in Chrome.

### Coordinate system & rendering

- Canvas is fixed at **800×600** logical pixels, CSS-scaled to fill the viewport (aspect-ratio preserved, `image-rendering: pixelated`).
- Mouse coordinates from DOM events must be divided by the CSS scale factor (done inside `InputManager`).
- All entity drawing follows: `ctx.save()` → `ctx.translate(x, y)` → `ctx.rotate(angle)` → draw → `ctx.restore()`.
- Render order each frame: BG fill → grid (pre-rendered offscreen canvas) → particles → bullets → enemies → player → HUD → UI overlays → scanlines (pre-rendered offscreen canvas, single `drawImage`).
- Screen shake is applied via `ctx.translate(shakeX, shakeY)` before world drawing and `ctx.restore()`d before HUD, so the HUD is always stable.

### State machine (`js/main.js`)

```
MENU → PLAYING → WAVE_CLEAR (120-frame timer) → PLAYING
                                               → LEVEL_COMPLETE → PLAYING (next level)
                                                                 → WIN
PLAYING → GAME_OVER (player hp ≤ 0)
```

`Game._update()` switches on `this.state`. UI button hit-testing is done each frame by checking `input.mouse.clicked` against stored button rects (set during `_render()`).

### Pixel art sprites (`js/sprites.js`)

Sprites are 2D arrays of single-character strings. `.` = transparent; other chars map to CSS colors via a palette object. `G.drawPixelArt(ctx, grid, cx, cy, scale, palette)` draws them centered at `(cx, cy)` in grid-units. Sprite dimensions: Player 8×8 ×scale 4, Grunt 8×8 ×4, Runner 6×6 ×3, Tank 10×10 ×5.

### Adding content

- **New level:** append an entry to the `G.LEVELS` array in `js/levels.js` — no code changes needed.
- **New enemy type:** add a subclass of `G.Enemy` in `js/enemy.js`, register it in `G.spawnEnemy()`, add a death color palette to `G.DEATH_COLORS` in `js/particles.js`, add a sprite + palette to `js/sprites.js`, and add a `G.C.*` constants block in `js/constants.js`.

### Collision

- Bullet (circle) vs Enemy (AABB): `circleRect()` in `main.js`
- Enemy (AABB) vs Player (AABB): `rectRect()` in `main.js`
- All entities expose `.left`, `.right`, `.top`, `.bottom` computed from `x/y` + `hw/hh` half-extents.
- Bullets deal 1 damage per hit; damage values and HP are all in `js/constants.js` (`G.C`).

### Input

- `G.InputManager` tracks `keys{}`, `mouse.{x, y, down, clicked}`.
- `mouse.clicked` is set on `mousedown` and cleared at the end of each `_update()` call. Read it with `input.mouse.clicked` directly (not `consumeClick()` — that helper exists but is not used by `main.js`).
- `getMovement()` returns a normalized `{x, y}` vector (diagonal magnitude = 0.7071).
