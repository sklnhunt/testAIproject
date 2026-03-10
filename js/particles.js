window.G = window.G || {};

G.ParticleSystem = class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawnDeath(x, y, colors) {
    if (!colors || colors.length === 0) {
      console.error('ParticleSystem.spawnDeath: colors array missing — check G.DEATH_COLORS');
      return;
    }
    const n = G.C.DEATH_PARTICLES;
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 / n) * i + (Math.random() - 0.5) * 0.4;
      const speed = 2 + Math.random() * 3;
      const life  = 20 + Math.floor(Math.random() * 20);
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life, maxLife: life,
        type: 'death',
      });
    }
  }

  spawnImpact(x, y) {
    const n = G.C.IMPACT_PARTICLES;
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      const life  = 8 + Math.floor(Math.random() * 6);
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2,
        color: '#ffee44',
        life, maxLife: life,
        type: 'impact',
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.life--;
      if (p.type === 'death') p.size *= 0.96;
      if (p.life <= 0 || p.size < 0.5) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(
        Math.round(p.x - p.size / 2),
        Math.round(p.y - p.size / 2),
        Math.round(p.size), Math.round(p.size)
      );
    }
    ctx.globalAlpha = 1;
  }

  clear() { this.particles = []; }
};

// Color palettes per enemy type (used by spawnDeath)
G.DEATH_COLORS = {
  grunt:  ['#cc2222', '#ff4444', '#ffff00', '#884411'],
  runner: ['#ff8800', '#ffcc44', '#cc5500', '#ffffff'],
  tank:   ['#228822', '#55aa55', '#aaff44', '#115511'],
  player: ['#4488ff', '#88ccff', '#ffcc88', '#ffffff'],
};
