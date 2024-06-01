export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, 'enemy1');
        // super(scene, x, y, 'enemy1');
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.speed = 50;
        this.targetPosition = {x: x, y: y};

        this.createAnimations();
        this.play('enemy_idle');

        this.setScale(3);

        this.reorient();
    }

    reorient() {
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.updateDirection,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (Phaser.Math.Distance.Between(this.x, this.y, this.targetPosition.y, this.targetPosition.y) < 5) {
            this.setVelocity(0);
        }
    }

    updateDirection() {
        const player = this.scene.player;

        const distanceToLeft = Math.abs(player.x - 100 - this.x);
        const distanceToRight = Math.abs(player.x + 100 - this.x);
        const targetX = distanceToLeft < distanceToRight ? player.x - 100 : player.x + 100;

        this.targetPosition.x = targetX;
        this.targetPosition.y = player.y;

        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPosition.x, this.targetPosition.y);
        this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);

    }

    createAnimations() {
        this.scene.anims.create({
            key: 'enemy_idle',
            frames: this.scene.anims.generateFrameNumbers('enemy1', {
                start: 0,
                end: 3
            }),
            frameRate: 8,
            repeat: -1
        });
    }
}
