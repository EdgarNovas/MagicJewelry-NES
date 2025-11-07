class MainMenu extends Phaser.Scene {
  constructor(){ super({ key:'MainMenu' }); }

  preload() {
    this.load.setPath('assets/sprites');

    this.letters = ['J','E','W','E','L','R','Y'];
    this.playOrder = [];
    this.letters.forEach(L => { for (let i=1;i<=6;i++) this.playOrder.push(`${L}${i}`); });

    this.exts = ['png','PNG','jpg','jpeg','webp'];
    const unique = Array.from(new Set(this.playOrder));
    unique.forEach(name => this.exts.forEach(ext => this.load.image(`${name}__${ext}`, `${name}.${ext}`)));
  }

  create() {
    const { width, height } = this.scale;

    
    this.resolved = {};
    Array.from(new Set(this.playOrder)).forEach(name => {
      const k = this.exts.map(ext => `${name}__${ext}`).find(kk => this.textures.exists(kk));
      if (k) this.resolved[name] = k;
    });

    // -------- ajustes de tamaño y posición --------
    this.scaleFactor = 0.45;   
    this.topY = Math.round(height * 0.20); 
    // ----------------------------------------------

    const firstKey = this.resolved[this.playOrder[0]];
    this.slide = this.add.image(width/2, this.topY, firstKey)
                    .setOrigin(0.5, 0.5)
                    .setAlpha(0)
                    .setDepth(10);

    fitInside(this.slide, width, height, this.scaleFactor);

    this.timings = { fadeIn: 120, hold: 220, fadeOut: 80 };

    this.currentIndex = 0;
    this.showSlide(this.currentIndex);

    
    this.input.once('pointerdown', () => this.scene.start('level1'));
    this.input.keyboard.once('keydown', () => this.scene.start('level1'));
  }

  showSlide(i) {
    if (i >= this.playOrder.length) {
      this.scene.start('level1'); 
      return;
    }

    const name = this.playOrder[i];
    const key  = this.resolved[name];

    if (!key) {
      this.time.delayedCall(10, () => this.showSlide(i + 1));
      return;
    }

    this.slide.setTexture(key);
    fitInside(this.slide, this.scale.width, this.scale.height, this.scaleFactor);
    this.slide.setPosition(this.scale.width / 2, this.topY);
    this.slide.setAlpha(0);

    this.tweens.add({
      targets: this.slide,
      alpha: 1,
      duration: this.timings.fadeIn,
      ease: 'Linear',
      onComplete: () => {
        this.time.delayedCall(this.timings.hold, () => {
          this.tweens.add({
            targets: this.slide,
            alpha: 0,
            duration: this.timings.fadeOut,
            ease: 'Linear',
            onComplete: () => this.showSlide(i + 1)
          });
        });
      }
    });
  }
}

function fitInside(img, W, H, factor = 1){
  const src = img.texture?.getSourceImage?.();
  if (!src || !src.width || !src.height) return;
  const s = Math.min(W / src.width, H / src.height) * factor;
  img.setScale(s);
}

window.MainMenu = MainMenu;
