class LevelGame extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelGame' });
    }

    preload() {
        this.load.setPath('/assets/sprites/static');
        this.load.image('red', 'Red.png');
        this.load.image('green', 'Green.png');
        this.load.image('blue', 'Blue.png');
    }

    create() {
        this.grid = new Grid(this, 7, 16, 32, 200, 50);
        this.spawnNewPiece();
    }

    spawnNewPiece() {
        this.currentPiece = new Piece(this, this.grid, 3);
    }

    update(time, delta) {
        if (this.currentPiece) {
            this.currentPiece.update(time, delta);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    backgroundColor: '#222',
    scene: [Level1]
};

new Phaser.Game(config);