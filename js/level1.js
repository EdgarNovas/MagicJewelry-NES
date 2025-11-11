class level1 extends Phaser.Scene
{
    constructor()
    {
        super({key:'level1'});
    }

    preload()
    {
        this.cameras.main.setBackgroundColor("777");
        this.load.setPath('images');
        this.load.image('square', 'SquareTransparent.png');

        //Cargar el mapa
        /*
      
        this.load.spritesheet('enemy', 'jumper.png',
        { frameWidth:32,frameHeight:32  });

        */

    }

    create()
    {
        this.grid = new Grid(this, 10, 20, 32, 100, 50);
        



        //this.add.tileSprite(0,0,gamePrefs.gameWidth,gamePrefs.gameHeight,'bg').setOrigin(0);
/*
        this.map = this.add.tilemap('level1');
        this.map.addTilesetImage('tileset_walls');
        this.map.addTilesetImage('tileset_moss');
        //Pinto capas del mapa
        this.walls = this.map.createLayer('layer_walls','tileset_walls');
        this.map.createLayer('layer_moss','tileset_moss');

        //Defino con que  colisiona la layer_walls
        //this.map.setCollisionBetween(1,11,true,true,'layer_walls');
        //Phaser lo interpreta el -1 como 0 en el JSON
        this.map.setCollisionByExclusion(-1,true,true,'layer_walls');
        this.entry = this.add.sprite(65,268,'entry');
        this.hero = this.physics.add.sprite(65,100,'hero');

        this.enemy = new enemy(this,250,268);

        
        //this.entry.body.setAllowGravity(false);
        //this.entry.body.setImmovable(true);

        //this.physics.add.collider(this.hero, this.entry);
        this.physics.add.collider(this.hero, this.walls);



        
        this.loadAnimations();

        this.cameras.main.startFollow(this.hero);
        this.cameras.main.setBounds(0,0,gamePrefs.levelWidth,gamePrefs.levelHeight);
        */

        this.cursors = this.input.keyboard.createCursorKeys();
    }


    update()
    {
        if(this.cursors.left.isDown)
        {


        }
        else if(this.cursors.right.isDown) 
        {

            
        }


        if(this.cursors.space.isDown)
        {

        }

 


        
    }


    loadAnimations()
    {
        this.anims.create
        ({
            key:'run',
            frames: this.anims.generateFrameNumbers('hero', {start:2,end:5}),
            framerate:10,
            repeat: -1,
            yoyo:false,

        });

        this.anims.create
        ({
            key:'enemyrun',
            frames: this.anims.generateFrameNumbers('enemy', {start:0,end:3}),
            framerate:10,
            repeat: -1,
            yoyo:false,

        });
    }


}
