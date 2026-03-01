window.G = window.G || {};

G.Effects = class Effects {
  constructor(canvas) {
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeMag = 0;

    // Pre-render scanlines once
    this.scanlineCanvas = document.createElement('canvas');
    this.scanlineCanvas.width  = G.C.W;
    this.scanlineCanvas.height = G.C.H;
    this._buildScanlines();
  }

  _buildScanlines() {
    const ctx = this.scanlineCanvas.getContext('2d');
    ctx.clearRect(0, 0, G.C.W, G.C.H);
    ctx.fillStyle = `rgba(0,0,0,${G.C.SCANLINE_ALPHA})`;
    for (let y = 0; y < G.C.H; y += 2) {
      ctx.fillRect(0, y, G.C.W, 1);
    }
  }

  shake(magnitude) {
    if (magnitude > this.shakeMag) this.shakeMag = magnitude;
  }

  update() {
    if (this.shakeMag > 0.5) {
      const angle = Math.random() * Math.PI * 2;
      this.shakeX = Math.round(Math.cos(angle) * this.shakeMag);
      this.shakeY = Math.round(Math.sin(angle) * this.shakeMag);
      this.shakeMag *= G.C.SHAKE_DECAY;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
      this.shakeMag = 0;
    }
  }

  drawScanlines(ctx) {
    ctx.drawImage(this.scanlineCanvas, 0, 0);
  }
};
