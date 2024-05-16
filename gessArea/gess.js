// Make title for the game 
const gameName = "Word Game";
document.title = gameName;


// make name off game in h1 and footer
document.querySelector("h1").textContent = gameName;
document.querySelector("footer").innerHTML = `${gameName} created by Wael Houidi. Don't forget to buy me a coffee`;

// Select message element
const message = document.querySelector(".message");

// Array of words for the game
const words = ["React", "Cloud", "Linux", "Virus", "Webjs", "Debug"];
let wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

// Game area settings
const numbersOftry = 6;
const numberOfinput = 5;
let tryCount = 1;
let numberOfHints = 2;

// Initialize hints display
document.querySelector('.help span').textContent = numberOfHints;

// Generate input fields for the game
function generateInput() {
    const inputsContainer = document.querySelector(".inputs");

    for (let i = 1; i <= numbersOftry; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
       tryDiv.innerHTML = `<span>try ${i}</span>`;
        if (i !== 1) {
            tryDiv.classList.add("disabled-inputs");
        }
        for (let j = 1; j <= numberOfinput; j++) {
            const inputField = document.createElement('input');
            inputField.setAttribute("type", "text");
            inputField.id = `guess${i}-lettre${j}`;
            inputField.setAttribute("maxlength", "1");
            tryDiv.appendChild(inputField);
        }
        inputsContainer.appendChild(tryDiv);
    }
    inputsContainer.children[0].children[1].focus();

    // Disable all inputs except the first one
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input) => (input.disabled = true));

    const inputs = document.querySelectorAll(".inputs input");
    inputs.forEach((input, index) => {
        input.addEventListener("input", function (event) {
            const inputValue = event.data || ''; // Input value or empty string if backspace/delete
            if (!/^[a-zA-Z]+$/.test(inputValue)) {
                // If the input value is not an alphabet character, clear it
                this.value = '';
            } else {
                // Convert input to uppercase
                this.value = inputValue.toUpperCase();
                const nextInput = inputs[index + 1];
                if (nextInput) nextInput.focus();
            }
        });
    });
}

