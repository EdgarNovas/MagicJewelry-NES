import { PIECE } from "../core/constants.js";

export default class MatchAnimator
{
    constructor(grid, scene) {
        this.grid = grid;
        this.scene = scene;

        this.phases = {
            INACTIVE: 'inactive',
            FLASHING: 'flash',
            CHANGING_COLORS: 'colorChange',
            ENDING: 'end'
        };

        this.phase = this.phases.NOT;

        this.matches = [];

        this.currTime = 0;
        this.flashInterval = 100;
        this.flashCount = 4;
        this.flashesDone = 0;

        this.originalColor = null;

        this.colorChangeInterval = 50;
        this.colorChangesCount = 9;

        this.currColorIndex = 1;
    }

    start(matches) {
        this.matches = matches;
        this.originalColor = this.grid.cells[matches[0].y][matches[0].x];

        this.phase = this.phases.FLASHING;

        this.currTime = 0;
        this.flashesDone = 0;
        this.currColorIndex = 1;

        this.scene.animatingMatches = true;
    }

    update(delta) {
        if (this.phase === this.phases.INACTIVE) return false;

        this.currTime += delta;
        let changed = false;

        switch (this.phase) {

            case this.phases.FLASHING:
                changed = this.doFlashing();
                break;

            case this.phases.CHANGING_COLORS:
                changed = this.doColorChange();
                break;

            case this.phases.ENDING:
                this.finish();
                changed = true;
                break;
        }

        if (changed) this.grid.redraw();
        return changed;
    }

    doFlashing() {
        
        let changed = false;
        if (this.currTime < this.flashInterval) {
            const firstGem = this.matches[0];
            if (this.grid.isOccupied(firstGem.x, firstGem.y))
            {
                changed = true;
                for (const g of this.matches)
                    this.grid.clearCell(m.x, m.y);
            }
        } else if (this.currTime < this.flashInterval * 2) {
            const firstGem = this.matches[0];
            if (!this.grid.isOccupied(firstGem.x, firstGem.y))
            {
                changed = true;
                for (const m of this.matches)
                    this.grid.setCell(m.x, m.y, this.originalColor);
            }
        } else {
            this.flashesDone++;
            this.currTime = 0;

            if (this.flashesDone >= this.flashCount)
                this.phase = this.phases.CHANGING;
        }

        return changed;
    }

    doColorChange() {

        if (this.currColorIndex >= this.colorChangesCount + 2) {
            this.phase = this.phases.ENDING;
            return false;
        }

        if (this.currTime < this.colorChangeInterval) return false;

        const colors = PIECE.COLORS;
        // Buscar índice del color original
        const originalIndex = colors.indexOf(this.originalColor);
        let newIndex = (originalIndex + this.currColorIndex) % 6; //El 6 habría que cambiarlo por const
        let newColor = colors[newIndex];

        let changed = false;
        const firstGem = this.matches[0];
        if (this.grid.cells[firstGem.y][firstGem.x] != newColor)
        {
            for (const m of this.matches)
                this.grid.setCell(m.x, m.y, newColor);

            changed = true;
            this.currColorIndex++;
            this.currTime = 0;
        }

        return changed;
    }

    finish() {
        this.phase = this.phases.INACTIVE;

        this.scene.animatingMatches = false;

        this.grid.clearMatches(this.matches);
        this.grid.applyGravity();
        this.grid.redraw();
        this.grid.resolveMatches();
    }
}