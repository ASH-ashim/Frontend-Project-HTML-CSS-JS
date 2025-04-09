document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const choices = document.querySelectorAll('.choice');
    const playerChoiceDisplay = document.querySelector('.player-choice .choice-inner');
    const computerChoiceDisplay = document.querySelector('.computer-choice .choice-inner');
    const resultText = document.getElementById('result-text');
    const playerScoreDisplay = document.getElementById('player-score');
    const computerScoreDisplay = document.getElementById('computer-score');
    const playAgainBtn = document.getElementById('play-again');
    const rulesBtn = document.getElementById('rules-btn');
    const rulesModal = document.getElementById('rules-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Game variables
    let playerScore = 0;
    let computerScore = 0;
    let gameOver = false;
    
    // Icon mapping
    const choiceIcons = {
        rock: 'fas fa-hand-rock',
        paper: 'fas fa-hand-paper',
        scissors: 'fas fa-hand-scissors',
        default: 'fas fa-question'
    };
    
    // Initialize the game
    function init() {
        playerScore = 0;
        computerScore = 0;
        gameOver = false;
        updateScore();
        resetBattleArea();
        resultText.textContent = 'Choose your weapon!';
        playAgainBtn.style.display = 'none';
        enableChoices();
    }
    
    // Update the score display
    function updateScore() {
        playerScoreDisplay.textContent = playerScore;
        computerScoreDisplay.textContent = computerScore;
    }
    
    // Reset the battle area
    function resetBattleArea() {
        playerChoiceDisplay.className = 'choice-inner';
        playerChoiceDisplay.innerHTML = `<i class="${choiceIcons.default}"></i>`;
        computerChoiceDisplay.className = 'choice-inner';
        computerChoiceDisplay.innerHTML = `<i class="${choiceIcons.default}"></i>`;
        
        // Remove winner classes
        document.querySelector('.player-choice').classList.remove('winner');
        document.querySelector('.computer-choice').classList.remove('winner');
    }
    
    // Enable choice buttons
    function enableChoices() {
        choices.forEach(choice => {
            choice.style.pointerEvents = 'auto';
            choice.style.opacity = '1';
        });
    }
    
    // Disable choice buttons
    function disableChoices() {
        choices.forEach(choice => {
            choice.style.pointerEvents = 'none';
            choice.style.opacity = '0.6';
        });
    }
    
    // Computer makes a random choice
    function computerPlay() {
        const choices = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * 3);
        return choices[randomIndex];
    }
    
    // Determine the winner
    function playRound(playerSelection, computerSelection) {
        if (playerSelection === computerSelection) {
            return 'draw';
        }
        
        if (
            (playerSelection === 'rock' && computerSelection === 'scissors') ||
            (playerSelection === 'paper' && computerSelection === 'rock') ||
            (playerSelection === 'scissors' && computerSelection === 'paper')
        ) {
            return 'player';
        } else {
            return 'computer';
        }
    }
    
    // Update the battle area with choices
    function updateBattleArea(playerChoice, computerChoice, result) {
        // Update player choice display
        playerChoiceDisplay.className = 'choice-inner';
        playerChoiceDisplay.innerHTML = `<i class="${choiceIcons[playerChoice]}"></i>`;
        
        // Update computer choice display
        computerChoiceDisplay.className = 'choice-inner';
        computerChoiceDisplay.innerHTML = `<i class="${choiceIcons[computerChoice]}"></i>`;
        
        // Highlight the winner
        if (result === 'player') {
            document.querySelector('.player-choice').classList.add('winner');
            resultText.textContent = `You win! ${capitalizeFirstLetter(playerChoice)} beats ${capitalizeFirstLetter(computerChoice)}`;
            resultText.style.color = 'var(--win-color)';
        } else if (result === 'computer') {
            document.querySelector('.computer-choice').classList.add('winner');
            resultText.textContent = `You lose! ${capitalizeFirstLetter(computerChoice)} beats ${capitalizeFirstLetter(playerChoice)}`;
            resultText.style.color = 'var(--lose-color)';
        } else {
            resultText.textContent = "It's a draw!";
            resultText.style.color = 'var(--draw-color)';
        }
    }
    
    // Capitalize first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Check if game is over
    function checkGameOver() {
        if (playerScore >= 5 || computerScore >= 5) {
            gameOver = true;
            disableChoices();
            playAgainBtn.style.display = 'block';
            
            if (playerScore > computerScore) {
                resultText.textContent = `You won the game ${playerScore}-${computerScore}! 🎉`;
            } else {
                resultText.textContent = `You lost the game ${playerScore}-${computerScore}. 😢`;
            }
        }
    }
    
    // Event listeners
    choices.forEach(choice => {
        choice.addEventListener('click', () => {
            if (gameOver) return;
            
            const playerChoice = choice.dataset.choice;
            const computerChoice = computerPlay();
            const result = playRound(playerChoice, computerChoice);
            
            // Update scores
            if (result === 'player') {
                playerScore++;
            } else if (result === 'computer') {
                computerScore++;
            }
            
            updateScore();
            updateBattleArea(playerChoice, computerChoice, result);
            checkGameOver();
        });
    });
    
    playAgainBtn.addEventListener('click', init);
    
    // Modal functionality
    rulesBtn.addEventListener('click', () => {
        rulesModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', () => {
        rulesModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === rulesModal) {
            rulesModal.style.display = 'none';
        }
    });
    
    // Initialize the game
    init();
});