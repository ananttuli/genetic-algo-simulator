import Tadpole from './Tadpole.js';

export default class Environment {
    
    constructor(numTadpoles, reward, obstacles, maxGenerations) {
        /** @type Tadpole[] */
        this.tadpoles = [];
        this.numTadpoles = numTadpoles;
        this.reward = reward;
        this.obstacles = obstacles;
        this.generation = 0;
        this.maxGenerations = maxGenerations;
    }

    calculateFitness() {
        this.tadpoles.forEach((tadpole) => tadpole.calculateFitness());
    }

    calculateFitnessSum() {
        return this.tadpoles.reduce((total, tadpole) => total + (tadpole.fitness || 0), 0);
    }

    selectParent() {
        const num = Math.random() * this.calculateFitnessSum();

        let runningSum = 0;

        for(let i = 0; i < this.tadpoles.length; i++) {
            runningSum += this.tadpoles[i].fitness;
            if(runningSum > num) return this.tadpoles[i];    
        }
    }

    
    naturalSelection() {
        const newTadpoles = [];
        for(let i = 0; i < this.tadpoles.length; i++) {
            const parent = this.selectParent();
            newTadpoles.push(parent.breed());
        }

        this.tadpoles = newTadpoles;
        
        this.generation++;
    }

    mutateOffsprings() {
        let winnerIndex = -1, fitness = 0;
        this.tadpoles.forEach((x, i) => {
            if((x.fitness > fitness) && x.rewarded) {
                winnerIndex = i;
                fitness = x.fitness;
            }
        });
        this.tadpoles.forEach((tadpole, i) => {
            tadpole.brain.mutate(i === winnerIndex);
        });
    }

    entropy() {
        let deadOrRewardedCount = 0;
            this.tadpoles.forEach((tadpole) => {
                if(tadpole.isDead || tadpole.rewarded) {
                    deadOrRewardedCount++;
                } else {
                    tadpole.move();
                }
            });

            if(deadOrRewardedCount === this.tadpoles.length) {
                if(this.generation >= this.maxGenerations) {
                    return;
                }
                // All tadpoles are either dead or rewarded, new generation
                // Genetic algorithm
                this.calculateFitness();
                this.naturalSelection();
                this.mutateOffsprings();
            }
    }

    createFirstGeneration() {
        this.tadpoles = [];
        for (let t = 0; t < this.numTadpoles; t++) this.tadpoles.push(new Tadpole(this.reward, this.obstacles));
    }

}