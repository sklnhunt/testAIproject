window.G = window.G || {};

G.LEVELS = [
  {
    name: 'THE ARRIVAL',
    waves: [
      { spawnInterval: 90, enemies: { grunt: 5 } },
      { spawnInterval: 75, enemies: { grunt: 6, runner: 2 } },
      { spawnInterval: 60, enemies: { grunt: 4, runner: 4 } },
    ],
  },
  {
    name: 'HEAVY METAL',
    waves: [
      { spawnInterval: 70, enemies: { grunt: 4, runner: 3, tank: 1 } },
      { spawnInterval: 60, enemies: { grunt: 5, runner: 4, tank: 1 } },
      { spawnInterval: 50, enemies: { grunt: 3, runner: 5, tank: 2 } },
    ],
  },
  {
    name: 'THE SWARM',
    waves: [
      { spawnInterval: 40, enemies: { grunt: 3, runner: 8,  tank: 1 } },
      { spawnInterval: 35, enemies: { grunt: 4, runner: 10, tank: 2 } },
      { spawnInterval: 30, enemies: { grunt: 6, runner: 12, tank: 3 } },
    ],
  },
];
