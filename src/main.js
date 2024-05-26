import Boot from './Boot.js';
import Preloader from './Preloader.js';
import MainScene from './MainScene.js';

window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: [Boot, Preloader, MainScene],
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        }
    };

    const game = new Phaser.Game(config);
};
