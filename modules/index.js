import Tadpole from './Tadpole.js';
import config from './config.js';

let game = null;

export default class Game {
    /** @type Tadpole[] */
    tadpoles = [];
    reward = config.REWARD;
    obstacles = config.OBSTACLES;
    generation = 0;

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


    logicTick() {
        setTimeout(() => {
            let deadOrRewardedCount = 0;
            this.tadpoles.forEach((tadpole) => {
                if(tadpole.isDead || tadpole.rewarded) {
                    deadOrRewardedCount++;
                } else {
                    tadpole.move();
                }
            });

            if(deadOrRewardedCount === this.tadpoles.length) {
                if(this.generation >= config.MAX_GENERATIONS) {
                    return;
                }
                // All tadpoles are either dead or rewarded, new generation
                // Genetic algorithm
                this.calculateFitness();
                this.naturalSelection();
                this.mutateOffsprings();
            }
            this.logicTick();
        }, config.LOGIC_TICK);
    }

    init() {
        this.tadpoles = [];

        for (let t = 0; t < config.NUM_TADPOLES; t++) this.tadpoles.push(new Tadpole(this.reward, this.obstacles));

        const canvas = document.createElement('div');
        canvas.className = 'environment';
        canvas.setAttribute('id', 'environment');
        canvas.style.width = `${config.WIDTH}px`;
        canvas.style.height = `${config.HEIGHT}px`;
        document.body.appendChild(canvas);
        
        // Insert reward
        const rewardEl = document.createElement('div');
        rewardEl.style.left = ((this.reward[0]/100) * config.WIDTH) + 'px';
        rewardEl.style.top  = ((this.reward[1]/100) * config.HEIGHT) + 'px';
        rewardEl.className = 'reward';
        document.getElementById('environment').appendChild(rewardEl);


        // Insert obstacles
        this.obstacles.forEach((obstacle) => {
            const obEl = document.createElement('div');
            obEl.style.left = ((obstacle[0]/100) * config.WIDTH) + 'px';
            obEl.style.top  = ((obstacle[1]/100) * config.HEIGHT) + 'px';
            obEl.className = 'obstacle';
            document.getElementById('environment').appendChild(obEl);
        });

        this.logicTick();
    }
}

function renderTick() {
    let deadCount = 0, rewardCount = 0;

    game.tadpoles.forEach((tadpole, i) => {
        let existingEl = document.getElementById(`tadpole${i}`);
        if (!existingEl) {
            existingEl = document.createElement('div');
            existingEl.setAttribute('id', `tadpole${i}`);
            existingEl.className = 'tadpole';
            document.getElementById('environment').appendChild(existingEl);
            existingEl.classList.add('tadpole');
        }

        existingEl.style.top = ((tadpole.position[1] / 100) * config.HEIGHT) + 'px';
        existingEl.style.left = ((tadpole.position[0] / 100) * config.WIDTH) + 'px';

        if(tadpole.isDead) {
            deadCount++;
            existingEl.classList.add('dead');
        } else existingEl.classList.remove('dead');

        if(tadpole.rewarded) {
            rewardCount++;
            existingEl.classList.add('rewarded');
        } else existingEl.classList.remove('rewarded');

        // Generation info
        let generationEl = document.getElementById('generationEl');
        if(!generationEl) {
            generationEl = document.createElement('DIV');
            generationEl.className = 'generation';
            generationEl.setAttribute('id', 'generationEl');
            document.body.appendChild(generationEl);
        }
        generationEl.innerText = `Generation: ${game.generation} | Alive:   ${game.tadpoles.length - deadCount}/ ${game.tadpoles.length} | Winners: ${rewardCount}`;
    });
    
    requestAnimationFrame(renderTick);
}

window.onload = function () {
    game = new Game();
    game.init();
    requestAnimationFrame(renderTick);
}