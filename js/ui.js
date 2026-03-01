window.G = window.G || {};

// ─── Button drawing helper ────────────────────────────────────────────────────
G.drawButton = function(ctx, label, cx, cy, w, h, hovered) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  ctx.fillStyle = hovered ? '#5566ff' : '#2233aa';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = hovered ? '#aabbff' : '#4455cc';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle  = '#ffffff';
  ctx.font       = 'bold 16px monospace';
  ctx.textAlign  = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, cy);
  ctx.textBaseline = 'alphabetic';
  return { x, y, w, h };
};

G.hitButton = function(mx, my, btn) {
  return mx >= btn.x && mx <= btn.x + btn.w &&
         my >= btn.y && my <= btn.y + btn.h;
};

// ─── UI class ────────────────────────────────────────────────────────────────
G.UI = class UI {
  constructor() {
    // Rects for hit-testing (set during draw)
    this.btnStart    = null;
    this.btnRestart  = null;
    this.btnContinue = null;
  }

  // ── MENU ──────────────────────────────────────────────────────────────────
  drawMenu(ctx, mx, my) {
    // Dark overlay
    ctx.fillStyle = 'rgba(0,0,0,0.72)';
    ctx.fillRect(0, 0, G.C.W, G.C.H);

    // Title
    ctx.fillStyle = '#ffee44';
    ctx.font      = 'bold 52px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PIXEL ASSAULT', G.C.W / 2, G.C.H / 2 - 80);

    ctx.fillStyle = '#aaaaff';
    ctx.font      = '16px monospace';
    ctx.fillText('ARROWS/WASD  move  |  MOUSE  aim + shoot', G.C.W / 2, G.C.H / 2 - 30);

    this.btnStart = G.drawButton(ctx, 'START GAME', G.C.W / 2, G.C.H / 2 + 30, 180, 44,
      this.btnStart && G.hitButton(mx, my, this.btnStart));

    ctx.fillStyle  = '#555577';
    ctx.font       = '12px monospace';
    ctx.fillText('Survive all waves to win!', G.C.W / 2, G.C.H / 2 + 90);
  }

  // ── WAVE CLEAR BANNER ─────────────────────────────────────────────────────
  drawWaveClear(ctx, timer) {
    const alpha = Math.min(1, timer / 30);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, G.C.H / 2 - 36, G.C.W, 72);
    ctx.fillStyle  = '#44ff88';
    ctx.font       = 'bold 36px monospace';
    ctx.textAlign  = 'center';
    ctx.fillText('WAVE CLEAR!', G.C.W / 2, G.C.H / 2 + 12);
    ctx.restore();
  }

  // ── LEVEL COMPLETE ────────────────────────────────────────────────────────
  drawLevelComplete(ctx, levelName, score, mx, my, hasNext) {
    ctx.fillStyle = 'rgba(0,0,0,0.78)';
    ctx.fillRect(0, 0, G.C.W, G.C.H);

    ctx.fillStyle = '#44ff88';
    ctx.font      = 'bold 40px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL COMPLETE!', G.C.W / 2, G.C.H / 2 - 70);

    ctx.fillStyle = '#aaaaff';
    ctx.font      = '20px monospace';
    ctx.fillText(levelName, G.C.W / 2, G.C.H / 2 - 30);

    ctx.fillStyle = '#ffee44';
    ctx.font      = 'bold 18px monospace';
    ctx.fillText(`SCORE: ${score}`, G.C.W / 2, G.C.H / 2 + 10);

    const label = hasNext ? 'NEXT LEVEL' : 'FINISH';
    this.btnContinue = G.drawButton(ctx, label, G.C.W / 2, G.C.H / 2 + 65, 180, 44,
      this.btnContinue && G.hitButton(mx, my, this.btnContinue));
  }

  // ── GAME OVER ─────────────────────────────────────────────────────────────
  drawGameOver(ctx, score, mx, my) {
    ctx.fillStyle = 'rgba(0,0,0,0.80)';
    ctx.fillRect(0, 0, G.C.W, G.C.H);

    ctx.fillStyle = '#ff2222';
    ctx.font      = 'bold 52px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', G.C.W / 2, G.C.H / 2 - 60);

    ctx.fillStyle = '#ffee44';
    ctx.font      = 'bold 20px monospace';
    ctx.fillText(`FINAL SCORE: ${score}`, G.C.W / 2, G.C.H / 2);

    this.btnRestart = G.drawButton(ctx, 'PLAY AGAIN', G.C.W / 2, G.C.H / 2 + 65, 180, 44,
      this.btnRestart && G.hitButton(mx, my, this.btnRestart));
  }

  // ── WIN SCREEN ────────────────────────────────────────────────────────────
  drawWin(ctx, score, mx, my) {
    ctx.fillStyle = 'rgba(0,0,0,0.80)';
    ctx.fillRect(0, 0, G.C.W, G.C.H);

    ctx.fillStyle = '#ffee44';
    ctx.font      = 'bold 44px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('YOU WIN!', G.C.W / 2, G.C.H / 2 - 70);

    ctx.fillStyle = '#44ff88';
    ctx.font      = '20px monospace';
    ctx.fillText('All levels conquered!', G.C.W / 2, G.C.H / 2 - 20);

    ctx.fillStyle = '#ffee44';
    ctx.font      = 'bold 18px monospace';
    ctx.fillText(`FINAL SCORE: ${score}`, G.C.W / 2, G.C.H / 2 + 20);

    this.btnRestart = G.drawButton(ctx, 'PLAY AGAIN', G.C.W / 2, G.C.H / 2 + 75, 180, 44,
      this.btnRestart && G.hitButton(mx, my, this.btnRestart));
  }
};
