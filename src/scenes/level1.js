class level1 extends Phaser.Scene
{
    constructor()
    {
        super({key:'level1'});
    }

     preload() {
        this.load.setPath('assets/sprites/static');
        this.load.image('magenta', 'gem1.png');
        this.load.image('yellow', 'gem2.png');
        this.load.image('purple', 'gem3.png');
        this.load.image('orange', 'gem4.png');
        this.load.image('blue', 'gem5.png');
        this.load.image('green', 'gem6.png');

        this.load.setPath('assets/sounds/effects');
        this.load.audio('shift', 'shiftPosition.wav')
    }

    create()
    {
        this.grid = new Grid(this, 10, 12, 20, 140, 15);
        this.spawnNewPiece();

       

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.shiftSFX = this.sound.add('shift');
    }


    update(time, delta) {
        if (this.currentPiece) {
            this.currentPiece.update(time, delta);
        }

        if(Phaser.Input.Keyboard.JustDown(this.keyX)
        || Phaser.Input.Keyboard.JustDown(this.keyZ)){
            this.currentPiece.shiftPosition();
        }
    }
    
    
    spawnNewPiece() {
        this.currentPiece = new Piece(this, this.grid, 3);
    }

   

}
