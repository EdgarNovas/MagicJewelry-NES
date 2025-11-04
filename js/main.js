const gamePrefs = {
    gameWidth:960,
    gameHeight:540,
}

var config = {
    type:Phaser.AUTO,
    width:gamePrefs.gameWidth,
    height:gamePrefs.gameHeight,
    scene:[level1], //Array con las scenes/niveles
    render:{
        pixelArt:true
    },
    physics:
    {
        default:'arcade',
        arcade:{
            gravity:{y:gamePrefs.GRAVITY},
            debug:true
        }
    }, 
    scale:{
        mode:Phaser.Scale.FIT,
        autocenter:Phaser.Scale.CENTER_BOTH,
        width: gamePrefs.gameWidth/2,
        height: gamePrefs.gameHeight/2
    }   
}


var juego = new Phaser.Game(config)