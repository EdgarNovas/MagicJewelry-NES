class test1 extends Phaser.Scene{
    constructor(){
        //LLamamos al constructor de la scene
        super({key:"test1"})
    }
    preload(){
       this.cameras.main.setBackgroundColor("666");
       this.load.setPath('assets/sprites');
       this.load.image('r', 'red.png');
       this.load.image('g', 'green.png');
       this.load.image('b', 'blue.png');
       
    }
    create(){        
        this.gems = [];
        this.gems.push(new gemsPrefab(this, 250, 50, 'r'));
        this.gems.push(new gemsPrefab(this, 250, 82, 'g'));
        this.gems.push(new gemsPrefab(this, 250, 114, 'b'));

        

        this.cursor = this.input.keyboard.createCursorKeys();
        this.key_x = this.input.keyboard.addKey("X");
        this.keyXPressed = false;
    }

    update(){ 
        if(this.key_x.isDown && !this.keyXPressed){
            console.log("Cambiando Posicion");
            this.keyXPressed = true;

            
        }
        if(this.key_x.isUp && this.keyXPressed){
            this.keyXPressed = false;
        }
    }

    loadAnimations(){
        
    }
}