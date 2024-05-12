// import Phaser from 'phaser';
let player; // Define player at a higher scope
let hurtbox;
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

function preload() {
    this.load.image('background', './src/assets/images/bg.png');
}

function create() {
    let bg = this.add.image(0, 0, 'background');
    bg.setOrigin(0, 0); // This sets the origin of the image to the top-left corner
    bg.setScale(this.sys.game.config.width / bg.width, this.sys.game.config.height / bg.height); // Scale the image to cover the entire game area

    // Add player as a rectangle
    player = this.add.rectangle(100, 250, 60, 80, 0xcf4023) // Now player is accessible in update
    player.setOrigin(0.5, 0.5);
    this.cursors = this.input.keyboard.createCursorKeys();

    hurtbox = this.add.rectangle(player.x, player.y, 70, 10, 0xFF0000); // Red for visibility
    hurtbox.setOrigin(0.5, 0.5);
    hurtbox.setVisible(false); // Start as not visible

    this.cursors = this.input.keyboard.createCursorKeys();
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); // Key for attacking

}

function update() {
    // Game logic updates go here
    // Player speed in pixels per frame
    const speed = 5;

    if (this.cursors.left.isDown) {
        player.x -= speed;
        player.facing = 'left';
    } else if (this.cursors.right.isDown) {
        player.x += speed;
        player.facing = 'right';
    }

    if (this.cursors.up.isDown) {
        player.y -= speed;
    } else if (this.cursors.down.isDown) {
        player.y += speed;
    }

    // Update the hurtbox position and visibility based on the attack key
    if (this.attackKey.isDown) {
        hurtbox.setVisible(true);
        hurtbox.y = player.y;

        // Adjust hurtbox position based on the player's horizontal facing direction
        if (player.facing === 'left') {
            hurtbox.x = player.x - player.width / 2 - hurtbox.width / 2;
        } else if (player.facing === 'right') {
            hurtbox.x = player.x + player.width / 2 + hurtbox.width / 2;
        }
    } else {
        hurtbox.setVisible(false);
    }
}

const game = new Phaser.Game(config);
