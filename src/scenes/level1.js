class level1 extends Phaser.Scene {
  constructor() { super({ key: 'level1' }); }

  preload() {
    // Gems
    this.load.setPath('assets/sprites/static');
    this.load.image('red',   'gem1.png');
    this.load.image('green', 'gem2.png');
    this.load.image('blue',  'gem3.png');

    // Background
    this.load.setPath('assets/sprites/backgrounds');
    this.load.image('background1', 'level1.png');

    // SFX
    this.load.setPath('assets/sounds/effects');
    this.load.audio('shift', 'shiftPosition.wav');
  }

  create() {
    const GW = this.scale.width;
    const GH = this.scale.height;

    // --- Mundo base NES ---
    const baseW = 256, baseH = 240;

    // ⬇️ Valores calibrados por ti
    const ZOOM   = 3;                 // zoom entero final
    const PF     = { left: 39, top: 14, width: 124, height: 212 }; // playfield en px del PNG
    const COLS   = 6;
    const ROWS   = 13;

    // Centrado del lienzo con ese zoom
    const marginX = Math.floor((GW - baseW * ZOOM) / 2);
    const marginY = Math.floor((GH - baseH * ZOOM) / 2);

    // Fondo
    this.add.image(marginX, marginY, 'background1')
      .setOrigin(0, 0)
      .setScale(ZOOM)
      .setDepth(-100);

    // PF escalado a pantalla
    const pfX = marginX + PF.left   * ZOOM;
    const pfY = marginY + PF.top    * ZOOM;
    const pfW = PF.width  * ZOOM;
    const pfH = PF.height * ZOOM;

    // Celdas cuadradas (con tu cellSize final 48)
    const cellSizeX = Math.floor(pfW / COLS);
    const cellSizeY = Math.floor(pfH / ROWS);
    const cellSize  = Math.min(cellSizeX, cellSizeY); // = 48 con tus números

    // Centrar el grid dentro del PF
    const gridW = cellSize * COLS;
    const gridH = cellSize * ROWS;
    const offsetX = Math.round(pfX + (pfW - gridW) / 2); // = 159 con tus números
    const offsetY = Math.round(pfY + (pfH - gridH) / 2); // = 48  con tus números

    // Crear Grid (6x13)
    this.grid = new Grid(this, COLS, ROWS, cellSize, offsetX, offsetY);

    // --- Tu lógica original ---
    this.spawnNewPiece();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    this.shiftSFX = this.sound.add('shift');
  }

  update(time, delta) {
    if (this.currentPiece) this.currentPiece.update(time, delta);

    if (Phaser.Input.Keyboard.JustDown(this.keyX) ||
        Phaser.Input.Keyboard.JustDown(this.keyZ)) {
      this.currentPiece.shiftPosition();
      this.shiftSFX?.play({ volume: 0.7 });
    }
  }

  spawnNewPiece() {
    this.currentPiece = new Piece(this, this.grid, 3);
  }
}
