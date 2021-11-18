import Phaser from 'phaser';
import BombSpawner from './BombSpawner';
import ScoreLabel from './ScoreLabel.js';
import HitLabel from './HitScore.js';
// import MovingPlatform from './MovingPlatform'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');

    this.gameOver = false;
    this.scoreLabel = undefined;
  }

  preload() {
    this.load.image('sky', 'assets/lavaDungeon.jpg');
    this.load.image('monster', 'assets/eyeballZombie.png');
    // this.load.image('ground', 'assets/ground.png')
    this.load.image('platform-bottom', 'assets/brick-platform-bottom.png');
    this.load.image('platform', 'assets/brick-platform-400x.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('coin', 'assets/star.png');
    this.load.image('dungeon-door', 'assets/dungeon-door.png');

    this.load.spritesheet('onion', 'assets/onion.png', {
      frameWidth: 32,
      frameHeight: 48,
    });

    this.load.spritesheet('fire', 'assets/fireBullet.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    this.add.image(640, 400, 'sky');

    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    const coin = this.createCoin();
    const monster = this.createMonster();
    const door = this.createDoor();

    this.bombSpawner = new BombSpawner(this, 'fire');
    const bombGroup = this.bombSpawner.group;

    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.hitLabel = this.createHitLabel(16, 45, 3);

    // this.movingPlatform = new MovingPlatform(this, 500, 500, "platform", {
    //     isStatic: true
    // })
    // this.movingPlatform.moveHorizontally();

    //collision handling
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(bombGroup, platforms);
    this.physics.add.collider(this.player, bombGroup, this.hitBomb, null, this);
    this.physics.add.overlap(this.player, monster, this.hitBomb, null, this);
    this.physics.add.overlap(this.player, coin, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, door, this.safelyExit, null, this);
    this.physics.add.collider(coin, platforms);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: '32px', fill: '#fff' };
    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);
    return label;
  }

  createHitLabel(x, y, hit) {
    const style = { fontSize: '32px', fill: '#fff' };
    const label = new HitLabel(this, x, y, hit, style);

    this.add.existing(label);
    return label;
  }

  createMonster() {
    const monster = this.add.image(640, 50, 'monster').setInteractive();
    monster.input.hitArea.setTo(35, 30, 160, 130);

    return monster;
  }

  createDoor() {
    const door = this.physics.add.staticGroup();
    door.create(1230, 98, 'dungeon-door');

    return door;
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms.create(640, 785, 'platform-bottom');
    platforms.create(640, 635, 'platform');
    platforms.create(50, 540, 'platform');
    platforms.create(640, 440, 'platform');
    platforms.create(1230, 540, 'platform');
    platforms.create(50, 340, 'platform');
    platforms.create(640, 240, 'platform');
    platforms.create(1230, 340, 'platform');
    platforms.create(1230, 150, 'platform');

    return platforms;
  }

  createFireBall() {
    const fireBall = this.physics.add.sprite(100, 450, 'fire');
    fireBall.setBounce(1);
    fireBall.setCollideWorldBounds(true);
    fireBall.setVelocity(Phaser.Math.Between(-200, 200), 20);

    this.anims.create({
      frames: this.anims.generateFrameNumbers('fire', {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    return fireBall;
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 700, 'onion');
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('onion', {
        start: 0,
        end: 3,
      }),
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
      frames: this.anims.generateFrameNumbers('onion', {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }

  createCoin() {
    const coin = this.physics.add.staticGroup();

    // bottom stars
    coin.create(640, 756, 'coin');
    coin.create(1040, 756, 'coin');
    coin.create(240, 756, 'coin');

    // lower middle platform
    coin.create(640, 605, 'coin');
    coin.create(800, 605, 'coin');
    coin.create(480, 605, 'coin');

    // middle middle platform
    coin.create(640, 410, 'coin');
    coin.create(800, 410, 'coin');
    coin.create(480, 410, 'coin');

    // top middle platform
    coin.create(640, 210, 'coin');
    coin.create(800, 210, 'coin');
    coin.create(480, 210, 'coin');

    // lower left platform
    coin.create(40, 510, 'coin');
    coin.create(200, 510, 'coin');

    // upper left platform
    coin.create(40, 310, 'coin');
    coin.create(200, 310, 'coin');

    // upper right platform
    coin.create(1240, 310, 'coin');
    coin.create(1080, 310, 'coin');

    // lower right platform
    coin.create(1240, 510, 'coin');
    coin.create(1080, 510, 'coin');

    return coin;
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true);
    this.bombSpawner.spawn(player.x);
    this.scoreLabel.add(1337);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-265);
    }

    if (this.gameOver) {
      this.scene.restart();
      this.gameOver = false;
    }
  }

  createDialogue() {
    const dialogue = [
      "Failure isn't fatal, but failure to change might be",
      'Everything you want is on the other side of fear',
      "Success is most often achieved by those who don't know that failure is inevitable",
      'Only those who dare to fail greatly can ever achieve greatly',
      'The pheonix must burn to emerge',
      "If you're not prepared to be wrong, you'll never come up with anything original",
      'Giving up is the only sure way to fail',
      "If you don't try at anything, you can't fail...it takes back bone to lead the life you want",
      'Failure should be our teacher, not our undertaker. Failure is delay, not defeat. It is a temporary detour, not a deadd end. Failure is something we can avoid only by saying nothing, doing nothing, and being nothing',
      'When you take risks, you learn that there will be times when you succeed and there will be times when you fail, and both are equally important',
      "It's failure that gives you the proper perspective on success",
      'There is no failure except in no longer trying',
      "I have not failed. I've just found 10,000 ways that won't work.",
      'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    ];
    let index = Math.floor(Math.random() * dialogue.length);
    return dialogue[index];
  }

  hitBomb(player) {
    this.hitLabel.add(-1);
    console.log(this.hitLabel);
    if (this.hitLabel.hit === 0) {
      player.anims.play('turn');
      this.physics.pause();
      alert(this.createDialogue());
      this.gameOver = true;
    }
    if (this.hitLabel.hit === 2) {
      player.setTint(0xffff00);
    }
    if (this.hitLabel.hit === 1) {
      player.setTint(0xff0000);
    }
  }

  safelyExit(player) {
    this.physics.pause();
    player.setTint(0x00ff00);
    alert(`Congratulations, You Won! Your Score was ${this.scoreLabel.score}`);
    this.gameOver = true;
  }
}
