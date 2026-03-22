window.G = window.G || {};

G.Bullet = class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * G.C.BULLET_SPEED;
    this.vy = Math.sin(angle) * G.C.BULLET_SPEED;
    this.radius = G.C.BULLET_R;
    this.dead = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    // Kill if off-screen (with margin)
    if (this.x < -20 || this.x > G.C.W + 20 ||
        this.y < -20 || this.y > G.C.H + 20) {
      this.dead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    // Glow
    ctx.shadowColor = '#ffee44';
    ctx.shadowBlur  = 6;
    ctx.fillStyle   = G.C.BULLET_COL;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    // Bright center
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }
};

// ─── Enemy Bullet ────────────────────────────────────────────────────────────
G.EnemyBullet = class EnemyBullet {
  constructor(x, y, angle, speed, radius, color, dmg) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.radius = radius;
    this.color = color;
    this.dmg = dmg;
    this.dead = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -20 || this.x > G.C.W + 20 ||
        this.y < -20 || this.y > G.C.H + 20) {
      this.dead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }
};
