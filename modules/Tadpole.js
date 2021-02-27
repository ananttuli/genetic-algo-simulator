import Brain from './Brain.js';
import Direction from './Direction.js';
import { cartesianDistance } from './util.js';
import config from './config.js';

export default class Tadpole {

    constructor(rewardCoords, obstacles) {
        // Add a minor random factor to the starting coordinates
        this.position = [config.STARTING_COORDS[0] + Math.random() * 2, config.STARTING_COORDS[1] + Math.random() * 2];
        this.brain = new Brain(config.MAX_STEPS);
        this.isDead = false;
        this.rewarded = false;
        this.reward = rewardCoords;
        this.fitness = 0;
        this.obstacles = obstacles;
    }

    moveLeft() {
        this.position[0] > 2 ?
            (this.position[0] -= config.MOVE_SIZE) :
            this.die();
    }

    moveRight() {
        this.position[0] < 98 ?
            (this.position[0] += config.MOVE_SIZE) :
            this.die();
    }

    moveDown() {
        this.position[1] < 98 ?
            (this.position[1] += config.MOVE_SIZE) :
            this.die();
    }

    moveUp() {
        this.position[1] > 2 ?
            (this.position[1] -= config.MOVE_SIZE) :
            this.die();
    }

    move() {
        if (this.isDead || this.rewarded) return;

        if (this.brain.directions.length > this.brain.step) {
            const direction = this.brain.directions[this.brain.step];
            switch (direction) {
                case Direction.UP:
                    this.moveUp();
                    break;
                case Direction.DOWN:
                    this.moveDown();
                    break;
                case Direction.LEFT:
                    this.moveLeft();
                    break;
                case Direction.RIGHT:
                    this.moveRight();
                    break;
                case Direction.TOPLEFT:
                    this.moveUp();
                    this.moveLeft();
                    break;
                case Direction.TOPRIGHT:
                    this.moveUp();
                    this.moveRight();
                    break;
                case Direction.BOTTOMLEFT:
                    this.moveDown();
                    this.moveLeft();
                    break;
                case Direction.BOTTOMRIGHT:
                    this.moveDown();
                    this.moveRight();
                    break;
            }

            this.brain.step++;

            // Check whether the last move rewarded
            this.checkRewarded();
            this.checkObstacle();
        } else {
            // Die if steps finished
            this.die();
        }
    }

    die() {
        this.isDead = true;
    }

    checkObstacle() {
        this.obstacles.some((ob) => {
            return cartesianDistance(ob, this.position) < 2
        }) && this.die();
    }

    checkRewarded() {
        if (cartesianDistance(this.reward, this.position) < 4) {
            this.rewarded = true;
        };
    }

    calculateFitness() {
        const d = cartesianDistance(this.reward, this.position);
        const bonusFactor = this.rewarded ? config.REWARD_FACTOR : config.DEATH_PENALTY;
        const stepFactor = 1 / this.brain.step;

        // Add small value to avoid divide by zero
        const factor = (d + 0.0000001) * (bonusFactor - stepFactor);
        this.fitness = 1 / (factor * factor);
    }

    breed() {
        const babyTadpole = new Tadpole(this.reward, this.obstacles);
        babyTadpole.brain = Brain.clone(this.brain);
        return babyTadpole;
    }

}
