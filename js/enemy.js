window.G = window.G || {};

// ─── Base Enemy ───────────────────────────────────────────────────────────────
G.Enemy = class Enemy {
  constructor(x, y, type, hp, hw, hh, speed, scale) {
    this.x = x;
    this.y = y;
    this.type  = type;
    this.hp    = hp;
    this.maxHp = hp;
    this.hw    = hw;  // half-width
    this.hh    = hh;  // half-height
    this.speed = speed;
    this.scale = scale;
    this.dead  = false;
    this.frame = 0;
    this.frameTick = 0;
    this.FRAME_RATE = 12; // ticks per anim frame
  }

  // AABB bounds
  get left()   { return this.x - this.hw; }
  get right()  { return this.x + this.hw; }
  get top()    { return this.y - this.hh; }
  get bottom() { return this.y + this.hh; }

  seekPlayer(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    this.x += (dx / dist) * this.speed;
    this.y += (dy / dist) * this.speed;
  }

  tickAnim() {
    this.frameTick++;
    if (this.frameTick >= this.FRAME_RATE) {
      this.frameTick = 0;
      this.frame = (this.frame + 1) % 2;
    }
  }

  takeDamage(dmg) {
    this.hp -= dmg;
    if (this.hp <= 0) this.dead = true;
  }

  drawHealthBar(ctx) {
    if (this.hp >= this.maxHp) return;
    const bw = this.hw * 2;
    const bh = 3;
    const bx = this.x - this.hw;
    const by = this.y - this.hh - 7;
    ctx.fillStyle = '#440000';
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = '#ff2222';
    ctx.fillRect(bx, by, bw * (this.hp / this.maxHp), bh);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(Math.round(this.x), Math.round(this.y));
    G.drawEnemy(ctx, this.type, this.frame, this.scale);
    ctx.restore();
    this.drawHealthBar(ctx);
  }
};

// ─── Grunt ────────────────────────────────────────────────────────────────────
G.Grunt = class Grunt extends G.Enemy {
  constructor(x, y) {
    super(x, y, 'grunt', G.C.GRUNT_HP, G.C.GRUNT_HW, G.C.GRUNT_HH,
          G.C.GRUNT_SPEED, G.C.GRUNT_SCALE);
    this.score = G.C.GRUNT_SCORE;
  }

  update(px, py) {
    this.seekPlayer(px, py);
    this.tickAnim();
  }
};

// ─── Runner ───────────────────────────────────────────────────────────────────
G.Runner = class Runner extends G.Enemy {
  constructor(x, y) {
    super(x, y, 'runner', G.C.RUNNER_HP, G.C.RUNNER_HW, G.C.RUNNER_HH,
          G.C.RUNNER_SPEED, G.C.RUNNER_SCALE);
    this.score = G.C.RUNNER_SCORE;
    this.FRAME_RATE = 7;
  }

  update(px, py) {
    this.seekPlayer(px, py);
    this.tickAnim();
  }
};

// ─── Tank ─────────────────────────────────────────────────────────────────────
G.Tank = class Tank extends G.Enemy {
  constructor(x, y) {
    super(x, y, 'tank', G.C.TANK_HP, G.C.TANK_HW, G.C.TANK_HH,
          G.C.TANK_SPEED, G.C.TANK_SCALE);
    this.score = G.C.TANK_SCORE;
    this.FRAME_RATE = 18;
    this.chargeCooldown = G.C.TANK_CHARGE_CD;
    this.chargeTimer    = 0;
    this.charging       = false;
    this.chargeVx = 0;
    this.chargeVy = 0;
  }

  update(px, py) {
    if (this.charging) {
      // Lunge toward locked position
      this.x += this.chargeVx;
      this.y += this.chargeVy;
      this.chargeTimer--;
      if (this.chargeTimer <= 0) {
        this.charging = false;
        this.chargeCooldown = G.C.TANK_CHARGE_CD;
      }
    } else {
      this.seekPlayer(px, py);
      this.chargeCooldown--;
      if (this.chargeCooldown <= 0) {
        // Begin charge
        const dx = px - this.x;
        const dy = py - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        this.chargeVx = (dx / dist) * G.C.TANK_CHARGE_SPEED;
        this.chargeVy = (dy / dist) * G.C.TANK_CHARGE_SPEED;
        this.chargeTimer = G.C.TANK_CHARGE_DUR;
        this.charging = true;
      }
    }
    this.tickAnim();
  }
};

// ─── Sniper ──────────────────────────────────────────────────────────────────
G.Sniper = class Sniper extends G.Enemy {
  constructor(x, y) {
    super(x, y, 'sniper', G.C.SNIPER_HP, G.C.SNIPER_HW, G.C.SNIPER_HH,
          G.C.SNIPER_SPEED, G.C.SNIPER_SCALE);
    this.score = G.C.SNIPER_SCORE;
    this.teleportCd = G.C.SNIPER_TELEPORT_CD / 2; // first teleport comes sooner
    this.shootCd = G.C.SNIPER_SHOOT_CD;
    this.pauseTimer = 0;
    this.pendingBullet = null;
  }

  update(px, py) {
    this.pendingBullet = null;

    // Teleport logic
    this.teleportCd--;
    if (this.teleportCd <= 0) {
      const margin = G.C.SPAWN_MARGIN + 30;
      this.x = margin + Math.random() * (G.C.W - margin * 2);
      this.y = margin + Math.random() * (G.C.H - margin * 2);
      this.teleportCd = G.C.SNIPER_TELEPORT_CD;
      this.pauseTimer = G.C.SNIPER_TELEPORT_PAUSE;
    }

    // After teleport pause, move slowly toward player
    if (this.pauseTimer > 0) {
      this.pauseTimer--;
    } else {
      this.seekPlayer(px, py);
    }

    // Shoot at player on cooldown
    this.shootCd--;
    if (this.shootCd <= 0) {
      const dx = px - this.x;
      const dy = py - this.y;
      const angle = Math.atan2(dy, dx);
      this.pendingBullet = {
        x: this.x, y: this.y, angle: angle,
        speed: G.C.SNIPER_BULLET_SPEED,
        radius: G.C.SNIPER_BULLET_R,
        color: G.C.SNIPER_BULLET_COL,
        dmg: G.C.SNIPER_BULLET_DMG,
      };
      this.shootCd = G.C.SNIPER_SHOOT_CD;
    }

    this.tickAnim();
  }
};

// ─── Factory ──────────────────────────────────────────────────────────────────
G.spawnEnemy = function(type, x, y) {
  switch (type) {
    case 'grunt':  return new G.Grunt(x, y);
    case 'runner': return new G.Runner(x, y);
    case 'tank':   return new G.Tank(x, y);
    case 'sniper': return new G.Sniper(x, y);
    default:
      console.error(`G.spawnEnemy: unknown enemy type "${type}" — check levels.js`);
      return null;
  }
};
