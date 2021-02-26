import Direction from './Direction.js';
import config from './config.js';

export default class Brain {

    constructor(size) {
        this.size = size;
        this.directions = [];
        this.step = 0;
        this.randomize();
    }

    randomize() {
        for(let i = 0; i < this.size; i++) {
            const dirs = Object.keys(Direction);
            const randomDir = dirs[Math.floor(Math.random() * dirs.length)];
            const reps = Math.ceil(Math.random() * config.MAX_MAINTAIN_DIRECTION_STEPS);

            for(let r = 0; r < reps; r++) {
                if(i + r < this.size) {
                    this.directions[i + r] = randomDir;
                    i += 1;
                }
            }

        }
    }

    static clone(brain) {
        const newBrain = new Brain(brain.size);
        newBrain.directions = brain.directions;
        return newBrain;
    }

    mutate(isLeader) {
        const dirs = Object.keys(Direction);
        // If leader, return unchanged
        if(isLeader) return;
        for(let i = 0; i < this.directions; i++) {
            if((Math.random() * 1) < config.MUTATION_RATE) {
                this.directions[i] = dirs[Math.floor(Math.random() * dirs.length)];
            }
        }
    }
}