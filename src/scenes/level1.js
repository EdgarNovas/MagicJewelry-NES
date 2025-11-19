// js/level1.js
class level1 extends Phaser.Scene {
  constructor() { super({ key: 'level1' }); }

     preload() {
        this.load.setPath('assets/sprites/static');
        this.load.image('magenta', 'gem1.png');
        this.load.image('yellow', 'gem2.png');
        this.load.image('purple', 'gem3.png');
        this.load.image('orange', 'gem4.png');
        this.load.image('blue', 'gem5.png');
        this.load.image('green', 'gem6.png');

        this.load.setPath('assets/sounds/effects');
        this.load.audio('shift', 'shiftPosition.wav');
        this.load.audio('fall', 'fallToGround.wav');
    
        this.load.setPath('assets/sprites/backgrounds');
        this.load.image('background1', 'bg1.png');

        this.load.setPath('assets/sprites/spritesheets');
        this.load.spritesheet('stars', 'stars.png', { frameWidth: 4, frameHeight: 3 });

        this.load.setPath('assets/sprites/static');
        this.load.image('moon', 'moon.png');

        this.cursors = this.input.keyboard.createCursorKeys();
       
    }

  

    create() {
        const GW = this.scale.width;
        const GH = this.scale.height;

        
        const baseW = 256, baseH = 240;
        const ZOOM = 3;
        const PF = { left: 39, top: 14, width: 124, height: 212 };
        const COLS = 6, ROWS = 13;

        const marginX = Math.floor((GW - baseW * ZOOM) / 2);
        const marginY = Math.floor((GH - baseH * ZOOM) / 2);

        const SKY = { left: 170, top: 8, width: 78, height: 224 };
        const skyRect = new Phaser.Geom.Rectangle(
        marginX + SKY.left * ZOOM,
        marginY + SKY.top * ZOOM,
        SKY.width * ZOOM,
        SKY.height * ZOOM
        );

        const starsTex = this.textures.get('stars');
        const frames = starsTex && starsTex.frameTotal >= 4 ? [0, 1, 2, 3] : [0];

        this.abg = new AnimatedBackground(this, skyRect, {
        starKey: 'stars',
        starFrames: frames,
        starCount: 90,
        speedMin: 12,
        speedMax: 28,
        starScale: 1.6,
        moonKey: 'moon',
        moonSpeed: 18 * ZOOM,
        moonScale: 1.4 * ZOOM,
        depth: -100
        });

        this.add.image(marginX, marginY, 'background1')
        .setOrigin(0, 0)
        .setScale(ZOOM)
        .setDepth(-100);

        const pfX = marginX + PF.left * ZOOM;
        const pfY = marginY + PF.top * ZOOM;
        const pfW = PF.width * ZOOM;
        const pfH = PF.height * ZOOM;

        const cellSizeX = Math.floor(pfW / COLS);
        const cellSizeY = Math.floor(pfH / ROWS);
        const cellSize = Math.min(cellSizeX, cellSizeY);

        const gridW = cellSize * COLS;
        const gridH = cellSize * ROWS;
        const offsetX = Math.round(pfX + (pfW - gridW) / 2);
        const offsetY = Math.round(pfY + (pfH - gridH) / 2);

        this.grid = new Grid(this, COLS, ROWS, cellSize, offsetX, offsetY);

        this.spawnNewPiece();

        this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.shiftSFX = this.sound.add('shift');
        this.fallToGroundSFX = this.sound.add('fall');

        this.sound.pauseOnBlur = false;
        // Problem
        /*
        const existing = this.sound.get('bgm');
        if (existing) {
        if (!existing.isPlaying) existing.play({ loop: true, volume: 0.5 });
        this.bgm = existing;
        
        } else {
        //this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
        this.bgm.play();
        }
        */

  }

  update(time, delta) {
    this.abg?.update(delta);
    if (this.currentPiece) this.currentPiece.update(time, delta);
    if (Phaser.Input.Keyboard.JustDown(this.keyX) || Phaser.Input.Keyboard.JustDown(this.keyZ)) {
      this.currentPiece.shiftPosition();
      this.shiftSFX?.play({ volume: 0.7 });
    }
    // Control de movimiento lateral (mientras se mantiene pulsado)
      if(this.cursors.right.isDown){
          this.currentPiece.moveHotizontally(true);
      }
      if(this.cursors.left.isDown){
          this.currentPiece.moveHotizontally(false);
      }
  }

  spawnNewPiece() {
    if (this.currentPiece) {
        this.currentPiece.destroySprites(); 
    }
    this.currentPiece = new Piece(this, this.grid, 3);
  }
}

window.level1 = level1;
 