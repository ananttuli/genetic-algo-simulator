import Game from './Game.js';

// Limit scope, prevents variables leaking out of script
(function() {
    /** @type Game | null */
    let game = null;

    function initializeNewGame() {
        game = new Game();
        game.init();
        game.startGame();
    }

    function resetHandler() {
        const playPauseButton = document.getElementById('startstop');
        playPauseButton.innerText = 'Pause';
        initializeNewGame();
    }

    function startStopHandler() {
        game && game.playPauseGame();
    }


    window.onload = function () {
        const resetButton = document.getElementById('reset');
        const playPauseButton = document.getElementById('startstop');

        resetButton.onclick = resetHandler;

        playPauseButton.onclick = () => {
            startStopHandler();
            playPauseButton.innerText = game.isPaused ? 'Play' : 'Pause';
        } 

        initializeNewGame();        
    }

})();
