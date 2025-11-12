class level1 extends Phaser.Scene
{
    constructor()
    {
        super({key:'level1'});
    }

     preload() {
        this.load.setPath('assets/sprites');
        this.load.image('red', 'gem1.png');
        this.load.image('green', 'gem2.png');
        this.load.image('blue', 'gem3.png');

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
