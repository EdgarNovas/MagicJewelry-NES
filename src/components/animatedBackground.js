// js/animatedbackground.js
export class AnimatedBackground {
  constructor(scene, area, cfg = {}) {
    this.scene = scene;
    this.area = area;
    this.cfg = Object.assign({
      starKey: 'stars',
      starFrames: [0, 1, 2, 3],
      starCount: 60,
      speedMin: 6,      
      speedMax: 10,     
      starScale: 2,   
      moonKey: 'moon',
      moonFrame: 0,
      moonSpeed: 10,    
      moonScale: 1,
      depth: -90,
      useMask: true,
      debugRect: false
    }, cfg);

    this.container = scene.add.container(0, 0).setDepth(this.cfg.depth);

    if (this.cfg.useMask) {
      const gMask = scene.add.graphics().setVisible(false);
      gMask.fillStyle(0xffffff, 1);
      gMask.fillRect(area.x, area.y, area.width, area.height);
      const mask = gMask.createGeometryMask();
      this.container.setMask(mask);
      this._maskGraphics = gMask;
    }

    if (this.cfg.debugRect) {
      this._debug = scene.add.rectangle(
        area.x, area.y, area.width, area.height, 0x00ff00, 0.08
      ).setOrigin(0,0).setStrokeStyle(1, 0x00ff00, 0.9).setDepth(this.cfg.depth + 1);
    }

    this.stars = [];
    for (let i = 0; i < this.cfg.starCount; i++) {
      const frame = Phaser.Utils.Array.GetRandom(this.cfg.starFrames);
      const x = Phaser.Math.Between(area.x, area.x + area.width);
      const y = Phaser.Math.Between(area.y, area.y + area.height);
      const s = (frame != null)
        ? scene.add.image(x, y, this.cfg.starKey, frame)
        : scene.add.image(x, y, this.cfg.starKey);
      s.setOrigin(0.5).setScale(this.cfg.starScale);
      s._vy = -Phaser.Math.Between(this.cfg.speedMin, this.cfg.speedMax);
      this.container.add(s);
      this.stars.push(s);
    }

    if (this.cfg.moonKey) {
      const mx = area.centerX;
      const my = area.y + area.height * 0.75;
      this.moon = scene.add.image(mx, my, this.cfg.moonKey, this.cfg.moonFrame)
        .setOrigin(0.5).setScale(this.cfg.moonScale);
      this.moon._vy = -this.cfg.moonSpeed;
      this.container.add(this.moon);
    } else {
      this.moon = null;
    }
  }

  setArea(area) {
    this.area = area;
    if (this._maskGraphics) {
      this._maskGraphics.clear().fillStyle(0xffffff, 1)
        .fillRect(area.x, area.y, area.width, area.height);
    }
    if (this._debug) {
      this._debug.setPosition(area.x, area.y).setSize(area.width, area.height);
    }
  }

  update(delta) {
    const dt = delta / 1000;
    const top = this.area.y, bottom = this.area.y + this.area.height;
    const left = this.area.x, right = this.area.x + this.area.width;

    for (const s of this.stars) {
      s.y += s._vy * dt;
      if (s.y < top - 2) {
        s.y = bottom + Phaser.Math.Between(0, 8);
        s.x = Phaser.Math.Between(left, right);
      }
    }

    if (this.moon) {
      this.moon.y += this.moon._vy * dt;
      if (this.moon.y < top - this.moon.displayHeight / 2) {
        this.moon.y = bottom + this.moon.displayHeight / 2 + 2;
      }
    }
  }

  destroy() {
    this.container?.destroy(true);
    this._maskGraphics?.destroy();
    this._debug?.destroy();
  }
}
window.AnimatedBackground = AnimatedBackground;
