import config from './config.js';

/**
 * Manages render loops for the game
 * @param {Game | null} game 
 */
export function renderTickManager(gameInstance) {

    let animationFrameTimer = null;
    let isPaused = false;
    let game = gameInstance;

    function startRenderLoop() {
        isPaused = false;
        continueLoopIfUnpaused();
    }

    function continueLoopIfUnpaused() {
        if (!isPaused) {
            animationFrameTimer = window.requestAnimationFrame(renderTick);
        }
    }

    function stopRenderLoop() {
        if (animationFrameTimer) {
            isPaused = true;
            window.cancelAnimationFrame(animationFrameTimer);
        }
    }

    /**
     * Creates / Updates presentation + statistics
     */
    function renderTick() {
        let deadCount = 0, rewardCount = 0;

        game.environment.tadpoles.forEach((tadpole, i) => {
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

            if (tadpole.isDead) {
                deadCount++;
                existingEl.classList.add('dead');
            } else existingEl.classList.remove('dead');

            if (tadpole.rewarded) {
                rewardCount++;
                existingEl.classList.add('rewarded');
            } else existingEl.classList.remove('rewarded');

            // Generation info
            let statsEl = document.getElementById('statsEl');
            if (!statsEl) {
                statsEl = document.createElement('DIV');
                statsEl.className = 'generation';
                statsEl.setAttribute('id', 'statsEl');
                document.body.appendChild(statsEl);
            }
            statsEl.innerText = `Generation: ${game.environment.generation}` +
                `| Alive:   ${game.environment.tadpoles.length - deadCount}/ ${game.environment.tadpoles.length}` +
                ` | Survivors: ${rewardCount}`;
        });

        continueLoopIfUnpaused();
    }

    return {
        renderTick, startRenderLoop, stopRenderLoop
    };
}


export function renderEnvironment(reward, obstacles) {
    const canvas = document.getElementById('environment') || document.createElement('div');
    canvas.className = 'environment';
    canvas.setAttribute('id', 'environment');
    canvas.style.width = `${config.WIDTH}px`;
    canvas.style.height = `${config.HEIGHT}px`;
    document.body.prepend(canvas);

    // Insert reward
    const rewardEl = document.createElement('div');
    rewardEl.style.left = ((reward[0] / 100) * config.WIDTH) + 'px';
    rewardEl.style.top = ((reward[1] / 100) * config.HEIGHT) + 'px';
    rewardEl.className = 'reward';
    document.getElementById('environment').appendChild(rewardEl);


    // Insert obstacles
    obstacles.forEach((obstacle) => {
        const obEl = document.createElement('div');
        obEl.style.left = ((obstacle[0] / 100) * config.WIDTH) + 'px';
        obEl.style.top = ((obstacle[1] / 100) * config.HEIGHT) + 'px';
        obEl.className = 'obstacle';
        document.getElementById('environment').appendChild(obEl);
    });
}

export function removeEnvironment() {
    const canvas = document.getElementById('environment');
    if(canvas) {
        canvas.parentElement.removeChild(canvas);
    }
}
