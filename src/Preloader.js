export default class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: 'Preloader' });
    }

    preload() {
        // Add the loading bar sprite
        var preloadBar = this.add.sprite(400, 300, 'preloadBar');
        preloadBar.setOrigin(0.5, 0.5);

        // Update the loading bar based on the progress
        this.load.on('progress', function (value) {
            preloadBar.scaleX = value;
        });

        // Load all assets needed for the game
        this.load.image('bg', './src/assets/images/bg.png');
        this.load.image('enemy', './src/assets/images/cocktail.png');
        this.load.atlas('knight', './src/assets/images/knight.png', './src/assets/images/knight.json');
    }

    create() {
        // Once assets are loaded, start the main game scene
        this.scene.start('MainScene');
    }
}
