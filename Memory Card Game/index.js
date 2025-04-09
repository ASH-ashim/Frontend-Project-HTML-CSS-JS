document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');
    const matchesDisplay = document.getElementById('matches');
    const restartBtn = document.getElementById('restart-btn');
    const themeBtn = document.getElementById('theme-btn');
    const winModal = document.getElementById('win-modal');
    const playAgainBtn = document.getElementById('play-again-btn');
    const finalTimeDisplay = document.getElementById('final-time');
    const finalMovesDisplay = document.getElementById('final-moves');
    const finalScoreDisplay = document.getElementById('final-score');

    // Game variables
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matches = 0;
    let timer;
    let seconds = 0;
    let isDarkTheme = false;

    // Emoji icons for cards
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    
    // Initialize game
    function initGame() {
        // Reset game state
        moves = 0;
        matches = 0;
        seconds = 0;
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        
        // Update displays
        movesDisplay.textContent = moves;
        matchesDisplay.textContent = `${matches}/${emojis.length}`;
        updateTimerDisplay();
        
        // Clear any existing timer
        clearInterval(timer);
        
        // Start new timer
        timer = setInterval(updateTimer, 1000);
        
        // Create cards
        createCards();
    }
    
    // Create and shuffle cards
    function createCards() {
        // Clear game board
        gameBoard.innerHTML = '';
        
        // Duplicate emojis to create pairs
        const cardEmojis = [...emojis, ...emojis];
        
        // Shuffle cards
        const shuffledCards = shuffleArray(cardEmojis);
        
        // Create card elements
        cards = shuffledCards.map(emoji => {
            const card = document.createElement('div');
            card.classList.add('card');
            
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.textContent = emoji;
            
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            
            card.addEventListener('click', flipCard);
            
            gameBoard.appendChild(card);
            
            return {
                element: card,
                emoji: emoji,
                isMatched: false
            };
        });
    }
    
    // Shuffle array using Fisher-Yates algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Flip card when clicked
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard?.element) return;
        
        const cardIndex = cards.findIndex(c => c.element === this);
        if (cards[cardIndex].isMatched) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // First card flipped
            hasFlippedCard = true;
            firstCard = {
                element: this,
                index: cardIndex
            };
            return;
        }
        
        // Second card flipped
        secondCard = {
            element: this,
            index: cardIndex
        };
        
        // Check for match
        checkForMatch();
    }
    
    // Check if flipped cards match
    function checkForMatch() {
        const isMatch = cards[firstCard.index].emoji === cards[secondCard.index].emoji;
        
        moves++;
        movesDisplay.textContent = moves;
        
        if (isMatch) {
            // Cards match
            disableMatchedCards();
            matches++;
            matchesDisplay.textContent = `${matches}/${emojis.length}`;
            
            // Check if game is won
            if (matches === emojis.length) {
                endGame();
            }
        } else {
            // Cards don't match
            lockBoard = true;
            setTimeout(() => {
                unflipCards();
            }, 1000);
        }
    }
    
    // Disable matched cards
    function disableMatchedCards() {
        cards[firstCard.index].isMatched = true;
        cards[secondCard.index].isMatched = true;
        
        firstCard.element.classList.add('matched');
        secondCard.element.classList.add('matched');
        
        resetBoard();
    }
    
    // Unflip cards that don't match
    function unflipCards() {
        firstCard.element.classList.remove('flipped');
        secondCard.element.classList.remove('flipped');
        
        resetBoard();
    }
    
    // Reset board state after each turn
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    // Update timer
    function updateTimer() {
        seconds++;
        updateTimerDisplay();
    }
    
    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // End game when all cards are matched
    function endGame() {
        clearInterval(timer);
        
        // Calculate score (lower is better)
        const score = Math.max(0, 1000 - (moves * 10) - (seconds * 2));
        
        // Update modal with final stats
        finalTimeDisplay.textContent = timeDisplay.textContent;
        finalMovesDisplay.textContent = moves;
        finalScoreDisplay.textContent = score;
        
        // Show win modal
        winModal.classList.add('active');
    }
    
    // Toggle between light and dark theme
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
        
        const icon = themeBtn.querySelector('i');
        icon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
        themeBtn.innerHTML = `<i class="${icon.className}"></i> ${isDarkTheme ? 'Light' : 'Dark'} Mode`;
    }
    
    // Event listeners
    restartBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', () => {
        winModal.classList.remove('active');
        initGame();
    });
    themeBtn.addEventListener('click', toggleTheme);
    
    // Initialize game on load
    initGame();
});