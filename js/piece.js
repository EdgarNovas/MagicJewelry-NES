class Piece {
    constructor(scene, grid, x) {
        this.scene = scene;
        this.grid = grid;
        this.x = x;
        this.y = -3; // empieza arriba del tablero
        this.gems = [];

        const colors = Phaser.Utils.Array.Shuffle(['red', 'green', 'blue']);
        for (let i = 0; i < 3; i++) {
            this.gems.push({ x: this.x, y: this.y + i, color: colors[i] });
        }

        this.sprites = this.gems.map(gem => {
            const sprite = this.scene.add.image(0, 0, gem.color);
            sprite.setDisplaySize(this.grid.cellSize, this.grid.cellSize);
            return sprite;
        });

        this.dropTimer = 0;
        this.dropInterval = 500; // ms
    }

    update(time, delta) {
        this.dropTimer += delta;
        if (this.dropTimer > this.dropInterval) {
            this.dropTimer = 0;
            this.moveDown();
        }

        // actualizar posiciones visuales
        for (let i = 0; i < this.gems.length; i++) {
            const g = this.gems[i];
            const posX = this.grid.offsetX + g.x * this.grid.cellSize + this.grid.cellSize / 2;
            const posY = this.grid.offsetY + g.y * this.grid.cellSize + this.grid.cellSize / 2;
            this.sprites[i].setPosition(posX, posY);
        }
    } 
    
    moveDown() {
        // comprobar colisión
        for (const g of this.gems) {
            if (this.grid.isOccupied(g.x, g.y + 1) || g.y + 1 >= this.grid.rows) {
                // se detiene
                this.grid.mergePiece(this);
                this.scene.spawnNewPiece();
                return;
            }
        }
        // mover hacia abajo
        for (const g of this.gems) g.y++;
    }
}