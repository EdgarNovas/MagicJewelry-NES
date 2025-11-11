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
    }

    create()
    {
        this.grid = new Grid(this, 10, 12, 20, 140, 15);
        this.spawnNewPiece();

       

        this.cursors = this.input.keyboard.createCursorKeys();
    }


    update(time, delta) {
        if (this.currentPiece) {
            this.currentPiece.update(time, delta);
        }
    }
    
    
    spawnNewPiece() {
        this.currentPiece = new Piece(this, this.grid, 3);
    }

   

}
