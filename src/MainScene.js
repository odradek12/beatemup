import Enemy from './Enemy.js';
import Player from './Player.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({key: 'MainScene'});
        this.isAttacking = false;
    }

    create() {
        this.cameras.main.setBounds(0, 0, 800 * 2, 600 * 2);
        this.physics.world.setBounds(0, 0, 800 * 2, 600 * 2);

        this.add.image(0, 0, 'bg').setOrigin(0);
        this.add.image(800, 0, 'bg').setOrigin(0).setFlipX(true);
        this.add.image(0, 600, 'bg').setOrigin(0).setFlipY(true);
        this.add.image(800, 600, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);

        this.player = new Player(this, 100, 150);
        this.physics.add.existing(this.player);

        this.player.body.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        this.punchHitbox = this.physics.add.sprite(0, 0, 'null');
        this.punchHitbox.body.setSize(20, 20);
        this.punchHitbox.setVisible(false);

        this.enemies = this.physics.add.group();
        this.createEnemies();

        this.physics.add.overlap(this.punchHitbox, this.enemies, this.handleHit, null, this);

        this.punchKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.atk2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.player.on(Phaser.Animations.Events.ANIMATION_UPDATE, (anim, frame) => {
            if (anim.key === 'attack') {
                if (frame.index >= 2 && frame.index <= 4) {
                    this.positionHitbox();
                    this.punchHitbox.body.enable = true;
                } else {
                    this.punchHitbox.body.enable = false;
                }
            } else if (anim.key === 'attack2') {
                if (frame.index >= 5 && frame.index <= 9) {
                    this.positionHitbox();
                    this.punchHitbox.body.enable = true;
                } else {
                    this.punchHitbox.body.enable = false;
                }
            }
        }, this);

        this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim) => {
            if (anim.key === 'attack' || anim.key === 'attack2') {
                this.isAttacking = false;
            }
        }, this);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.punchKey) && !this.isAttacking) {
            this.player.setVelocity(0, 0);
            this.player.anims.play('attack', true);
            this.isAttacking = true;
        }
        if (Phaser.Input.Keyboard.JustDown(this.atk2Key) && !this.isAttacking) {
            this.player.setVelocity(0, 0);
            this.player.anims.play('attack2', true);
            this.isAttacking = true;
        }

        if (!this.isAttacking) {
            this.player.update();
        }

        this.enemies.children.iterate(enemy => {
            enemy.update();
        });
    }

    positionHitbox() {
        if (this.player.flipX) {
            this.punchHitbox.setPosition(this.player.x - 50, this.player.y + 15);
        } else {
            this.punchHitbox.setPosition(this.player.x + 50, this.player.y + 15);
        }
    }

    handleHit(hitbox, enemy) {
        enemy.setTint(0xff9999);

        const dir = this.player.flipX ? -1 : 1;
        const knockbackDistance = 30;
        const knockbackDuration = 1000;

        this.tweens.add({
            targets: enemy,
            x: enemy.x + dir * knockbackDistance,
            ease: 'Power1',
            duration: knockbackDuration,
            onComplete: () => {
                enemy.clearTint();
            }
        });
    }

    createEnemies(x, y) {
        const enemyPositions = [
            {x: 400, y: 200},
            {x: 550, y: 200},
            {x: 700, y: 200}
        ];

        enemyPositions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y);
            this.enemies.add(enemy);
        })
    }
}
