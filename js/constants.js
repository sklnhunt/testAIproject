window.G = window.G || {};

G.C = {
  // Canvas
  W: 800,
  H: 600,

  // Colors
  BG: '#0a0a12',
  GRID: '#12122a',
  WHITE: '#ffffff',
  BLACK: '#000000',

  // Player palette
  P_BODY: '#4488ff',
  P_DARK: '#2255cc',
  P_SKIN: '#ffcc88',
  P_GUN:  '#aaaaaa',

  // Enemy palettes
  GRUNT_MAIN:  '#cc2222',
  GRUNT_DARK:  '#881111',
  GRUNT_EYE:   '#ffff00',
  RUNNER_MAIN: '#ff8800',
  RUNNER_DARK: '#cc5500',
  RUNNER_EYE:  '#ffffff',
  TANK_MAIN:   '#228822',
  TANK_DARK:   '#115511',
  TANK_EYE:    '#ff0000',

  // Bullet
  BULLET_COL:  '#ffee44',
  BULLET_R:    4,
  BULLET_SPEED: 10,
  SHOOT_CD:    15, // frames

  // Speeds
  PLAYER_SPEED: 3,
  GRUNT_SPEED:  1.2,
  RUNNER_SPEED: 2.4,
  TANK_SPEED:   0.7,
  TANK_CHARGE_SPEED: 4.0,
  TANK_CHARGE_DUR:   20,
  TANK_CHARGE_CD:    120,

  // Health
  PLAYER_MAX_HP: 100,
  PLAYER_IFRAME:  60,
  PLAYER_CONTACT_DMG: 15,
  GRUNT_HP:  2,
  RUNNER_HP: 1,
  TANK_HP:   8,

  // Sizes (half-extents for AABB)
  PLAYER_HW: 12,
  PLAYER_HH: 12,
  GRUNT_HW:  13,
  GRUNT_HH:  13,
  RUNNER_HW: 9,
  RUNNER_HH: 9,
  TANK_HW:   18,
  TANK_HH:   18,

  // Sprite scale
  PLAYER_SCALE: 4,
  GRUNT_SCALE:  4,
  RUNNER_SCALE: 3,
  TANK_SCALE:   5,

  // Score
  GRUNT_SCORE:  100,
  RUNNER_SCORE: 150,
  TANK_SCORE:   500,

  // Shake
  SHOOT_SHAKE: 2,
  DEATH_SHAKE: 3,
  TANK_DEATH_SHAKE: 6,
  SHAKE_DECAY: 0.85,

  // Particles
  DEATH_PARTICLES: 12,
  IMPACT_PARTICLES: 4,

  // Spawn margin
  SPAWN_MARGIN: 20,

  // Wave timing
  WAVE_CLEAR_DELAY: 120, // frames before next wave starts
  LEVEL_COMPLETE_DELAY: 180,

  // HUD
  HUD_HEALTH_W: 150,
  HUD_HEALTH_H: 14,

  // Sniper
  SNIPER_SPEED: 0.8,
  SNIPER_HP: 3,
  SNIPER_HW: 13,
  SNIPER_HH: 13,
  SNIPER_SCALE: 4,
  SNIPER_SCORE: 300,
  SNIPER_TELEPORT_CD: 180,
  SNIPER_TELEPORT_PAUSE: 30,
  SNIPER_SHOOT_CD: 90,
  SNIPER_BULLET_SPEED: 4,
  SNIPER_BULLET_DMG: 10,
  SNIPER_BULLET_COL: '#ff44ff',
  SNIPER_BULLET_R: 3,

  // Scanline opacity
  SCANLINE_ALPHA: 0.15,
};
