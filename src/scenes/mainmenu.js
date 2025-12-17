import { GAME_SIZE } from "../core/constants.js";
import { getHighScore } from "../core/highscore.js";

export class MainMenu extends Phaser.Scene {
  constructor(){ super({ key:'MainMenu' }); }

  preload() {
    this.load.setPath('assets/sprites/ui');

    this.letters = ['J','E','W','E','L','R','Y'];
    this.playOrder = [];
    this.letters.forEach(L => { for (let i=1;i<=6;i++) this.playOrder.push(`${L}${i}`); });

    this.exts = ['png','PNG','jpg','jpeg','webp'];
    const unique = Array.from(new Set(this.playOrder));
    unique.forEach(name => this.exts.forEach(ext => this.load.image(`${name}__${ext}`, `${name}.${ext}`)));
    //localStorage.removeItem('magicjewelry_hiscore');
  }

  async create() {

    this.resolved = {};
    Array.from(new Set(this.playOrder)).forEach(name => {
      const k = this.exts.map(ext => `${name}__${ext}`).find(kk => this.textures.exists(kk));
      if (k) this.resolved[name] = k;
    });

    // -------- ajustes de tamaño y posición --------
    this.scaleFactor = 0.65;              
    this.topY = Math.round(GAME_SIZE.HEIGHT * 0.1); 
    // ----------------------------------------------

    const firstKey = this.resolved[this.playOrder[0]];
    this.slide = this.add.image(GAME_SIZE.WIDTH/2, this.topY, firstKey)
                    .setOrigin(0.5, 0)
                    .setAlpha(0)
                    .setDepth(10);

    fitInside(this.slide, GAME_SIZE.WIDTH, GAME_SIZE.HEIGHT, this.scaleFactor);

    this.timings = { fadeIn: 120, hold: 220, fadeOut: 80 };

    await waitForFont('Press Start 2P');

    // Texto 
    
    const titleY = this.topY + (this.slide.displayHeight / 2) + 200;

    this.title = this.add.text(GAME_SIZE.WIDTH / 2, titleY, '©1990', {
      fontFamily: '"Press Start 2P"',
      fontSize: '25px',          
      color: '#FFFFFF',
      stroke: '',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(1, -1).setDepth(11);

    this.title = this.add.text(GAME_SIZE.WIDTH / 2, titleY, 'RCM', {
      fontFamily: '"Press Start 2P"',
      fontSize: '25px',          
      color: '#6495ed',
      stroke: '',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(-0.5, -1).setDepth(11);

    
    this.title = this.add.text(GAME_SIZE.WIDTH / 2, titleY, 'HWANG SHINWEI', {
      fontFamily: '"Press Start 2P"',
      fontSize: '25px',          
      color: '#edc001',
      stroke: '',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5, -10).setDepth(11);
    if (this.title.setLetterSpacing) this.title.setLetterSpacing(-1);

    this.hiScoreLabel = this.add.text(GAME_SIZE.WIDTH / 2, GAME_SIZE.HEIGHT - 65, 'HI SCORE', {
      fontFamily: '"Press Start 2P"',
      fontSize: '25px',
      color: '#6495ed',
      stroke: '',
      strokeThickness: 3,
      align: 'center'
    }).setOrigin(1, 1).setDepth(11);

    const hiScore = getHighScore().toString().padStart(7, '0');
    this.hiScoreLabel = this.add.text(GAME_SIZE.WIDTH / 2, GAME_SIZE.HEIGHT - 65, hiScore, {
      fontFamily: '"Press Start 2P"',
      fontSize: '25px',
      color: '#FFFFFF',
      stroke: '',
      strokeThickness: 3,
      align: 'center'
    }).setOrigin(-0.1, 1).setDepth(11);

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
    fitInside(this.slide, GAME_SIZE.WIDTH, GAME_SIZE.HEIGHT, this.scaleFactor);
    this.slide.setPosition(GAME_SIZE.WIDTH / 2, this.topY);

    const titleY = this.topY + 160;
    this.title.setPosition(GAME_SIZE.WIDTH / 2, titleY);

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

function waitForFont(family, timeoutMs = 4000){
  return new Promise((resolve) => {
    if (!document.fonts) return resolve();
    if (document.fonts.check(`16px "${family}"`)) return resolve();

    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };

    document.fonts.load(`16px "${family}"`).then(finish).catch(finish);
    document.fonts.load(`24px "${family}"`).then(finish).catch(()=>{});
    document.fonts.ready?.then(finish).catch(()=>{});

    setTimeout(finish, timeoutMs);
  });
}

window.MainMenu = MainMenu