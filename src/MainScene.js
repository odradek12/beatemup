import Enemy from './Enemy.js';
import Player from './Player.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.isPunching = false;
    }

    preload() {
        // Preload assets are already handled in the Preloader scene
    }

    create() {
        this.cameras.main.setBounds(0, 0, 800 * 2, 600 * 2);
        this.physics.world.setBounds(0, 0, 800 * 2, 600 * 2);

        this.add.image(0, 0, 'bg').setOrigin(0);
        this.add.image(800, 0, 'bg').setOrigin(0).setFlipX(true);
        this.add.image(0, 600, 'bg').setOrigin(0).setFlipY(true);
        this.add.image(800, 600, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);

        this.player = new Player(this, 100, 150, 'brawler');
        this.physics.add.existing(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.body.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('brawler', { frames: [0, 1, 2, 3] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('brawler', { frames: [5, 6, 7, 8] }),
            frameRate: 8,
            repeat: -1,
            repeatDelay: 200
        });

        this.anims.create({
            key: 'punch',
            frames: this.anims.generateFrameNumbers('brawler', { frames: [15, 16, 17, 18, 17, 15] }),
            frameRate: 8,
            repeat: 0
        });

        this.punchHitbox = this.physics.add.sprite(0, 0, 'null');
        this.punchHitbox.body.setSize(20, 20);
        this.punchHitbox.setVisible(false);

        this.enemy = new Enemy(this, 400, 200, 'enemy');
        this.physics.add.existing(this.enemy);

        this.physics.add.overlap(this.punchHitbox, this.enemy, this.handleHit, null, this);

        this.punchKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.player.on(Phaser.Animations.Events.ANIMATION_UPDATE, (anim, frame) => {
            if (anim.key === 'punch') {
                if (frame.index >= 2 && frame.index <= 4) {
                    this.positionHitbox();
                    this.punchHitbox.body.enable = true;
                } else {
                    this.punchHitbox.body.enable = false;
                }
            }
        }, this);

        this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim) => {
            if (anim.key === 'punch') {
                this.isPunching = false;
            }
        }, this);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.punchKey) && !this.isPunching) {
            this.player.setVelocity(0, 0);
            this.player.anims.play('punch', true);
            this.isPunching = true;
        }

        if (!this.isPunching) {
            this.updatePlayerMovement();
            this.updatePlayerAnimation();
        }
    }

    updatePlayerMovement() {
        this.player.setVelocity(0, 0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-500);
            this.player.setFlipX(false);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(500);
            this.player.setFlipX(true);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-500);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(500);
        }
    }

    updatePlayerAnimation() {
        if (!this.isPunching) {
            if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) {
                this.player.anims.play('walk', true);
            } else {
                this.player.anims.play('idle', true);
            }
        }
    }

    positionHitbox() {
        if (this.player.flipX) {
            this.punchHitbox.setPosition(this.player.x + 50, this.player.y + 15);
        } else {
            this.punchHitbox.setPosition(this.player.x - 50, this.player.y + 15);
        }
    }

    handleHit(hitbox, enemy) {
        enemy.setTint(0xff9999);
        this.time.delayedCall(1000, () => {
            enemy.clearTint();
            console.log("clear");
        }, [], this);
    }
}
