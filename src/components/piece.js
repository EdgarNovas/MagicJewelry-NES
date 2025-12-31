import { PIECE } from "../core/constants.js";
import { getJewelryLevel } from "../core/scoreSystem.js";

export class Piece {
    constructor(scene, grid, x) {
        this.scene = scene;
        this.grid = grid;
        this.x = x;
        this.y = -PIECE.NUM_OF_GEMS; // empieza arriba del tablero
        this.gems = [];
        this.alive = true;

        const colors = ['magenta', 'yellow', 'purple',
        'orange', 'blue', 'green', 'cross'];
        for (let i = 0; i < PIECE.NUM_OF_GEMS; i++) {
            var randomColor = Phaser.Math.Between(0, colors.length - 2);
            this.gems.push({ x: this.x, y: this.y + i, color: colors[randomColor] });
        }

        this.sprites = this.gems.map(gem => {
            const sprite = this.scene.add.image(0, 0, gem.color);
            sprite.setDisplaySize(this.grid.cellSize, this.grid.cellSize);
            return sprite;
        });

        this.dropTimer = 0;
        
        this.dropInterval = PIECE.DROP_INTERVAL.AUTOMATIC - getJewelryLevel() * PIECE.DROP_INTERVAL.LVL_SUBTRACTION;

        if (this.dropInterval < PIECE.DROP_INTERVAL.FAST)
            this.dropInterval = PIECE.DROP_INTERVAL.FAST;

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
        
        if(!this.alive) return;
        // actualizar posiciones visuales + colores
        for (let i = 0; i < this.gems.length; i++) {
            const g = this.gems[i];
            this.sprites[i].setTexture(g.color);

            const posX = this.grid.offsetX + g.x * this.grid.cellSize + this.grid.cellSize / 2;
            const posY = this.grid.offsetY + g.y * this.grid.cellSize + this.grid.cellSize / 2;
            this.sprites[i].setPosition(posX, posY);
        }
    }
    
    moveDown() {
        if (!this.alive) return;

        // comprobar colisión
        const g = this.gems[2];
        if (g.y + 1 >= this.grid.rows || this.grid.isOccupied(g.x, g.y + 1)) {
            this.scene.fallToGroundSFX.play(); // Problem
            
            this.grid.mergePiece(this);
            this.grid.resolveMatches();
            this.grid.redraw();
            this.alive = false;

            for (const g of this.gems) {
                if (g.y == 0)
                {
                    this.scene.startGameover();
                    return;
                }
            }

            this.scene.spawnNewPiece();

            return;
        }         

        // mover hacia abajo
        for (const g of this.gems) g.y++;
    }
    
    destroySprites() {
        this.sprites.forEach(sprite => sprite.destroy());
        this.sprites = [];
    }


    moveHorizontally(right) {
        if(this.moveTimer < this.moveInterval || !this.alive) return;
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

    accelerateMovement(accelerate) {
        if (accelerate) {
            this.dropInterval = PIECE.DROP_INTERVAL.FAST;
        } else {
            this.dropInterval = PIECE.DROP_INTERVAL.AUTOMATIC - getJewelryLevel() * PIECE.DROP_INTERVAL.LVL_SUBTRACTION;
            if (this.dropInterval < PIECE.DROP_INTERVAL.FAST) this.dropInterval = PIECE.DROP_INTERVAL.FAST;
        }

        console.log(this.dropInterval);
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