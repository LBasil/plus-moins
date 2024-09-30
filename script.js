const maxAttempts = 10;
let lives = maxAttempts;
let combo = 0;
let numberToGuess;
let bossMode = false;
let lowerBound = 1;
let upperBound = 100;

const narration = {
    start: "Tu es l'Élu, devine le chiffre sacré entre 1 et 100 !",
    tooHigh: "Plus bas ! Essaye un nombre entre ",
    tooLow: "Plus haut ! Essaye un nombre entre ",
    success: "Bravo ! Ton intuition te guide vers la victoire !",
    failure: "L'échec te guette... attention !",
    bossStart: "Le boss t'attend... devine le chiffre entre 1 et 1000 !",
    gameOver: "C'est terminé, mais tu peux te relever, héros. Rejouer ?",
    victory: "Victoire ! Tu as dompté le destin !"
};

const feedbackElement = document.getElementById('feedback');
const livesElement = document.getElementById('lives');
const comboElement = document.getElementById('combo');
const bossFightElement = document.getElementById('boss-fight');
const replayButton = document.getElementById('replay-button');
const narrationElement = document.getElementById('game-narration');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');

function startGame() {
    numberToGuess = Math.floor(Math.random() * 100) + 1;
    lives = maxAttempts;
    combo = 0;
    bossMode = false;
    lowerBound = 1;
    upperBound = 100;
    livesElement.textContent = lives;
    comboElement.textContent = combo;
    narrationElement.textContent = narration.start;
    feedbackElement.textContent = "";
    bossFightElement.style.display = 'none';
    replayButton.classList.add('d-none');
    guessInput.classList.remove('success', 'fail');
    guessInput.value = "";  // Reset input value
    guessInput.disabled = false;  // Enable input
    guessButton.disabled = false;  // Enable button
    document.body.style.backgroundColor = "#343a40";  // Background reset
}

guessButton.addEventListener('click', () => {
    const guess = parseInt(guessInput.value);

    // Reset input value after each guess
    guessInput.value = "";  

    if (isNaN(guess)) return;

    if (bossMode) {
        handleBossModeGuess(guess);
    } else {
        handleRegularGuess(guess);
    }
});

function handleRegularGuess(guess) {
    if (guess === numberToGuess) {
        combo++;
        comboElement.textContent = combo;
        feedbackElement.textContent = narration.success;
        feedbackElement.classList.remove('fail');
        feedbackElement.classList.add('success');
        document.body.style.backgroundColor = "#28a745";  // Green background for success
        guessInput.classList.add('success');

        // Disable input and button during success message
        guessInput.disabled = true;
        guessButton.disabled = true;

        setTimeout(() => {
            if (combo === 5) {
                startBossFight();
            } else {
                resetGame();  // Reset game after success message
            }
        }, 3000);  // 3 seconds delay before game reset
    } else {
        updateBounds(guess);
        lives--;
        livesElement.textContent = lives;
        feedbackElement.textContent = guess > numberToGuess ? `${narration.tooHigh}${lowerBound} et ${upperBound}` : `${narration.tooLow}${lowerBound} et ${upperBound}`;
        feedbackElement.classList.add('fail');
        feedbackElement.classList.remove('success');
        document.body.style.backgroundColor = "#dc3545";  // Red background for fail
        guessInput.classList.add('fail');

        if (lives === 0) {
            feedbackElement.textContent = narration.gameOver;
            document.body.style.backgroundColor = "black";
            showReplay();
        }
    }
}

function updateBounds(guess) {
    if (guess < numberToGuess && guess > lowerBound) {
        lowerBound = guess;
    } else if (guess > numberToGuess && guess < upperBound) {
        upperBound = guess;
    }
}

function handleBossModeGuess(guess) {
    if (guess === numberToGuess) {
        feedbackElement.textContent = narration.victory;
        feedbackElement.classList.remove('fail');
        feedbackElement.classList.add('success');
        document.body.style.backgroundColor = "green";
        guessInput.classList.add('success');

        // Disable input and button during success message
        guessInput.disabled = true;
        guessButton.disabled = true;

        showReplay();
    } else {
        feedbackElement.textContent = guess > numberToGuess ? narration.tooHigh : narration.tooLow;
        feedbackElement.classList.add('fail');
        feedbackElement.classList.remove('success');
        document.body.style.backgroundColor = "#dc3545";  // Red background for fail
        guessInput.classList.add('fail');

        lives--;
        livesElement.textContent = lives;

        if (lives === 0) {
            feedbackElement.textContent = narration.gameOver;
            document.body.style.backgroundColor = "black";
            showReplay();
        }
    }
}

function startBossFight() {
    bossMode = true;
    bossFightElement.classList.remove('d-none');
    narrationElement.textContent = narration.bossStart;
    numberToGuess = Math.floor(Math.random() * 1000) + 1;
    lowerBound = 1;
    upperBound = 1000;
    lives = 20;
    livesElement.textContent = lives;
    document.body.style.backgroundColor = "#dc3545";
    guessInput.disabled = false;
    guessButton.disabled = false;
}

function showReplay() {
    replayButton.classList.remove('d-none');
    replayButton.addEventListener('click', startGame);
}

function resetGame() {
    feedbackElement.textContent = "";
    guessInput.classList.remove('success', 'fail');
    document.body.style.backgroundColor = "#343a40";  // Background reset
    guessInput.disabled = false;
    guessButton.disabled = false;
}

startGame();