// Handle guesses when checking the word
const handleGuesses = () => {
    let win = true;
    const winSound = new Audio('../img/video/videoplayback.m4a');
    const loseSound = new Audio('../img/video/lose.m4a');

    for (let i = 1; i <= numberOfinput; i++) {
        const inputCurrent = document.querySelector(`#guess${tryCount}-lettre${i}`);
        const letter = inputCurrent.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        if (letter === actualLetter) {
            inputCurrent.classList.add("correct");
        } else if (wordToGuess.includes(letter) && letter !== "") {
            inputCurrent.classList.add("false-place");
            win = false;
        } else {
            inputCurrent.classList.add("wrong");
            win = false;
        }
    }

    if (win) {
        message.innerHTML = `You win the word is ${wordToGuess}`;
        const allTries = document.querySelectorAll('.inputs > div');
        allTries.forEach(tryDiv => tryDiv.classList.add("disabled-inputs"));
        document.querySelector(".check").disabled = true;
        document.querySelector(".check").classList.add("disabled-button");
        document.querySelector(".help").classList.add('disabled-button');
        document.querySelector("#winWrapper header").innerHTML = "Congratulations!";
        document.querySelector("#winWrapper img").src = "../img/video/game-gaming.gif";
        document.querySelector("#winWrapper h2").innerHTML = `You win! The word is ${wordToGuess}`;
        winSound.play();
        document.getElementById('winWrapper').style.display = 'block';
    } else {
        document.querySelector(`.try-${tryCount}`).classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try-${tryCount} input`);
        document.querySelector("#winWrapper img").src = "../img/video/los.gif";

        currentTryInputs.forEach((input) => (input.disabled = true));

        tryCount++;

        const nextTryInputs = document.querySelectorAll(`.try-${tryCount} input`);
        nextTryInputs.forEach((input) => {
            input.disabled = false;
        });

        let el = document.querySelector(`.try-${tryCount} `);
        if (el) {
            document.querySelector(`.try-${tryCount}`).classList.remove("disabled-inputs");
            el.children[1].focus();
        } else {
            document.querySelector(".check").disabled = true;
            document.querySelector("#winWrapper header").innerHTML = "Game Over!";
            document.querySelector("#winWrapper h2").innerHTML = `You lose! The word was ${wordToGuess}`;
            loseSound.play();
            document.querySelector(".check").classList.add("disabled-button");
            document.getElementById('winWrapper').style.display = 'block';
        }
    }
};

// Event listener for checking the word
document.querySelector(".check").addEventListener("click", handleGuesses);
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleGuesses();
    }
});

// Speech recognition button functionality
const voiceInputButton = document.getElementById('voiceInputButton');

voiceInputButton.addEventListener('click', () => {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onresult = function (event) {
        const spokenText = event.results[0][0].transcript.toLowerCase();
        fillInputWithSpokenText(spokenText);
    };

    recognition.start();
});

// Function to fill input with spoken text
function fillInputWithSpokenText(spokenText) {
    const currentTryInputs = document.querySelectorAll(`.try-${tryCount} input`);
    const letters = spokenText.trim().toLowerCase().split(''); 

    currentTryInputs.forEach((input, index) => {
        const letter = letters[index]; 
        if (letter && /[a-zA-Z]/.test(letter)) { 
            input.value = letter.toUpperCase();
        } else {
            input.value = '';
        }
    });
}


// Function to get hint
function gethint() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector('.help span').innerHTML = numberOfHints;
    } else if (numberOfHints === 0) {
        getHintButton.disabled = true;
    }

    const enabledInput = document.querySelectorAll('input:not([disabled])');
    const emptyEnabledInput = Array.from(enabledInput).filter((input) => input.value === "");

    if (emptyEnabledInput.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInput.length);
        const randomInput = emptyEnabledInput[randomIndex];
        const indexToFill = Array.from(enabledInput).indexOf(randomInput);

        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}

// Event listener for hint button
document.querySelector('.help').addEventListener("click", gethint);

// Function to handle backspace
function handleBackspace(event) {
    if (event.key === 'Backspace') {
        const inputs = document.querySelectorAll('input:not([disabled])');
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);

        if (currentIndex > 0) {
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];

            currentInput.value = "";

            prevInput.focus();

            prevInput.value = "";
        }
    }
}
document.addEventListener("keydown",handleBackspace)

// Event listener for backspace key
const menuBtn = document.querySelector("#settings-btn"); // Corrected the class name
menuBtn.addEventListener("click", () => {
    document.querySelector("#stg-ing").style.display = "block";
});
// Event listener for the close button
const closeBtn = document.querySelector("#close-btn");
closeBtn.addEventListener("click", () => {
    document.querySelector("#stg-ing").style.display = "none";
});
//restart button
const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener('click',()=>{
    window.location.reload();
});
const translations = {
    en: {
        title: "Word Game",
        chooseLanguage: "Choose language :",
        rulesTitle: "Rules of the game :",
        gamePlay: "Game play :",
        gameRules:`<ol>
        <li>The player has 6 attempts to guess the hidden word</li>
        <li>On each attempt, the player enters a letter in the grid to form a word</li>
        <li>After each attempt, the game indicates the correct letters placed in the right position, the correct letters placed in the wrong position, and the incorrect letters</li>
    </ol>`,
        endOfGame: "End of Game:",
        endRules:`  <ol>
        <li>The game ends when the player correctly guesses the word or when they have used all 6 attempts without success</li>
        <li>Upon success, the game displays a victory message.</li>
        <li>Upon failure, the game displays the correct word.</li>
    </ol>`,
        victoryMessage: "You win the word is",
        gameOverMessage: "Game Over!",
        correctText: "correct",
        falsePlaceText: "correct character but wrong place",
        wrongText: "wrong character",
        checkWord: "Check Word",
        hint: "Hint",
        restartBtn: "Restart",
        foot:`${gameName} created by Wael Houidi. `,
    },
    fr: {
        title: "Jeu de mots",
        chooseLanguage: "Choisissez la langue :",
        rulesTitle: "Règles du jeu :",
        gamePlay: "Déroulement du jeu :",
        gameRules:`<ol>
<li>Le joueur a 6 tentatives pour deviner le mot caché</li>
<li>À chaque tentative, le joueur entre une lettre dans la grille pour former un mot</li>
<li>Après chaque tentative, le jeu indique les lettres correctement placées à la bonne position, les lettres correctes placées à la mauvaise position et les lettres incorrectes</li>
</ol>`,
        endOfGame: "Fin du jeu :",
        endRules:`<ol>
<li>La partie se termine lorsque le joueur devine correctement le mot ou lorsqu'il a utilisé toutes ses 6 tentatives sans succès</li>
<li>En cas de succès, le jeu affiche un message de victoire.</li>
<li>En cas d'échec, le jeu affiche le mot correct.</li>
</ol>`,
        victoryMessage: "Vous avez gagné, le mot est",
        gameOverMessage: "Partie terminée !",
        correctText: "correct",
        falsePlaceText: "caractère correct mais mauvais placement",
        wrongText: "caractère incorrect",
        checkWord: "Vérifier le mot",
        hint: "Indice",
        restartBtn: "Recommencer",
        foot:`${gameName} cree par Wael Houidi. `,

    }
};

const languageSelect = document.getElementById("language-select");
const elementsToUpdate = {
    title: document.getElementById("title"),
    chooseLanguage: document.getElementById("choose-language"),
    rulesTitle: document.getElementById("rules-title"),
    gamePlay: document.getElementById("game-play"),
    gameRules: document.getElementById("game-play-rules"),
    endOfGame: document.getElementById("end-of-game"),
    endRules: document.getElementById("end-of-game-rules"),
    winHeader: document.getElementById("win-header"),
    winMessage: document.getElementById("win-message"),
    correctText: document.getElementById("correct-text"),
    falsePlaceText: document.getElementById("false-place-text"),
    wrongText: document.getElementById("wrong-text"),
    checkWord: document.getElementById("check-word"),
    hint: document.getElementById("hint"),
    restartBtn: document.getElementById("restart-btn"),
    foot: document.querySelector("footer")  

};

function updateContent(language) {
    const translation = translations[language];
    for (const key in elementsToUpdate) {
        elementsToUpdate[key].innerHTML = translation[key];
    }
}

languageSelect.addEventListener("change", function () {
    updateContent(this.value);
});

// Initialize content with default language
updateContent(languageSelect.value);
// Run the game when the window loads
window.onload = function () {
    generateInput();
};

