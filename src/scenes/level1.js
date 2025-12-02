// js/level1.js
import { GAME_SIZE, GRID } from "../core/constants.js";
import { Grid } from "../components/grid.js";
import { Piece } from "../components/piece.js";
import { AnimatedBackground } from "../components/animatedBackground.js";

export class Level1 extends Phaser.Scene {
  constructor() { super({ key: 'level1' }); }

  preload() {
    this.load.setPath('assets/sprites/static');
    this.load.image('magenta', 'gem1.png');
    this.load.image('yellow',  'gem2.png');
    this.load.image('purple',  'gem3.png');
    this.load.image('orange',  'gem4.png');
    this.load.image('blue',    'gem5.png');
    this.load.image('green',   'gem6.png');
    this.load.image('cross',   'xblock1.png');

    this.load.setPath('assets/sounds/effects');
    this.load.audio('shift',    'shiftPosition.wav');
    this.load.audio('fall',     'fallToGround.wav');
    this.load.audio('gameOver', 'gameOverSweep.wav');

    this.load.setPath('assets/sprites/backgrounds');
    this.load.image('bg1', 'bg1.png');
    this.load.image('bg2', 'bg2.png');
    this.load.image('bg3', 'bg3.png');
    this.load.image('bg4', 'bg4.png');
    this.load.image('bg5', 'bg5.png');
    this.load.image('bg6', 'bg6.png');
    this.load.image('bg7', 'bg7.png');
    this.load.image('bg8', 'bg8.png');


    this.load.setPath('assets/sprites/spritesheets');
    this.load.spritesheet('stars', 'stars.png', { frameWidth: 4, frameHeight: 3 });

    this.load.setPath('assets/sprites/static');
    this.load.image('moon', 'moon.png');

    this.load.setPath('assets/sprites/ui');
    this.load.spritesheet('gameoverText', 'gameover_text_1.png', { frameWidth:80, frameHeight:8 });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const GW = GAME_SIZE.WIDTH;
    const GH = GAME_SIZE.HEIGHT;

    this.baseW = GAME_SIZE.BASE_WIDTH; this.baseH = GAME_SIZE.HEIGHT;
    this.ZOOM = GAME_SIZE.SCALING_MULTIPLIER;
    this.PF = { left: GRID.PARENT_FIT.LEFT, top:  GRID.PARENT_FIT.TOP, width:  GRID.PARENT_FIT.WIDTH, height:  GRID.PARENT_FIT.HEIGHT };

    this.marginX = Math.floor((GW - this.baseW * this.ZOOM) / 2);
    this.marginY = Math.floor((GH - this.baseH * this.ZOOM) / 2);

    // Config por nivel
    this.LEVELS = [
      { bg: 'bg1', SKY: { left: GRID.PARENT_FIT.LEFT, top: GRID.PARENT_FIT.TOP, width:  GRID.PARENT_FIT.WIDTH, height: GRID.PARENT_FIT.HEIGHT } },
      { bg: 'bg2', SKY: { left: GRID.PARENT_FIT.LEFT, top: GRID.PARENT_FIT.TOP, width:  GRID.PARENT_FIT.WIDTH, height: GRID.PARENT_FIT.HEIGHT } },
      { bg: 'bg3', SKY: { left: GRID.PARENT_FIT.LEFT, top: GRID.PARENT_FIT.TOP, width:  GRID.PARENT_FIT.WIDTH, height: GRID.PARENT_FIT.HEIGHT } },
      { bg: 'bg4', SKY: { left: GRID.PARENT_FIT.LEFT, top: GRID.PARENT_FIT.TOP, width:  GRID.PARENT_FIT.WIDTH, height: GRID.PARENT_FIT.HEIGHT } },
      { bg: 'bg5', SKY: { left: GRID.PARENT_FIT.LEFT, top: GRID.PARENT_FIT.TOP, width:  GRID.PARENT_FIT.WIDTH, height: GRID.PARENT_FIT.HEIGHT } },
      { bg: 'bg6', SKY: { left: GRID.PARENT_FIT.LEFT, top: GRID.PARENT_FIT.TOP, width:  GRID.PARENT_FIT.WIDTH, height: GRID.PARENT_FIT.HEIGHT } },
      { bg: 'bg7', SKY: { left: GRID.PARENT_FIT.LEFT, top: GRID.PARENT_FIT.TOP, width:  GRID.PARENT_FIT.WIDTH, height: GRID.PARENT_FIT.HEIGHT } },
      { bg: 'bg8', SKY: { left: GRID.PARENT_FIT.LEFT, top: GRID.PARENT_FIT.TOP, width:  GRID.PARENT_FIT.WIDTH, height: GRID.PARENT_FIT.HEIGHT } },
    ];

    const pfX = this.marginX + this.PF.left * this.ZOOM;
    const pfY = this.marginY + this.PF.top  * this.ZOOM;
    const pfW = this.PF.width  * this.ZOOM;
    const pfH = this.PF.height * this.ZOOM;

    const cellSizeX = Math.floor(pfW / GRID.COLUMNS);
    const cellSizeY = Math.floor(pfH / GRID.ROWS);
    const cellSize  = Math.min(cellSizeX, cellSizeY);

    const gridW = cellSize * GRID.COLUMNS;
    const gridH = cellSize * GRID.ROWS;
    const offsetX = Math.round(pfX + (pfW - gridW) / 2);
    const offsetY = Math.round(pfY + (pfH - gridH) / 2);

    this.grid = new Grid(this, GRID.COLUMNS, GRID.ROWS, cellSize, offsetX, offsetY);

    const starsTex = this.textures.get('stars');
    const frames = starsTex && starsTex.frameTotal >= 4 ? [0,1,2,3] : [0];

    this.jewelryLevel = 0;
    this.jewelryPoints = 0;
    this._currentBgLevel = -1;

    this.setupBackgroundByLevel(this.jewelryLevel, frames);

    this.spawnNewPiece();

    this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    this.shiftSFX = this.sound.add('shift');
    this.fallToGroundSFX = this.sound.add('fall');
    this.gameOverSweepSFX = this.sound.add('gameOver');

    this.sound.pauseOnBlur = false;

    this.cursors.down.on('down', () => { this.currentPiece.accelerateMovement(true); });
    this.cursors.down.on('up',   () => { this.currentPiece.accelerateMovement(false); });

    this.gameOver = false;

    this.input.keyboard.on('keydown-ENTER', () => {
      if (this.gameOver) this.scene.start('MainMenu');
    });

    this.gameOverAnimRow = GRID.ROWS - 1;
    this.gameOverAnimCol = GRID.COLUMNS - 1;
    this.gameOverAnimTime = 40;
    this.gameOverAnimTimer = 0;

    this.anims.create({
      key: 'gameoverTextFlash',
      frames: this.anims.generateFrameNumbers('gameoverText', { start:0, end:1 }),
      frameRate: 1.5,
      repeat: -1
    });
  }

