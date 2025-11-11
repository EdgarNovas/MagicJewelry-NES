class Grid {

    constructor(scene, cols, rows, cellSize, offsetX = 0, offsetY = 0) {
        this.scene = scene;
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        // Crea la matriz lógica
        this.cells = [];
        for (let y = 0; y < rows; y++) {
            this.cells[y] = [];
            for (let x = 0; x < cols; x++) {
                this.cells[y][x] = 0; // 0 = vacío
            }
        }

        // Crea las celdas visuales (opcional)
        this.graphics = scene.add.graphics();
        this.drawGridLines();
    }

    drawGridLines() {
        const g = this.graphics;
        g.clear();
        g.lineStyle(1, 0x555555, 0.5);

        for (let x = 0; x <= this.cols; x++) {
            g.moveTo(this.offsetX + x * this.cellSize, this.offsetY);
            g.lineTo(this.offsetX + x * this.cellSize, this.offsetY + this.rows * this.cellSize);
        }

        for (let y = 0; y <= this.rows; y++) {
            g.moveTo(this.offsetX, this.offsetY + y * this.cellSize);
            g.lineTo(this.offsetX + this.cols * this.cellSize, this.offsetY + y * this.cellSize);
        }

        g.strokePath();
    }

    // Método para dibujar un bloque en una celda
    setCell(x, y, color = 0xff0000) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;

        this.cells[y][x] = 1;

        const rect = this.scene.add.rectangle(
            this.offsetX + x * this.cellSize + this.cellSize / 2,
            this.offsetY + y * this.cellSize + this.cellSize / 2,
            this.cellSize,
            this.cellSize,
            color
        );
        rect.setStrokeStyle(1, 0x000000);
    }

    clearCell(x, y) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
        this.cells[y][x] = 0;
    }

    isOccupied(x, y) {
        return this.cells[y]?.[x] === 1;
    }
    
    mergePiece(piece) {
        // Recorre las gemas de la pieza que acaba de aterrizar
        for (const g of piece.gems) {
            
            // Comprueba si la gema está dentro de los límites del tablero
            // (Esto evita errores si la pieza aterriza parcialmente fuera de la pantalla, por ejemplo)
            if (g.x >= 0 && g.x < this.cols && g.y >= 0 && g.y < this.rows) {
                
                // Marca la celda lógica como "ocupada"
                this.cells[g.y][g.x] = 1; 
            }
        }
    }
}