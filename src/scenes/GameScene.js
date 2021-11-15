import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png')
    // this.load.image('ground', 'assets/ground.png')
    this.load.image('platform', 'assets/platform.png')
    this.load.image('bomb', 'assets/bomb.png')

    this.load.spritesheet('onion', 'assets/onion.png', {
      frameWidth: 32 , frameHeight: 48
    })
  }
  create() {
    this.add.image(400, 300, 'sky')
    this.createPlatforms()
    
  }
  createPlatforms() {
    const platforms = this.physics.add.staticGroup()
    platforms.create(400, 568, 'platform').setScale(2).refreshBody()
    platforms.create(600, 400, 'platform') 
    platforms.create(50, 250, 'platform') 
    platforms.create(750, 220, 'platform') 
  
}
}

