import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image('sky', '../../assets/sky.png')
    this.load.image('ground', '../../assets/ground.png')
    this.load.image('platform', '../../assets/platform.png')
    this.load.image('bomb', '../../assets/bomb.png')
  }
}

