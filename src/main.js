/// <reference path="./types/phaser.d.ts" />

import { buildConfig } from "./core/config.js";

import {Level1} from "./scenes/Level1.js";
import {MainMenu} from "./scenes/Mainmenu.js";

const game = new Phaser.Game
(
    buildConfig({
    scenes: [
      MainMenu, Level1
    ],
  })
);


/*const gamePrefs = {
  baseGameWidth: 256,
  baseGameHeight: 240,
  gameScalingMultiplier: 3,
  gameWidth: 768,
  gameHeight: 720,
  GRAVITY: 0 // pon lo que necesites
};*/

/*var config = {
  type: Phaser.AUTO,
  width: gamePrefs.baseGameWidth,
  height: gamePrefs.baseGameHeight,
  render: { pixelArt: true },
  
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: gamePrefs.baseGameWidth,
    height: gamePrefs.gameHeight
  },
  scene: [MainMenu, level1],
  
  audio: {
    disableWebAudio: true
  }
};*/

//var juego = new Phaser.Game(config);
