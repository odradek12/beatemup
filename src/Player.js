export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'knight', 'idle/frame0000');  // Use the first frame of the idle animation as default
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.body.setCollideWorldBounds(true);

        this.isAttacking = false;

        this.scene = scene;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.createAnimations();

        this.setScale(2);
    }

    static preload(scene) {
        // Preloading is now handled in Preloader.js
    }

    update() {
        if (!this.isAttacking) {
            this.updatePlayerMovement();
            this.updatePlayerAnimation();
        }
    }

    createAnimations() {
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNames('knight', {
                prefix: 'run/frame',
                start: 0,
                end: 7,
                zeroPad: 4
            }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('knight', {
                prefix: 'idle/frame',
                start: 0,
                end: 3,
                zeroPad: 4
            }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'attack',
            frames: this.scene.anims.generateFrameNames('knight', {
                prefix: 'attack_A/frame',
                start: 4,
                end: 9,
                zeroPad: 4
            }),
            frameRate: 8,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'attack2',
            frames: this.scene.anims.generateFrameNames('knight', {
                prefix: 'attack_B/frame',
                start: 0,
                end: 9,
                zeroPad: 4
            }),
            frameRate: 8,
            repeat: 0
        });
    }

    updatePlayerMovement() {
        this.setVelocity(0, 0);

        if (this.cursors.left.isDown) {
            this.setVelocityX(-500);
            this.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(500);
            this.setFlipX(false);
        }

        if (this.cursors.up.isDown) {
            this.setVelocityY(-500);
        } else if (this.cursors.down.isDown) {
            this.setVelocityY(500);
        }
    }

    updatePlayerAnimation() {
        if (!this.isAttacking) {
            if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) {
                this.anims.play('run', true);
            } else {
                this.anims.play('idle', true);
            }
        }
    }
}
