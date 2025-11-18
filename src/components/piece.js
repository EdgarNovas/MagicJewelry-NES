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

 shiftPosition() {
    // Rota solo los colores
    const firstColor = this.gems[0].color;
    this.gems[0].color = this.gems[1].color;
    this.gems[1].color = this.gems[2].color;
    this.gems[2].color = firstColor;

    this.scene.shiftSFX.play();
}
}