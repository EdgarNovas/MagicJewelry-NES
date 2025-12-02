/**
* Constantes globales del juego.
* No dependen de Phaser ni de instancias específicas.
* Son valores inmutables que describen el "mundo" del juego.
*/

export const GAME_SIZE = 
{
    BASE_WIDTH: 256,
    BASE_HEIGHT: 240,
    SCALING_MULTIPLIER: 3,
    WIDTH: 768,
    HEIGHT: 720
};

export const GRID = {
    COLUMNS: 6,
    ROWS: 13,
    PARENT_FIT:
    {
        LEFT: 39,
        TOP: 14,
        WIDTH: 124,
        HEIGHT: 212 
    }

}

export const BG_SKY = {
    LEFT: 170,
    TOP: 8,
    WIDTH: 78,
    HEIGHT: 224
}

export const PHYSICS = 
{
    TYPE:'arcade',
    GRAVITY: 0,
    DEBUG: true
};

export const RENDER = 
{
    PIXEL_ART: true
};

export const SCALE = 
{
    MODE: 'FIT',                // Phaser.Scale.FIT
    AUTO_CENTER: 'CENTER_BOTH', // Phaser.Scale.CENTER_BOTH
    ZOOM: 3                     //Para pixelart: escala lógica x3 sin deformar
}

export const PIECE =
{
    DROP_INTERVAL:
    {
        AUTOMATIC: 1000,        // ms
        FAST: 25,               // ms
        LVL_SUBTRACTION: 50  // ms
    }
}