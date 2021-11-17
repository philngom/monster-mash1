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
        this.load.image("monster", "assets/eyeballZombie.png");
        // this.load.image('ground', 'assets/ground.png')
        this.load.image("platform-bottom", "assets/brick-platform-bottom.png");
        this.load.image("platform", "assets/brick-platform-400x.png");
        this.load.image("bomb", "assets/bomb.png");
        this.load.image("coin", "assets/star.png");

        this.load.spritesheet("onion", "assets/onion.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
    }
    create() {
        // let monsterHitArea;
        this.add.image(640, 400, "sky");

        const platforms = this.createPlatforms();
        this.player = this.createPlayer();
        const coin = this.createCoin();
        const monster = this.createMonster();

        this.bombSpawner = new BombSpawner(this, "bomb");
        const bombGroup = this.bombSpawner.group;

        // this.movingPlatform = new MovingPlatform(this, 500, 500, "platform", {
        //     isStatic: true
        // })
        // this.movingPlatform.moveHorizontally();

        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(bombGroup, platforms);
        this.physics.add.collider(
            this.player,
            bombGroup,
            this.hitBomb,
            null,
            this
        );
        this.physics.add.overlap(
            this.player,
            monster,
            this.hitBomb,
            null,
            this
        );
        this.physics.add.overlap(
            this.player,
            coin,
            this.collectCoin,
            null,
            this
        );
        this.physics.add.collider(coin, platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        // monsterHitArea = this.add.rectangle(
        //     monster.x,
        //     monster.y,
        //     monster.width,
        //     monster.height,
        //     0x00ff00,
        //     0.5
        // );
    }

    createMonster() {
        const monster = this.add.image(640, 50, "monster").setInteractive();

        monster.input.hitArea.setTo(35, 30, 160, 130);
        // monster.create(640, 50, "monster");

        return monster;
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
        // const coin = this.physics.add.group({
        //     key: "coin",
        //     repeat: 6,
        //     setXY: { x: 12, y: 0, stepX: 100 },
        // });

        // coin.children.iterate((child) => {
        //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        // });
        const coin = this.physics.add.staticGroup();

        // bottom stars
        coin.create(640, 756, "coin");
        // coin.create(440, 756, "coin");
        // coin.create(840, 756, "coin");
        coin.create(1040, 756, "coin");
        coin.create(240, 756, "coin");

        // lower middle platform
        coin.create(640, 605, "coin");
        coin.create(800, 605, "coin");
        coin.create(480, 605, "coin");

        // middle middle platform
        coin.create(640, 410, "coin");
        coin.create(800, 410, "coin");
        coin.create(480, 410, "coin");

        // top middle platform
        coin.create(640, 210, "coin");
        coin.create(800, 210, "coin");
        coin.create(480, 210, "coin");

        // lower left platform
        coin.create(40, 510, "coin");
        coin.create(200, 510, "coin");

        // upper left platform
        coin.create(40, 310, "coin");
        coin.create(200, 310, "coin");

        // upper right platform
        coin.create(1240, 310, "coin");
        coin.create(1080, 310, "coin");

        // lower right platform
        coin.create(1240, 510, "coin");
        coin.create(1080, 510, "coin");
        return coin;
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true);

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
        if (this.gameOver) {
            this.scene.restart();
            this.gameOver = false;
        }
    }
    hitBomb(player) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play("turn");
        this.gameOver = true;
    }
}
