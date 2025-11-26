class Grid {

   constructor(scene, cols, rows, cellSize, offsetX = 0, offsetY = 0) {
        this.scene = scene;
        this.cols = cols;     // <---- CORREGIDO
        this.rows = rows;     // <---- CORREGIDO
        this.cellSize = cellSize;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.cells = [];
        for (let y = 0; y < this.rows; y++) {
            this.cells[y] = [];
            for (let x = 0; x < this.cols; x++) {
                this.cells[y][x] = null; // vacío
            }
        }

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
    setCell(x, y, color) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
        this.cells[y][x] = color;  // <---- CORREGIDO
    }

    clearCell(x, y) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
        this.cells[y][x] = null;
    }

    isOccupied(x, y) {
        if (y < 0) return false; // arriba del tablero NO está ocupado
        if (y >= this.rows) return true; // fuera por abajo sí está ocupado (suelo)
        return this.cells[y][x] !== null;
    }
    
   mergePiece(piece) {
        for (const g of piece.gems) {
            if (g.x >= 0 && g.x < this.cols && g.y >= 0 && g.y < this.rows) {
                this.cells[g.y][g.x] = g.color;
            }
        }
    }
    
    findMatches() {
    const matches = [];

    // Horizontal
    for (let y = 0; y < this.rows; y++) {
        let streak = 1;
        for (let x = 1; x < this.cols; x++) {
            const prev = this.cells[y][x-1];
            const curr = this.cells[y][x];

            if (curr && curr === prev) {
                streak++;
            } else {
                if (streak >= 3) {
                    for (let k = 0; k < streak; k++) {
                        matches.push({x: x-1-k, y});
                    }
                }
                streak = 1;
            }
        }

        if (streak >= 3) {
            for (let k = 0; k < streak; k++) {
                matches.push({x: this.cols-1-k, y});
            }
        }
    }

    // Vertical
    for (let x = 0; x < this.cols; x++) {
        let streak = 1;
        for (let y = 1; y < this.rows; y++) {
            const prev = this.cells[y-1][x];
            const curr = this.cells[y][x];

            if (curr && curr === prev) {
                streak++;
            } else {
                if (streak >= 3) {
                    for (let k = 0; k < streak; k++) {
                        matches.push({x, y: y-1-k});
                    }
                }
                streak = 1;
            }
        }

        if (streak >= 3) {
            for (let k = 0; k < streak; k++) {
                matches.push({x, y: this.rows-1-k});
            }
        }
    }

    return matches;
    }
    
    clearMatches(matches) {
        this.deletedJewels = 0;
        for (const m of matches) {
            this.cells[m.y][m.x] = null;
            this.deletedJewels++;
        }

        return this.deletedJewels;
    }
    
    applyGravity() {
        for (let x = 0; x < this.cols; x++) {
        let writeRow = this.rows - 1;

            for (let y = this.rows - 1; y >= 0; y--) {
                if (this.cells[y][x] !== null) {
                    const color = this.cells[y][x];
                    this.cells[y][x] = null;
                    this.cells[writeRow][x] = color;
                    writeRow--;
                }
            }
        }
    }
    
    resolveMatches() {
        let totalCleared = 0;

        while (true) {
            const matches = this.findMatches();
            if (matches.length === 0) break;

            this.clearMatches(matches);
            this.applyGravity();


            totalCleared += matches.length;
        }

        return totalCleared;
    }
    
    redraw() {
        // elimina sprites viejos
        if (!this.staticSprites) this.staticSprites = [];
        for (const s of this.staticSprites) s.destroy();
        this.staticSprites = [];

        // dibuja todo el tablero
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const color = this.cells[y][x];
                if (color) {
                    const img = this.scene.add.image(
                        this.offsetX + x * this.cellSize + this.cellSize / 2,
                        this.offsetY + y * this.cellSize + this.cellSize / 2,
                        color
                    );
                    img.setDisplaySize(this.cellSize, this.cellSize);
                    this.staticSprites.push(img);
                }
            }
        }
    }

    
}