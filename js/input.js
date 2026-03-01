window.G = window.G || {};

G.InputManager = class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.mouse = { x: 0, y: 0, down: false, clicked: false };
    this._scale = 1;

    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      // Prevent arrow keys scrolling page
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      this._scale = rect.width / G.C.W;
      this.mouse.x = (e.clientX - rect.left) / this._scale;
      this.mouse.y = (e.clientY - rect.top)  / this._scale;
    });

    canvas.addEventListener('mousedown', e => {
      if (e.button === 0) { this.mouse.down = true; this.mouse.clicked = true; }
    });
    canvas.addEventListener('mouseup', e => {
      if (e.button === 0) { this.mouse.down = false; }
    });
    // Prevent context menu
    canvas.addEventListener('contextmenu', e => e.preventDefault());
  }

  // Returns {x, y} in [-1, 1], normalized for diagonal movement
  getMovement() {
    let dx = 0, dy = 0;
    if (this.keys['ArrowLeft']  || this.keys['KeyA']) dx -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) dx += 1;
    if (this.keys['ArrowUp']    || this.keys['KeyW']) dy -= 1;
    if (this.keys['ArrowDown']  || this.keys['KeyS']) dy += 1;
    if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }
    return { x: dx, y: dy };
  }

  // Returns true once per click, then clears the flag
  consumeClick() {
    if (this.mouse.clicked) { this.mouse.clicked = false; return true; }
    return false;
  }

  // End-of-frame cleanup (clicked flag consumed by game logic)
  endFrame() {
    this.mouse.clicked = false;
  }
};
