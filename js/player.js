window.G = window.G || {};

G.Player = class Player {
  constructor() {
    this.x  = G.C.W / 2;
    this.y  = G.C.H / 2;
    this.hw = G.C.PLAYER_HW;
    this.hh = G.C.PLAYER_HH;
    this.hp = G.C.PLAYER_MAX_HP;
    this.maxHp = G.C.PLAYER_MAX_HP;
    this.speed = G.C.PLAYER_SPEED;
    this.scale = G.C.PLAYER_SCALE;

    this.aimAngle    = 0;
    this.shootCooldown = 0;
    this.muzzleFlash = 0;
    this.iFrames     = 0;

    this.frame     = 0;
    this.frameTick = 0;
    this.moving    = false;
    this.dead      = false;
  }

  get left()   { return this.x - this.hw; }
  get right()  { return this.x + this.hw; }
  get top()    { return this.y - this.hh; }
  get bottom() { return this.y + this.hh; }

  update(input) {
    const mv = input.getMovement();
    this.moving = (mv.x !== 0 || mv.y !== 0);

    this.x = Math.max(this.hw, Math.min(G.C.W - this.hw, this.x + mv.x * this.speed));
    this.y = Math.max(this.hh, Math.min(G.C.H - this.hh, this.y + mv.y * this.speed));

    // Aim
    this.aimAngle = Math.atan2(
      input.mouse.y - this.y,
      input.mouse.x - this.x
    );

    // Shoot
    if (this.shootCooldown > 0) this.shootCooldown--;
    if (this.muzzleFlash  > 0) this.muzzleFlash--;
    if (this.iFrames      > 0) this.iFrames--;

    // Animation
    if (this.moving) {
      this.frameTick++;
      if (this.frameTick >= 8) {
        this.frameTick = 0;
        this.frame = (this.frame + 1) % 4;
      }
    } else {
      this.frame = 0;
    }
  }

  // Returns a new Bullet if fired, or null
  tryShoot() {
    if (this.shootCooldown > 0) return null;
    this.shootCooldown = G.C.SHOOT_CD;
    this.muzzleFlash   = 6;
    // Bullet origin slightly ahead of player
    const bx = this.x + Math.cos(this.aimAngle) * (this.hw + 4);
    const by = this.y + Math.sin(this.aimAngle) * (this.hh + 4);
    return new G.Bullet(bx, by, this.aimAngle);
  }

  takeDamage(dmg) {
    if (this.iFrames > 0) return;
    this.hp -= dmg;
    this.iFrames = G.C.PLAYER_IFRAME;
    if (this.hp <= 0) { this.hp = 0; this.dead = true; }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(Math.round(this.x), Math.round(this.y));
    G.drawPlayer(ctx, this.frame, this.aimAngle, this.scale, this.iFrames);
    G.drawMuzzleFlash(ctx, this.aimAngle, this.scale, this.muzzleFlash);
    ctx.restore();
  }
};
