const gamePrefs = {
  gameWidth: 960,
  gameHeight: 540,
  GRAVITY: 0 // pon lo que necesites
};

var config = {
  type: Phaser.AUTO,
  width: gamePrefs.gameWidth,
  height: gamePrefs.gameHeight,
  render: { pixelArt: true },
  
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: gamePrefs.gameWidth/2,
    height: gamePrefs.gameHeight/2
  },
  scene: [MainMenu, level1] 
};

var juego = new Phaser.Game(config);
