import Phaser from "phaser";
import BombSpawner from "./BombSpawner";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("game-scene");
    }

    preload() {
        this.load.image("sky", "assets/sky.png");
        // this.load.image('ground', 'assets/ground.png')
        this.load.image("platform", "assets/platform.png");
        this.load.image("bomb", "assets/bomb.png");

        this.load.spritesheet("onion", "assets/onion.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
    }
    create() {
        this.add.image(400, 300, "sky");
        const platforms = this.createPlatforms();
        this.player = this.createPlayer();
        this.bombSpawner = new BombSpawner(this, "bomb");
        const bombGroup = this.bombSpawner.group;
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(bombGroup, platforms);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.time.addEvent({
            delay: 3000,
            callback: this.bombSpawner.spawn(),
            callbackScope: this,
            loop: true,
        });
    }
    createPlatforms() {
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, "platform").setScale(2).refreshBody();
        platforms.create(600, 400, "platform");
        platforms.create(50, 250, "platform");
        platforms.create(750, 220, "platform");
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
            this.player.setVelocityY(-330);
        }
    }
}
