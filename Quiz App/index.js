document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const scoreElement = document.getElementById('score');
    const timeElement = document.getElementById('time');
    const progressElement = document.getElementById('progress');
    const progressTextElement = document.getElementById('progress-text');
    const nextButton = document.getElementById('next-btn');
    const resultModal = document.getElementById('result-modal');
    const finalScoreElement = document.getElementById('final-score');
    const performanceMessageElement = document.getElementById('performance-message');
    const restartButton = document.getElementById('restart-btn');
    
    // Quiz Variables
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft = 30;
    let questions = [];
    let jsConfetti = new JSConfetti();

    // Fetch Questions from API
    async function fetchQuestions() {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple'); // Fetch 10 multiple-choice questions
            const data = await response.json();
            return data.results.map(question => ({
                question: question.question,
                options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5), // Shuffle options
                correctAnswer: [...question.incorrect_answers, question.correct_answer].indexOf(question.correct_answer)
            }));
        } catch (error) {
            console.error('Error fetching questions:', error);
            return []; // Return empty array in case of error
        }
    }

    // Initialize Quiz
    async function initQuiz() {
        questions = await fetchQuestions();
        if (questions.length === 0) {
            questionElement.textContent = "Failed to load questions. Please try again later.";
            return;
        }
        currentQuestionIndex = 0;
        score = 0;
        updateScore();
        loadQuestion();
    }

    // Load Question
    function loadQuestion() {
        resetState();
        startTimer();
        
        const currentQuestion = questions[currentQuestionIndex];
        const questionNo = currentQuestionIndex + 1;
        
        questionElement.textContent = decodeHtml(currentQuestion.question);
        progressElement.style.width = `${(questionNo / questions.length) * 100}%`;
        progressTextElement.textContent = `Question ${questionNo}/${questions.length}`;
        
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = decodeHtml(option);
            button.classList.add('option');
            button.addEventListener('click', () => selectOption(index));
            optionsElement.appendChild(button);
        });
        
        nextButton.style.display = 'none';
    }

    // Reset State
    function resetState() {
        clearInterval(timer);
        timeLeft = 30;
        timeElement.textContent = timeLeft;
        
        while (optionsElement.firstChild) {
            optionsElement.removeChild(optionsElement.firstChild);
        }
    }

    // Start Timer
    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                handleTimeOut();
            }
        }, 1000);
    }

    // Handle Time Out
    function handleTimeOut() {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.classList.add('disabled');
        });
        
        nextButton.style.display = 'block';
        nextButton.disabled = false;
    }

    // Select Option
    function selectOption(selectedIndex) {
        clearInterval(timer);
        
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedIndex === currentQuestion.correctAnswer;
        const options = document.querySelectorAll('.option');
        
        options.forEach((option, index) => {
            option.classList.add('disabled');
            if (index === currentQuestion.correctAnswer) {
                option.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                option.classList.add('wrong');
            }
        });
        
        if (isCorrect) {
            score++;
            updateScore();
        }
        
        nextButton.style.display = 'block';
        nextButton.disabled = false;
    }

    // Update Score
    function updateScore() {
        scoreElement.textContent = score;
    }

    // Next Question
    function nextQuestion() {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }

    // Show Result
    function showResult() {
        resultModal.classList.add('show');
        finalScoreElement.textContent = `${score}/${questions.length}`;
        
        // Performance message based on score
        const percentage = (score / questions.length) * 100;
        let message;
        
        if (percentage >= 90) {
            message = "Outstanding! You're a quiz master! 🎉";
            jsConfetti.addConfetti({
                emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
                emojiSize: 30,
                confettiNumber: 50,
            });
        } else if (percentage >= 70) {
            message = "Great job! You know your stuff! 👍";
            jsConfetti.addConfetti();
        } else if (percentage >= 50) {
            message = "Good effort! Keep learning! 💪";
        } else {
            message = "Keep practicing! You'll get better! 📚";
        }
        
        performanceMessageElement.textContent = message;
    }

  
    function restartQuiz() {
        resultModal.classList.remove('show');
        initQuiz();
    }

    
    function decodeHtml(html) {
        const temp = document.createElement('textarea');
        temp.innerHTML = html;
        return temp.value;
    }
   
    nextButton.addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', restartQuiz);
   
    initQuiz();
});
