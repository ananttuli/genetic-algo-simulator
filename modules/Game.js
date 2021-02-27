import Environment from './Environment.js';
import config from './config.js';
import { renderEnvironment, renderTickManager, removeEnvironment } from './Renderer.js';

export default class Game {

    constructor() {
        this.environment = new Environment(config.NUM_TADPOLES, config.REWARD, config.OBSTACLES, config.MAX_GENERATIONS);
        this.isPaused = false;
        this.renderTickManager = renderTickManager(this);
    }

    logicTick() {
        if(this.isPaused) return;

        setTimeout(() => {
            this.environment.entropy();
            this.logicTick();
        }, config.LOGIC_TICK);
    }

    init() {
        removeEnvironment();

        console.log('Creating first generation ...');
        this.environment.createFirstGeneration();

        console.log('Initializing Game Environment ...');
        renderEnvironment(this.environment.reward, this.environment.obstacles);
    }

    startGame() {
        this.isPaused = false;
        this.renderTickManager.startRenderLoop();
        this.logicTick();
    }

    pauseGame() {
        this.isPaused = true;
        this.renderTickManager.stopRenderLoop();
    }

    playPauseGame() {
        this.isPaused ? this.startGame() : this.pauseGame();
    }
}
