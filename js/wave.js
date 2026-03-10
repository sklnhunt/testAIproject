window.G = window.G || {};

G.WaveController = class WaveController {
  constructor() {
    this.spawnQueue  = [];
    this.spawnTimer  = 0;
    this.spawnInterval = 60;
    this.waveIndex   = 0;
    this.levelIndex  = 0;
    this.done        = false;
    this._levelData  = null;
  }

  loadLevel(levelIndex) {
    if (levelIndex < 0 || levelIndex >= G.LEVELS.length) {
      console.error(`WaveController.loadLevel: invalid index ${levelIndex} (${G.LEVELS.length} levels)`);
      return;
    }
    this.levelIndex = levelIndex;
    this._levelData = G.LEVELS[levelIndex];
    this.waveIndex  = 0;
    this.done       = false;
  }

  startWave(enemies) {
    // Build flat spawn queue from enemy counts object
    const queue = [];
    for (const [type, count] of Object.entries(enemies)) {
      for (let i = 0; i < count; i++) queue.push(type);
    }
    // Shuffle
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    this.spawnQueue = queue;
    this.spawnTimer = 0;
  }

  beginCurrentWave() {
    if (!this._levelData) return;
    const waveDef = this._levelData.waves[this.waveIndex];
    if (!waveDef) {
      console.error(`WaveController.beginCurrentWave: no wave at index ${this.waveIndex}`);
      return;
    }
    this.spawnInterval = waveDef.spawnInterval;
    this.startWave(waveDef.enemies);
  }

  get currentWaveName() {
    if (!this._levelData) return '';
    return `WAVE ${this.waveIndex + 1}/${this._levelData.waves.length}`;
  }

  get totalWaves() {
    return this._levelData ? this._levelData.waves.length : 1;
  }

  get levelName() {
    return this._levelData ? this._levelData.name : '';
  }

  // Returns a spawn {type, x, y} or null each frame
  update() {
    if (this.spawnQueue.length === 0) return null;
    this.spawnTimer++;
    if (this.spawnTimer < this.spawnInterval) return null;
    this.spawnTimer = 0;
    const type = this.spawnQueue.shift();
    return { type, ...G.WaveController.randomEdgePos() };
  }

  // Returns true once queue is empty and no enemies remain
  isWaveDone(enemyCount) {
    return this.spawnQueue.length === 0 && enemyCount === 0;
  }

  // Advance to next wave; returns false if level is complete
  nextWave() {
    this.waveIndex++;
    if (this.waveIndex >= this._levelData.waves.length) {
      this.done = true;
      return false;
    }
    return true;
  }

  // Returns true if there are more levels after current
  hasNextLevel() {
    return this.levelIndex + 1 < G.LEVELS.length;
  }

  static randomEdgePos() {
    const m = G.C.SPAWN_MARGIN;
    const edge = Math.floor(Math.random() * 4);
    switch (edge) {
      case 0: return { x: Math.random() * G.C.W,  y: -m };            // top
      case 1: return { x: Math.random() * G.C.W,  y: G.C.H + m };     // bottom
      case 2: return { x: -m,                      y: Math.random() * G.C.H }; // left
      case 3: return { x: G.C.W + m,               y: Math.random() * G.C.H }; // right
      default: return { x: G.C.W / 2, y: -m };
    }
  }
};
