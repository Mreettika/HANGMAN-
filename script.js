const getWordBtn = document.getElementById('getWordBtn');
const wordContainer = document.getElementById('wordContainer');
const alphabetContainer = document.getElementById('alphabetContainer');
const hangmanCanvas = document.getElementById('hangmanCanvas');
const ctx = hangmanCanvas.getContext('2d');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');
const playAgainBtn = document.getElementById('playAgainBtn');

let selectedWord = '';
let correctGuesses = [];
let wrongGuesses = 0;

const hangmanParts = [
    () => { ctx.beginPath(); ctx.arc(100, 30, 20, 0, Math.PI * 2); ctx.stroke(); }, // Head
    () => { ctx.moveTo(100, 50); ctx.lineTo(100, 120); ctx.stroke(); },             // Body
    () => { ctx.moveTo(100, 70); ctx.lineTo(60, 90); ctx.stroke(); },                // Left arm
    () => { ctx.moveTo(100, 70); ctx.lineTo(140, 90); ctx.stroke(); },               // Right arm
    () => { ctx.moveTo(100, 120); ctx.lineTo(80, 170); ctx.stroke(); },              // Left leg
    () => { ctx.moveTo(100, 120); ctx.lineTo(120, 170); ctx.stroke(); },             // Right leg
];

getWordBtn.addEventListener('click', async () => {
    resetGame();
    const response = await fetch('https://random-word-api.herokuapp.com/word');
    const data = await response.json();
    selectedWord = data[0].toUpperCase();
    displayBlanks();
    displayAlphabets();
});

function displayBlanks() {
    wordContainer.innerHTML = '';
    selectedWord.split('').forEach(letter => {
        const letterBox = document.createElement('span');
        letterBox.textContent = '_';
        letterBox.classList.add('letter-box');
        wordContainer.appendChild(letterBox);
    });
}

function displayAlphabets() {
    alphabetContainer.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
        const btn = document.createElement('button');
        btn.textContent = String.fromCharCode(i);
        btn.addEventListener('click', handleGuess);
        alphabetContainer.appendChild(btn);
    }
}

function handleGuess(event) {
    const guessedLetter = event.target.textContent;
    event.target.disabled = true;

    if (selectedWord.includes(guessedLetter)) {
        selectedWord.split('').forEach((letter, index) => {
            if (letter === guessedLetter) {
                wordContainer.children[index].textContent = guessedLetter;
                correctGuesses.push(guessedLetter);
            }
        });
        checkWin();
    } else {
        drawNextPart();
        wrongGuesses++;
        if (wrongGuesses === hangmanParts.length) {
            showPopup('You Lost! The word was: ' + selectedWord);
        }
    }
}

function drawNextPart() {
    hangmanParts[wrongGuesses]();
}

function checkWin() {
    const currentWord = Array.from(wordContainer.children).map(span => span.textContent).join('');
    if (currentWord === selectedWord) {
        showPopup('You Won!');
    }
}

function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = 'block';
}

playAgainBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    resetGame();
});

function resetGame() {
    selectedWord = '';
    correctGuesses = [];
    wrongGuesses = 0;
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
    wordContainer.innerHTML = '';
    alphabetContainer.innerHTML = '';
}