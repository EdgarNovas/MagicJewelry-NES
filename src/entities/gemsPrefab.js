class gemsPrefab extends Phaser.GameObjects.Sprite{
    constructor(_scene, _posX, _posY, _spriteTag='gem'){
        super(_scene, _posX, _posY, _spriteTag);
        _scene.add.existing(this);  
        _scene.physics.world.enable(this);
        this.scene = _scene;
        this.gem = this;
        //this.setColliders();
    }
}