export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.speed = 50;
        this.targetPosition = { x: x, y: y };

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

    update() {
        if (Phaser.Math.Distance.Between(this.x, this.y, this.targetPosition.y, this.targetPosition.y) < 5) {
            this.setVelocity(0);
        }
    }
}
