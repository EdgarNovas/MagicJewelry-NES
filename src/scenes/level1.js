// js/level1.js
import { GAME_SIZE, GRID, BG_SKY, HUD_NUMBERS } from "../core/constants.js";
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
    this.load.spritesheet('orangeNumbers', 'orange_numbers_black.png', { frameWidth: 7, frameHeight: 7});
    this.load.spritesheet('greenNumbers', 'green_numbers_black.png', { frameWidth: 7, frameHeight: 7});
    this.load.spritesheet('blueNumbers', 'blue_numbers_black.png', { frameWidth: 7, frameHeight: 7});

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const GW = GAME_SIZE.WIDTH;
    const GH = GAME_SIZE.HEIGHT;

    this.baseW = GAME_SIZE.BASE_WIDTH; this.baseH = GAME_SIZE.BASE_HEIGHT;
    this.ZOOM = GAME_SIZE.SCALING_MULTIPLIER;
    this.PF = { left: GRID.PARENT_FIT.LEFT, top:  GRID.PARENT_FIT.TOP, width:  GRID.PARENT_FIT.WIDTH, height:  GRID.PARENT_FIT.HEIGHT };

    this.marginX = Math.floor((GW - this.baseW * this.ZOOM) / 2);
    this.marginY = Math.floor((GH - this.baseH * this.ZOOM) / 2);

    // Config por nivel
    this.LEVELS = [
      { bg: 'bg1', SKY: { left: BG_SKY.LEFT, top: BG_SKY.TOP, width:  BG_SKY.WIDTH, height: BG_SKY.HEIGHT } },
      { bg: 'bg2', SKY: { left: BG_SKY.LEFT, top: BG_SKY.TOP, width:  BG_SKY.WIDTH, height: BG_SKY.HEIGHT } },
      { bg: 'bg3', SKY: { left: BG_SKY.LEFT, top: BG_SKY.TOP, width:  BG_SKY.WIDTH, height: BG_SKY.HEIGHT } },
      { bg: 'bg4', SKY: { left: BG_SKY.LEFT, top: BG_SKY.TOP, width:  BG_SKY.WIDTH, height: BG_SKY.HEIGHT } },
      { bg: 'bg5', SKY: { left: BG_SKY.LEFT, top: BG_SKY.TOP, width:  BG_SKY.WIDTH, height: BG_SKY.HEIGHT } },
      { bg: 'bg6', SKY: { left: BG_SKY.LEFT, top: BG_SKY.TOP, width:  BG_SKY.WIDTH, height: BG_SKY.HEIGHT } },
      { bg: 'bg7', SKY: { left: BG_SKY.LEFT, top: BG_SKY.TOP, width:  BG_SKY.WIDTH, height: BG_SKY.HEIGHT } },
      { bg: 'bg8', SKY: { left: BG_SKY.LEFT, top: BG_SKY.TOP, width:  BG_SKY.WIDTH, height: BG_SKY.HEIGHT } },
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

    this.jewelryLevelSprites = [];
    
    // Posición donde quieres que aparezca
    const jewelryLevelX = HUD_NUMBERS.JEWELRY_X;
    const jewelryLevelY = HUD_NUMBERS.JEWELRY_Y;
    
    // Crear 5 dígitos para LEVEL (00000..99999)
    for (let i = 0; i < 5; i++) {
      const spr = this.add.sprite(jewelryLevelX + i * HUD_NUMBERS.NUMBERS_SEPARATION, jewelryLevelY, 'orangeNumbers', 0)
      .setOrigin(0, 0)
      .setScale(3)   // lo agrandamos para pixel-art
      .setDepth(50); // por encima del gameplay
      this.jewelryLevelSprites.push(spr);
    }
    
    this.levelNumberSprites = [];

    const levelNumberX = HUD_NUMBERS.LEVEL_X;
    const levelNumberY = HUD_NUMBERS.LEVEL_Y;

    for (let i = 0; i < 3; i++) {
      const spr = this.add.sprite(levelNumberX + i * HUD_NUMBERS.NUMBERS_SEPARATION, levelNumberY, 'greenNumbers', 0)
        .setOrigin(0, 0)
        .setScale(3)   // lo agrandamos para pixel-art
        .setDepth(50); // por encima del gameplay
      this.levelNumberSprites.push(spr);
    }

    this.scoreNumberSprites = [];

    const scoreNumberX = HUD_NUMBERS.SCORE_X;
    const scoreNumberY = HUD_NUMBERS.SCORE_Y;

    for (let i = 0; i < 7; i++) {
      const spr = this.add.sprite(scoreNumberX + i * HUD_NUMBERS.NUMBERS_SEPARATION, scoreNumberY, 'blueNumbers', 0)
        .setOrigin(0, 0)
        .setScale(3)   // lo agrandamos para pixel-art
        .setDepth(50); // por encima del gameplay
      this.scoreNumberSprites.push(spr);
    }
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
          this.gameOverAnimCol = GRID.COLUMNS - 1;
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

    // --- Actualizar los valores del Jewelry, level y score ---
    const jewelry = this.jewelryPoints.toString().padStart(5, '0');

    this.jewelryLevelSprites[0].setFrame(parseInt(jewelry[0]));
    this.jewelryLevelSprites[1].setFrame(parseInt(jewelry[1]));
    this.jewelryLevelSprites[2].setFrame(parseInt(jewelry[2]));
    this.jewelryLevelSprites[3].setFrame(parseInt(jewelry[3]));
    this.jewelryLevelSprites[4].setFrame(parseInt(jewelry[4]));

    const lvl = this.jewelryLevel.toString().padStart(3, '0');

    this.levelNumberSprites[0].setFrame(parseInt(lvl[0]));
    this.levelNumberSprites[1].setFrame(parseInt(lvl[1]));
    this.levelNumberSprites[2].setFrame(parseInt(lvl[2]));

    /*
    const score = this.score.toString().padStart(7, '0');

    this.scoreNumberSprites[0].setFrame(parseInt(score[0]));
    this.scoreNumberSprites[1].setFrame(parseInt(score[1]));
    this.scoreNumberSprites[2].setFrame(parseInt(score[2]));
    this.scoreNumberSprites[3].setFrame(parseInt(score[3]));
    this.scoreNumberSprites[4].setFrame(parseInt(score[4]));
    this.scoreNumberSprites[5].setFrame(parseInt(score[5]));
    this.scoreNumberSprites[6].setFrame(parseInt(score[6]));
    */
  }

  spawnNewPiece() {
    if (this.currentPiece) this.currentPiece.destroySprites();
    this.currentPiece = new Piece(this, this.grid, 3);
  }

  startGameover() {
    const GAMEOVER_TEXT_X = 62 * GAME_SIZE.SCALING_MULTIPLIER;
    const GAMEOVER_TEXT_Y = 57 * GAME_SIZE.SCALING_MULTIPLIER;
    this.gameoverText = this.add.sprite(GAMEOVER_TEXT_X, GAMEOVER_TEXT_Y, 'gameoverText')
      .setScale(3).setOrigin(0).setDepth(10);
    this.gameoverText.anims.play('gameoverTextFlash');
    this.gameOver = true;
  }
}