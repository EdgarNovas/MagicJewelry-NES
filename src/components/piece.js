class Piece {
    constructor(scene, grid, x) {
        this.scene = scene;
        this.grid = grid;
        this.x = x;
        this.y = -3; // empieza arriba del tablero
        this.gems = [];

        const colors = ['magenta', 'yellow', 'purple',
        'orange', 'blue', 'green'];
        for (let i = 0; i < 3; i++) {
            var randomColor = Phaser.Math.Between(0, colors.length - 1);
            this.gems.push({ x: this.x, y: this.y + i, color: colors[randomColor] });
        }

        this.sprites = this.gems.map(gem => {
            const sprite = this.scene.add.image(0, 0, gem.color);
            sprite.setDisplaySize(this.grid.cellSize, this.grid.cellSize);
            return sprite;
        });

        this.dropTimer = 0;
        this.dropInterval = 500; // ms

        this.moveTimer = 0;
        this.moveInterval = 100;
    }

    update(time, delta) {
        this.dropTimer += delta;
        this.moveTimer += delta;

        if (this.dropTimer > this.dropInterval) {
            this.dropTimer = 0;
            this.moveDown();
        }

    // actualizar posiciones visuales + colores
    for (let i = 0; i < this.gems.length; i++) {
        const g = this.gems[i];

        // 🔥 IMPORTANTE - cambia textura según color actual
        this.sprites[i].setTexture(g.color);

        const posX = this.grid.offsetX + g.x * this.grid.cellSize + this.grid.cellSize / 2;
        const posY = this.grid.offsetY + g.y * this.grid.cellSize + this.grid.cellSize / 2;
        this.sprites[i].setPosition(posX, posY);
    }
}
    
    moveDown() {
        // comprobar colisión
        for (const g of this.gems) {
            if (g.y + 1 >= this.grid.rows || this.grid.isOccupied(g.x, g.y + 1)) {
                this.scene.fallToGroundSFX.play();
                this.grid.mergePiece(this);
                this.grid.resolveMatches();
                this.grid.redraw();
                this.scene.spawnNewPiece();
                return;
            }

            
        }
        // mover hacia abajo
        for (const g of this.gems) g.y++;
    }

    moveHotizontally(right) {
        if(this.moveTimer < this.moveInterval) return;
        this.moveTimer = 0;

        // comprobar colisión
        for (const g of this.gems) {
            if(right){
                if (this.grid.isOccupied(g.x + 1, g.y) || g.x + 1 >= this.grid.cols) {
                    
                    return;
                }
            }
            else{
                if (this.grid.isOccupied(g.x - 1, g.y) || g.x - 1 < 0) {
                    // se detiene
                    return;
                }
            }
        }
        for(const g of this.gems){
            if(right) g.x++;
            else g.x--;
        }
    }

    shiftPosition(){
        const first = this.gems.shift();
        this.gems.push(first)
        this.scene.shiftSFX.play();
    }
}
}