class Grid {

   constructor(scene, cols, rows, cellSize, offsetX = 0, offsetY = 0) {
        this.scene = scene;
        this.cols = cols;     
        this.rows = rows;     
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

        this.currentMatches = [];
        this.matchAnimCurrTime = 0;
        this.matchAnimFlashInterval = 100;
        this.matchAnimFlashCount = 4;
        this.matchAnimOriginalColor = null;
        this.matchAnimFlashesDone = 0;
        this.matchAnimColorChangeTime = 50;
        this.matchAnimCurrColorIndex = 1;
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
        this.cells[y][x] = color;
    }

    clearCell(x, y) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
        this.cells[y][x] = null;
    }

    isOccupied(x, y) {
        if (y < 0) return false; // arriba del tablero NO está ocupado
        if (y >= this.rows) return true; // fuera por abajo sí está ocupado (suelo)
        if (x < 0 || x >= this.cols) return true; // paredes laterales
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

        // Diagonal Descendente - de Izquierda a Derecha
        for (let y = 0; y < this.rows - 2; y++) {
            for (let x = 0; x < this.cols - 2; x++) {
                const c1 = this.cells[y][x];
                const c2 = this.cells[y+1][x+1];
                const c3 = this.cells[y+2][x+2];

                if (c1 && c1 === c2 && c2 === c3) {
                    matches.push({x: x, y: y});
                    matches.push({x: x+1, y: y+1});
                    matches.push({x: x+2, y: y+2});
                }
            }
        }

        // Diagonal Ascendente - de Derecha a Izquierda
        for (let y = 0; y < this.rows - 2; y++) {
            for (let x = 2; x < this.cols; x++) {
                const c1 = this.cells[y][x];
                const c2 = this.cells[y+1][x-1];
                const c3 = this.cells[y+2][x-2];

                if (c1 && c1 === c2 && c2 === c3) {
                    matches.push({x: x, y: y});
                    matches.push({x: x-1, y: y+1});
                    matches.push({x: x-2, y: y+2});
                }
            }
        }

        // Filtro para duplicados
        // Como las diagonales que pueden solaparse con horizontales o con ellas mismas
        const uniqueMatches = [];
        const seen = new Set();

        for (const m of matches) {
            const key = `${m.x},${m.y}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueMatches.push(m);
            }
        }

        return uniqueMatches;
    }
    
    clearMatches(matches) {
        this.deletedJewels = 0;
        for (const m of matches) {
            // Aseguramos que la celda tiene algo antes de contarla (por seguridad)
            if (this.cells[m.y][m.x] !== null) {
                this.cells[m.y][m.x] = null;
                this.deletedJewels++;
            }
        }
        console.log("Emitiendo evento");
        this.scene.game.events.emit('matches:cleared', this.deletedJewels);
        console.log("Evento finalizado");

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
        this.currentMatches = this.findMatches();
        console.log("Se han encontrado "+this.currentMatches+" matches");
        if (this.currentMatches.length === 0) return;

        this.startMatchesAnimation();
    }

    startMatchesAnimation() {
        this.scene.animatingMatches = true;
        this.matchAnimOriginalColor = this.cells[this.currentMatches[0].y][this.currentMatches[0].x]
        // sonido
    }

    animateMatches(delta) {
        this.matchAnimCurrTime += delta;

        let madeChanges = false;

        // Flashes iniciales
        if (this.matchAnimCurrTime < this.matchAnimFlashInterval)
        {
            console.log("Primera parte");
            for (const m of this.currentMatches) {
                if (this.isOccupied(m.x, m.y))
                {
                    console.log("Se clearean varias");
                    this.clearCell(m.x, m.y);
                    madeChanges = true;
                }
            }
        }
        else if (this.matchAnimCurrTime < this.matchAnimFlashInterval * 2)
        {
            console.log("Segunda parte");
            for (const m of this.currentMatches) {
                if (this.cells[m.y][m.x] != this.matchAnimOriginalColor)
                {
                    console.log("Se setean varias")
                    this.setCell(m.x, m.y, this.matchAnimOriginalColor);
                    madeChanges = true;
                }
            }
        }
        else if (this.matchAnimCurrTime < this.matchAnimFlashInterval * 3)
        {
            this.matchAnimFlashesDone++;
            if (this.matchAnimFlashesDone < this.matchAnimFlashCount)
                this.matchAnimCurrTime = 0;
        }

        // Cambios de color
        if (this.matchAnimCurrTime > this.matchAnimFlashInterval * this.matchAnimFlashCount * 3)
        {
            console.log("Empieza a cambiar colores");
            let realBaseTime = this.matchAnimFlashInterval * this.matchAnimFlashCount * 3; 
            let relativeTime = this.matchAnimCurrTime - this.matchAnimFlashInterval * this.matchAnimFlashCount * 3
            console.log("RElative time: "+relativeTime + "   colorchangetime "+this.matchAnimColorChangeTime);
            if (relativeTime > this.matchAnimColorChangeTime)
            {
                let currentColorShouldBe = this.matchAnimOriginalColor + this.matchAnimCurrColorIndex;
                if (currentColorShouldBe > 5)
                    currentColorShouldBe - 5;
                console.log("Entra en la condicion. Color should  be:"+currentColorShouldBe);

                for (const m of this.currentMatches) {
                    if (this.cells[m.y][m.x] != this.currentColorShouldBe)
                    {
                        this.setCell(m.x, m.y, this.currentColorShouldBe);
                        madeChanges = true;
                    }
                }

                if (madeChanges)
                {
                    this.matchAnimCurrColorIndex++;
                    if (this.matchAnimColorIndex == 0)
                        this.matchAnimCurrTime = 3000;
                    this.matchAnimCurrTime = realBaseTime;
                }
            }
        }

        if (madeChanges)
                this.redraw();

        if (this.matchAnimCurrTime >= 2000)
        {
            this.matchAnimCurrTime = 0;
            this.matchAnimFlashesDone = 0;
            this.matchAnimCurrColorIndex = 1;

            this.scene.animatingMatches = false;
            this.clearMatches(this.currentMatches);
            this.applyGravity();
            this.redraw();

            this.resolveMatches();
        }        
    }
    
    redraw() {
        console.log("Redibujando");
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