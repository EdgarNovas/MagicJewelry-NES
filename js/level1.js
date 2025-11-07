// Escena mínima para que no rompa al cambiar desde el menú
class level1 extends Phaser.Scene {
  constructor() { super({ key: 'level1' }); }
  create() {
    const { width, height } = this.scale;
    this.add.text(width/2, height/2, 'LEVEL 1 (placeholder)', {
      fontFamily: 'monospace', fontSize: 24, color: '#ffffff'
    }).setOrigin(0.5);
  }
}
window.level1 = level1;
