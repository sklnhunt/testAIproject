window.G = window.G || {};

// ─── Collision helpers ────────────────────────────────────────────────────────
function circleRect(cx, cy, cr, rl, rt, rr, rb) {
  const nearX = Math.max(rl, Math.min(rr, cx));
  const nearY = Math.max(rt, Math.min(rb, cy));
  const dx = cx - nearX, dy = cy - nearY;
  return dx * dx + dy * dy <= cr * cr;
}

function rectRect(al, at, ar, ab, bl, bt, br, bb) {
  return al < br && ar > bl && at < bb && ab > bt;
}

// ─── Game states ──────────────────────────────────────────────────────────────
const STATE = {
  MENU:           'MENU',
  PLAYING:        'PLAYING',
  WAVE_CLEAR:     'WAVE_CLEAR',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  GAME_OVER:      'GAME_OVER',
  WIN:            'WIN',
};

// ─── Game class ───────────────────────────────────────────────────────────────
G.Game = class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');

    this.input    = new G.InputManager(canvas);
    this.effects  = new G.Effects(canvas);
    this.particles= new G.ParticleSystem();
    this.hud      = new G.HUD();
    this.ui       = new G.UI();
    this.wave     = new G.WaveController();

    this.state  = STATE.MENU;
    this.score  = 0;
    this.player = null;
    this.enemies = [];
    this.bullets = [];

    this.stateTimer = 0;

    // Grid background canvas
    this._gridCanvas = this._buildGrid();

    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
  }

  // ── Background grid ──────────────────────────────────────────────────────
  _buildGrid() {
    const gc = document.createElement('canvas');
    gc.width  = G.C.W;
    gc.height = G.C.H;
    const gx  = gc.getContext('2d');
    gx.strokeStyle = G.C.GRID;
    gx.lineWidth   = 1;
    const step = 40;
    for (let x = 0; x <= G.C.W; x += step) {
      gx.beginPath(); gx.moveTo(x, 0); gx.lineTo(x, G.C.H); gx.stroke();
    }
    for (let y = 0; y <= G.C.H; y += step) {
      gx.beginPath(); gx.moveTo(0, y); gx.lineTo(G.C.W, y); gx.stroke();
    }
    return gc;
  }

  // ── Start / Reset ────────────────────────────────────────────────────────
  _startGame(levelIndex) {
    this.score   = 0;
    this.enemies = [];
    this.bullets = [];
    this.particles.clear();
    this.player  = new G.Player();
    this.wave.loadLevel(levelIndex);
    this.wave.beginCurrentWave();
    this.state   = STATE.PLAYING;
    this.stateTimer = 0;
  }

  _nextLevel() {
    const next = this.wave.levelIndex + 1;
    if (next >= G.LEVELS.length) {
      this.state = STATE.WIN;
      return;
    }
    this.enemies = [];
    this.bullets = [];
    this.particles.clear();
    this.player  = new G.Player();
    this.wave.loadLevel(next);
    this.wave.beginCurrentWave();
    this.state      = STATE.PLAYING;
    this.stateTimer = 0;
  }

  // ── Main loop ────────────────────────────────────────────────────────────
  _loop() {
    this._update();
    this._render();
    requestAnimationFrame(this._loop);
  }

  // ── Update ───────────────────────────────────────────────────────────────
  _update() {
    const mx = this.input.mouse.x;
    const my = this.input.mouse.y;
    const clicked = this.input.mouse.clicked;

    this.effects.update();

    switch (this.state) {
      case STATE.MENU:
        if (clicked && this.ui.btnStart && G.hitButton(mx, my, this.ui.btnStart)) {
          this._startGame(0);
        }
        break;

      case STATE.PLAYING:
        this._updatePlaying();
        break;

      case STATE.WAVE_CLEAR:
        this.stateTimer--;
        if (this.stateTimer <= 0) {
          const hasMore = this.wave.nextWave();
          if (hasMore) {
            this.wave.beginCurrentWave();
            this.state = STATE.PLAYING;
          } else {
            this.state = STATE.LEVEL_COMPLETE;
          }
          this.stateTimer = 0;
        }
        break;

      case STATE.LEVEL_COMPLETE:
        if (clicked && this.ui.btnContinue && G.hitButton(mx, my, this.ui.btnContinue)) {
          this._nextLevel();
        }
        break;

      case STATE.GAME_OVER:
        if (clicked && this.ui.btnRestart && G.hitButton(mx, my, this.ui.btnRestart)) {
          this._startGame(0);
        }
        break;

      case STATE.WIN:
        if (clicked && this.ui.btnRestart && G.hitButton(mx, my, this.ui.btnRestart)) {
          this._startGame(0);
        }
        break;
    }

    // Clear click after processing this frame
    this.input.mouse.clicked = false;
  }

  _updatePlaying() {
    const player = this.player;

    // Player update
    player.update(this.input);

    // Shoot if mouse held or clicked
    if (this.input.mouse.down || this.input.mouse.clicked) {
      const bullet = player.tryShoot();
      if (bullet) {
        this.bullets.push(bullet);
        this.effects.shake(G.C.SHOOT_SHAKE);
      }
    }

    // Wave spawning
    const spawn = this.wave.update();
    if (spawn) {
      this.enemies.push(G.spawnEnemy(spawn.type, spawn.x, spawn.y));
    }

    // Update bullets
    for (const b of this.bullets) b.update();

    // Update enemies
    for (const e of this.enemies) e.update(player.x, player.y);

    // ── Bullet vs Enemy collision ──────────────────────────────────────────
    for (const b of this.bullets) {
      if (b.dead) continue;
      for (const e of this.enemies) {
        if (e.dead) continue;
        if (circleRect(b.x, b.y, b.radius, e.left, e.top, e.right, e.bottom)) {
          b.dead = true;
          this.particles.spawnImpact(b.x, b.y);
          e.takeDamage(1);
          if (e.dead) {
            this.score += e.score;
            const shakeMag = e.type === 'tank' ? G.C.TANK_DEATH_SHAKE : G.C.DEATH_SHAKE;
            this.effects.shake(shakeMag);
            this.particles.spawnDeath(e.x, e.y, G.DEATH_COLORS[e.type]);
          }
          break;
        }
      }
    }

    // ── Enemy vs Player collision ──────────────────────────────────────────
    for (const e of this.enemies) {
      if (e.dead) continue;
      if (rectRect(
        player.left, player.top, player.right, player.bottom,
        e.left,      e.top,      e.right,      e.bottom
      )) {
        player.takeDamage(G.C.PLAYER_CONTACT_DMG);
        if (player.iFrames === G.C.PLAYER_IFRAME) {
          // Just took damage — shake
          this.effects.shake(G.C.DEATH_SHAKE);
        }
      }
    }

    // Remove dead bullets / enemies
    this.bullets = this.bullets.filter(b => !b.dead);
    this.enemies = this.enemies.filter(e => !e.dead);

    // Update particles
    this.particles.update();

    // ── State transitions ──────────────────────────────────────────────────
    if (player.dead) {
      this.particles.spawnDeath(player.x, player.y, G.DEATH_COLORS.player);
      this.state = STATE.GAME_OVER;
      return;
    }

    if (this.wave.isWaveDone(this.enemies.length)) {
      this.state = STATE.WAVE_CLEAR;
      this.stateTimer = G.C.WAVE_CLEAR_DELAY;
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  _render() {
    const ctx = this.ctx;
    const C   = G.C;

    // Clear
    ctx.fillStyle = C.BG;
    ctx.fillRect(0, 0, C.W, C.H);

    // World (with shake)
    ctx.save();
    ctx.translate(this.effects.shakeX, this.effects.shakeY);

    // Grid
    ctx.drawImage(this._gridCanvas, 0, 0);

    if (this.state === STATE.PLAYING || this.state === STATE.WAVE_CLEAR) {
      // Particles (behind entities)
      this.particles.draw(ctx);

      // Bullets
      for (const b of this.bullets) b.draw(ctx);

      // Enemies
      for (const e of this.enemies) e.draw(ctx);

      // Player
      if (this.player) this.player.draw(ctx);
    } else if (this.state === STATE.GAME_OVER) {
      // Still draw particles from death explosion
      this.particles.draw(ctx);
    }

    ctx.restore(); // end shake

    // HUD (stable, post-shake)
    if ((this.state === STATE.PLAYING || this.state === STATE.WAVE_CLEAR) && this.player) {
      this.hud.draw(ctx, this.player, this.score,
        this.wave.currentWaveName, this.wave.levelName);
    }

    // UI overlays
    const mx = this.input.mouse.x;
    const my = this.input.mouse.y;

    if (this.state === STATE.MENU) {
      this.ui.drawMenu(ctx, mx, my);
    } else if (this.state === STATE.WAVE_CLEAR) {
      this.ui.drawWaveClear(ctx, this.stateTimer);
    } else if (this.state === STATE.LEVEL_COMPLETE) {
      this.ui.drawLevelComplete(ctx, this.wave.levelName, this.score, mx, my,
        this.wave.hasNextLevel());
    } else if (this.state === STATE.GAME_OVER) {
      this.ui.drawGameOver(ctx, this.score, mx, my);
    } else if (this.state === STATE.WIN) {
      this.ui.drawWin(ctx, this.score, mx, my);
    }

    // Scanlines (always on top)
    this.effects.drawScanlines(ctx);
  }
};

// ─── Entry point ─────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  window._game = new G.Game(canvas);
});
