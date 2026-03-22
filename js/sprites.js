window.G = window.G || {};

// ─── Generic pixel-art renderer ──────────────────────────────────────────────
// grid: array of strings, each char is a palette key ('.' = transparent)
// palette: { char: cssColor }
// cx/cy: center offset within the sprite
G.drawPixelArt = function(ctx, grid, cx, cy, scale, palette) {
  const rows = grid.length;
  const cols = grid[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ch = grid[r][c];
      if (ch === '.') continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(
        Math.round((c - cx) * scale),
        Math.round((r - cy) * scale),
        scale, scale
      );
    }
  }
};

// ─── Player sprites (8×8, 4 walk frames) ─────────────────────────────────────
// Legend: B=body, D=dark, S=skin, G=gun metal, .=transparent
G.PLAYER_PALETTE = {
  B: '#4488ff',
  D: '#2255cc',
  S: '#ffcc88',
  G: '#aaaaaa',
  K: '#333333',
};

// Each frame is 8 rows × 8 cols
G.PLAYER_FRAMES = [
  // Frame 0 – idle / walk A
  [
    '..BSSS..',
    '..BSSB..',
    '.DBBBBD.',
    '.DBBBBD.',
    '.DBBGBD.',
    '..BBB...',
    '..B.B...',
    '..K.K...',
  ],
  // Frame 1 – walk B
  [
    '..BSSS..',
    '..BSSB..',
    '.DBBBBD.',
    '.DBBBBD.',
    '.DBBGBD.',
    '..BBB...',
    '.KB.B...',
    '...BK...',
  ],
  // Frame 2 – walk C (same as A, mirrored legs)
  [
    '..BSSS..',
    '..BSSB..',
    '.DBBBBD.',
    '.DBBBBD.',
    '.DBBGBD.',
    '..BBB...',
    '..B.B...',
    '..K.K...',
  ],
  // Frame 3 – walk D
  [
    '..BSSS..',
    '..BSSB..',
    '.DBBBBD.',
    '.DBBBBD.',
    '.DBBGBD.',
    '..BBB...',
    '...B.KB.',
    '..KB....',
  ],
];

// Gun arm drawn on top, always points right (rotate with ctx)
G.GUN_GRID = [
  '....GGG.',
  '..KGGGGK',
  '....GGG.',
];

G.drawPlayer = function(ctx, frame, aimAngle, scale, iFrames) {
  // Invincibility flash
  if (iFrames > 0 && Math.floor(iFrames / 6) % 2 === 1) return;

  const grid = G.PLAYER_FRAMES[frame % 4];
  // center is col 4, row 4 (0-indexed: cx=3.5, cy=3.5)
  G.drawPixelArt(ctx, grid, 3.5, 3.5, scale, G.PLAYER_PALETTE);

  // Gun arm — always rotated to aim angle
  ctx.save();
  ctx.rotate(aimAngle);
  ctx.translate(scale * 2, 0); // offset right
  G.drawPixelArt(ctx, G.GUN_GRID, 0, 1, scale * 0.8, G.PLAYER_PALETTE);
  ctx.restore();
};

// ─── Grunt (8×8, 2 frames) ───────────────────────────────────────────────────
G.GRUNT_PALETTE = {
  R: '#cc2222', D: '#881111', E: '#ffff00', K: '#000000',
};
G.GRUNT_FRAMES = [
  [
    '..RRRR..',
    '.RRRRRR.',
    '.REEDER.',
    '.RRRRRR.',
    'DRRRRRD.',
    '.DRRRD..',
    '.DR.RD..',
    '.KR.RK..',
  ],
  [
    '..RRRR..',
    '.RRRRRR.',
    '.REEDER.',
    '.RRRRRR.',
    'DRRRRRD.',
    '.DRRRD..',
    'KDR.RD..',
    '..KR.R..',
  ],
];

// ─── Runner (6×6, 2 frames) ──────────────────────────────────────────────────
G.RUNNER_PALETTE = {
  O: '#ff8800', D: '#cc5500', E: '#ffffff', K: '#000000',
};
G.RUNNER_FRAMES = [
  [
    '.OOOO.',
    'OOEOEO',
    'OOOOOO',
    '.DOOOD',
    '.DO.OD',
    '.KO.OK',
  ],
  [
    '.OOOO.',
    'OOEOEO',
    'OOOOOO',
    '.DOOOD',
    'KDO.OD',
    '..KO.O',
  ],
];

// ─── Tank (10×10, 2 frames) ──────────────────────────────────────────────────
G.TANK_PALETTE = {
  T: '#228822', D: '#115511', E: '#ff0000', K: '#000000', A: '#55aa55',
};
G.TANK_FRAMES = [
  [
    '..TTTTTT..',
    '.TTTTTTTT.',
    'DTTEETTTTD',
    'DTTTTTTTTD',
    'DTTTTTTTTD',
    'DTTTTTTTTD',
    '.ADDTTDDA.',
    '..DDTTDD..',
    '..DT..TD..',
    '..KT..TK..',
  ],
  [
    '..TTTTTT..',
    '.TTTTTTTT.',
    'DTTEETTTTD',
    'DTTTTTTTTD',
    'DTTTTTTTTD',
    'DTTTTTTTTD',
    '.ADDTTDDA.',
    '..DDTTDD..',
    '.KDT..TDK.',
    '...T..T...',
  ],
];

// ─── Sniper (8×8, 2 frames) ─────────────────────────────────────────────────
G.SNIPER_PALETTE = {
  V: '#8844cc', D: '#552288', E: '#ff4444', K: '#000000', L: '#aa66ee',
};
G.SNIPER_FRAMES = [
  [
    '..VVVV..',
    '.VLVVLV.',
    '.VEEVEV.',
    '.VVVVVV.',
    'DVVVVVVD',
    '.DVVVVD.',
    '.DV..VD.',
    '.KV..VK.',
  ],
  [
    '..VVVV..',
    '.VLVVLV.',
    '.VEEVEV.',
    '.VVVVVV.',
    'DVVVVVVD',
    '.DVVVVD.',
    'KDV..VD.',
    '..KV.VK.',
  ],
];

G.drawEnemy = function(ctx, type, frame, scale) {
  if (type === 'grunt') {
    G.drawPixelArt(ctx, G.GRUNT_FRAMES[frame % 2], 4, 4, scale, G.GRUNT_PALETTE);
  } else if (type === 'runner') {
    G.drawPixelArt(ctx, G.RUNNER_FRAMES[frame % 2], 3, 3, scale, G.RUNNER_PALETTE);
  } else if (type === 'tank') {
    G.drawPixelArt(ctx, G.TANK_FRAMES[frame % 2], 5, 5, scale, G.TANK_PALETTE);
  } else if (type === 'sniper') {
    G.drawPixelArt(ctx, G.SNIPER_FRAMES[frame % 2], 4, 4, scale, G.SNIPER_PALETTE);
  }
};

// ─── Muzzle flash ────────────────────────────────────────────────────────────
G.drawMuzzleFlash = function(ctx, aimAngle, scale, flashTimer) {
  if (flashTimer <= 0) return;
  const dist = scale * 4;
  const alpha = flashTimer / 6;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.rotate(aimAngle);
  ctx.translate(dist + scale * 2, 0);
  ctx.fillStyle = '#ffee44';
  const sz = scale * 1.5;
  // Center glow
  ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
  // Rays
  const rays = [0, Math.PI / 4, Math.PI / 2, -Math.PI / 4];
  for (const a of rays) {
    ctx.save();
    ctx.rotate(a);
    ctx.fillRect(sz / 2, -1, sz, 2);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
};