  setupBackgroundByLevel(level, starFrames) {
    const idx = Math.min(level, this.LEVELS.length - 1);
    const cfg = this.LEVELS[idx];
    const bgKey = this.textures.exists(cfg.bg) ? cfg.bg : 'bg1';

    const skyRect = new Phaser.Geom.Rectangle(
      this.marginX + cfg.SKY.left * this.ZOOM,
      this.marginY + cfg.SKY.top  * this.ZOOM,
      cfg.SKY.width  * this.ZOOM,
      cfg.SKY.height * this.ZOOM
    );

    if (!this.abg) {
      this.abg = new AnimatedBackground(this, skyRect, {
        starKey: 'stars',
        starFrames: starFrames,
        starCount: 90,
        speedMin: 6,
        speedMax: 14,
        starScale: 0.8,
        moonKey: 'moon',
        moonSpeed: 10,
        moonScale: 1.0,
        depth: -120,
        useMask: true
      });
    } else {
      this.abg.setArea(skyRect);
    }

    if (!this.bgImage) {
      this.bgImage = this.add.image(this.marginX, this.marginY, bgKey)
        .setOrigin(0,0)
        .setScale(this.ZOOM)
        .setDepth(-100);
    } else {
      this.bgImage.setTexture(bgKey);
    }

    this._currentBgLevel = level;
  }

  update(time, delta) {
    this.abg?.update(delta);

    if (this.gameOver) {
      this.gameOverAnimTimer += delta;
      if (this.gameOverAnimTimer >= this.gameOverAnimTime) {
        this.gameOverAnimTimer = 0;
        this.grid.setCell(this.gameOverAnimCol, this.gameOverAnimRow, 'cross');
        this.grid.redraw();
        this.gameOverAnimCol--;
        if (this.gameOverAnimCol < 0 && this.gameOverAnimRow > 0) {
          this.gameOverSweepSFX.play();
          this.gameOverAnimCol = GRID.COLS - 1;
          this.gameOverAnimRow--;
        }
      }
    } else {
      if (this.currentPiece) this.currentPiece.update(time, delta);
      if (Phaser.Input.Keyboard.JustDown(this.keyX) || Phaser.Input.Keyboard.JustDown(this.keyZ)) {
        this.currentPiece.shiftPosition();
        this.shiftSFX?.play({ volume: 0.7 });
      }
      if (this.cursors.right.isDown) this.currentPiece.moveHorizontally(true);
      if (this.cursors.left.isDown)  this.currentPiece.moveHorizontally(false);
    }

    const newLevel = Math.floor(this.jewelryPoints / 10);
    if (newLevel !== this._currentBgLevel) {
      const starsTex = this.textures.get('stars');
      const frames = starsTex && starsTex.frameTotal >= 4 ? [0,1,2,3] : [0];
      this.setupBackgroundByLevel(newLevel, frames);
    }

    this.jewelryLevel = newLevel;
  }

  spawnNewPiece() {
    if (this.currentPiece) this.currentPiece.destroySprites();
    this.currentPiece = new Piece(this, this.grid, 3);
  }

  startGameover() {
    const GAMEOVER_TEXT_X = 62 * gamePrefs.gameScalingMultiplier;
    const GAMEOVER_TEXT_Y = 57 * gamePrefs.gameScalingMultiplier;
    this.gameoverText = this.add.sprite(GAMEOVER_TEXT_X, GAMEOVER_TEXT_Y, 'gameoverText')
      .setScale(3).setOrigin(0).setDepth(10);
    this.gameoverText.anims.play('gameoverTextFlash');
    this.gameOver = true;
  }
}