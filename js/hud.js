window.G = window.G || {};

G.HUD = class HUD {
  draw(ctx, player, score, waveName, levelName) {
    const hw = G.C.HUD_HEALTH_W;
    const hh = G.C.HUD_HEALTH_H;
    const hx = 16;
    const hy = G.C.H - 28;

    // ── Health bar ──────────────────────────────────────────────────────────
    // Background
    ctx.fillStyle = '#220000';
    ctx.fillRect(hx, hy, hw, hh);

    // Fill (green → red based on HP ratio)
    const ratio = player.hp / player.maxHp;
    const r = Math.round(255 * (1 - ratio));
    const g = Math.round(200 * ratio);
    ctx.fillStyle = `rgb(${r},${g},0)`;
    ctx.fillRect(hx, hy, Math.round(hw * ratio), hh);

    // Border
    ctx.strokeStyle = '#888888';
    ctx.lineWidth   = 1;
    ctx.strokeRect(hx, hy, hw, hh);

    // HP label
    ctx.fillStyle  = '#ffffff';
    ctx.font       = 'bold 11px monospace';
    ctx.textAlign  = 'left';
    ctx.fillText('HP', hx + 4, hy + hh - 3);

    // HP value
    ctx.textAlign = 'right';
    ctx.fillText(player.hp, hx + hw - 4, hy + hh - 3);

    // ── Level / Wave (top center) ────────────────────────────────────────────
    ctx.textAlign   = 'center';
    ctx.font        = 'bold 13px monospace';
    ctx.fillStyle   = '#aaaaff';
    ctx.fillText(levelName, G.C.W / 2, 20);
    ctx.fillStyle   = '#ffffff';
    ctx.font        = '11px monospace';
    ctx.fillText(waveName, G.C.W / 2, 36);

    // ── Score (top right) ────────────────────────────────────────────────────
    ctx.textAlign  = 'right';
    ctx.font       = 'bold 13px monospace';
    ctx.fillStyle  = '#ffee44';
    ctx.fillText(`SCORE: ${score}`, G.C.W - 16, 20);
  }
};
