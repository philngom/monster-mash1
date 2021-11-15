import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    // this.load.image('ground', 'assets/ground.png')
    this.load.image('platform', 'assets/platform.png');
    this.load.image('bomb', 'assets/bomb.png');

    this.load.spritesheet('onion', 'assets/onion.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
  }
  create() {
    this.add.image(400, 300, 'sky');
    this.createPlatforms();
  }
  createPlatforms() {
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'platform').setScale(2).refreshBody();
    platforms.create(600, 400, 'platform');
    platforms.create(50, 250, 'platform');
    platforms.create(750, 220, 'platform');
  }
  createPlayer() {
    this.player = this.physics.add.sprite(100, 450, 'onion');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('onion', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'onion', frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('onion', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
