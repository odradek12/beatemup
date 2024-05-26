export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.body.setCollideWorldBounds(true);

        this.isPunching = false;

        this.scene = scene;
        this.createAnimations();

        this.setScale(3);
    }

    static preload(scene) {
        scene.load.spritesheet('brawler', './src/assets/images/brawler48x48.png', { frameWidth: 48, frameHeight: 48 });
    }

    update() {
        if (!this.isPunching) {
            this.updatePlayerMovement();
            this.updatePlayerAnimation();
        }
    }

    initControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createAnimations() {
        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNumbers('brawler', { frames: [0, 1, 2, 3] }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('brawler', { frames: [5, 6, 7, 8] }),
            frameRate: 8,
            repeat: -1,
            repeatDelay: 200
        });

        this.scene.anims.create({
            key: 'punch',
            frames: this.scene.anims.generateFrameNumbers('brawler', { frames: [15, 16, 17, 18, 17, 15] }),
            frameRate: 8,
            repeat: 0
        });
    }

    updatePlayerMovement() {
        this.setVelocity(0, 0);

        if (this.cursors.left.isDown) {
            this.setVelocityX(-500);
            this.setFlipX(false);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(500);
            this.setFlipX(true);
        }

        if (this.cursors.up.isDown) {
            this.setVelocityY(-500);
        } else if (this.cursors.down.isDown) {
            this.setVelocityY(500);
        }
    }

    updatePlayerAnimation() {
        if (!this.isPunching) {
            if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) {
                this.anims.play('walk', true);
            } else {
                this.anims.play('idle', true);
            }
        }
    }
}
