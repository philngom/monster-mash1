import Phaser from "phaser";
import BombSpawner from "./BombSpawner";
// import MovingPlatform from './MovingPlatform'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("game-scene");

        this.gameOver = false;
    }

    preload() {
        this.load.image("sky", "assets/lavaDungeon.jpg");
        // this.load.image('ground', 'assets/ground.png')
        this.load.image('platform-bottom', 'assets/brick-platform-bottom.png')
        this.load.image("platform", "assets/brick-platform-400x.png");
        this.load.image("bomb", "assets/bomb.png");
        this.load.image("coin", "assets/star.png");

        this.load.spritesheet("onion", "assets/onion.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
    }
    create() {
        this.add.image(640, 400, "sky");

        const platforms = this.createPlatforms();
        this.player = this.createPlayer();
        const coin = this.createCoin();

        this.bombSpawner = new BombSpawner(this, "bomb");
        const bombGroup = this.bombSpawner.group;

        // this.movingPlatform = new MovingPlatform(this, 500, 500, "platform", {
        //     isStatic: true
        // })
        // this.movingPlatform.moveHorizontally();

        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(bombGroup, platforms);
        this.physics.add.collider(this.player, bombGroup, this.hitBomb, null , this)
        this.physics.add.overlap(this.player, coin, this.collectCoin, null, this);
        this.physics.add.collider(coin, platforms)

        this.cursors = this.input.keyboard.createCursorKeys()

    }
    createPlatforms() {
        const platforms = this.physics.add.staticGroup();

        platforms.create(640, 785, "platform-bottom");
        platforms.create(640, 635, "platform");
        platforms.create(50, 540, "platform");
        platforms.create(640, 440, "platform");
        platforms.create(1230, 540, "platform");
        platforms.create(50, 340, "platform");
        platforms.create(640, 240, "platform");
        platforms.create(1230, 340, "platform");
        platforms.create(1230, 150, "platform");

        return platforms;
    }
    createPlayer() {
        const player = this.physics.add.sprite(100, 450, "onion");
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("onion", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "turn",
            frames: [{ key: "onion", frame: 4 }],
            frameRate: 20,
        });
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("onion", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });
        return player;
    }
    createCoin() {
        const coin = this.physics.add.group({key: 'coin', repeat: 6, setXY: {x: 12, y: 0, stepX: 100}})

        coin.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        })
        return coin;
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true)

        // if(this.coin.countActive(true) === 0) {
        //     this.coin.children.iterate((child) => {
        //         child.enableBody(true, child.x, 0, true, true);
        //     })
        // }
        this.bombSpawner.spawn(player.x);
    }

    update() {
        // setInterval(this.bombSpawner.spawn(), 500000000000);
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
            // this.bombSpawner.spawn(this.player.x);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-265);
        }
        if(this.gameOver){
          this.scene.restart();
          this.gameOver = false
        }

    }
    hitBomb(player){
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver = true;
    }
}
