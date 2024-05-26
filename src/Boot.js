export default class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        // Load assets needed for the Preloader scene
        this.load.image('preloadBar', 'assets/preloadBar.png');
    }

    create() {
        // Start the Preloader scene
        this.scene.start('Preloader');
    }
}
