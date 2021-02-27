import config from './config.js';

/**
 * * Scale X coordinate according to width of environment,
 * * Round to closes integer as per MDN's recommendation for canvas
 * @param {number} val Value of X coordinate
 */
function scaleX(val) {
    return Math.round((val/100) * config.WIDTH);
}

/**
 * * Scale Y coordinate according to height of environment,
 * * Round to closes integer as per MDN's recommendation for canvas
 * @param {number} val Value of Y coordinate
 */
function scaleY(val) {
    return Math.round((val/100) * config.HEIGHT);
}

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

        const elId = 'environment-fg-layer';
        let canvasFg = document.getElementById(elId);

        if(!canvasFg) {
            canvasFg = document.createElement('canvas');
            canvasFg.setAttribute('height', config.HEIGHT);
            canvasFg.setAttribute('width', config.WIDTH);
            canvasFg.setAttribute('id', elId);
            document.getElementById('environment').appendChild(canvasFg);
        }

        let ctx = canvasFg.getContext('2d');
        ctx.clearRect(0, 0, config.WIDTH, config.HEIGHT);

        game.environment.tadpoles.forEach((tadpole) => {
            if(tadpole.rewarded) {
                rewardCount++;
                ctx.fillStyle = 'green';
                ctx.fillRect(scaleX(tadpole.position[0]), scaleY(tadpole.position[1]), 8, 8);
                
            } else if(tadpole.isDead) {
                deadCount++;
                ctx.fillStyle = 'red';
                ctx.fillRect(scaleX(tadpole.position[0]), scaleY(tadpole.position[1]), 8, 8);
            } else {
                ctx.fillStyle = 'gray';
                ctx.fillRect(scaleX(tadpole.position[0]), scaleY(tadpole.position[1]), 8, 8);
            }
        });

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
        
        continueLoopIfUnpaused();
    }

    return {
        renderTick, startRenderLoop, stopRenderLoop
    };
}

export function renderEnvironment(reward, obstacles) {
    const envEl = document.getElementById('environment');
    
    envEl.style.width = `${config.WIDTH + 25}px`;
    envEl.style.height = `${config.HEIGHT + 25}px`;
    
    const elId = 'environment-bg-layer';

    let backgroundCanvas = document.getElementById(elId);

    if(!backgroundCanvas) {
        backgroundCanvas = document.createElement('canvas');
        backgroundCanvas.setAttribute('width', config.WIDTH);
        backgroundCanvas.setAttribute('id', elId);
        backgroundCanvas.setAttribute('height', config.HEIGHT);
        document.getElementById('environment').prepend(backgroundCanvas);
    }
    
    const ctx = backgroundCanvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, config.WIDTH, config.HEIGHT);

    // Background color i.e. water
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, config.WIDTH, config.HEIGHT);

    const rewardImg = new Image();
    /* Flag sprite source: https://opengameart.org/content/flag-animation-mod */
    rewardImg.src = 'images/flag.gif';

    rewardImg.onload = () => {
        ctx.drawImage(rewardImg, scaleX(reward[0]), scaleY(reward[1]));
    }

    const obstacleImg = new Image();
    /* Flag sprite source: https://opengameart.org/content/octopus */
    obstacleImg.src = 'images/octo_small.png';
    obstacleImg.onload = () => {
        obstacles.forEach((obstacle) => {
            ctx.drawImage(obstacleImg, scaleX(obstacle[0]), scaleY(obstacle[1]));
        });
    }

}

export function removeEnvironment() {
    const canvasBg = document.getElementById('environment-bg-layer');
    const canvasFg = document.getElementById('environment-fg-layer');

    canvasBg && canvasBg.parentElement.removeChild(canvasBg);
    canvasFg && canvasFg.parentElement.removeChild(canvasFg);
}
