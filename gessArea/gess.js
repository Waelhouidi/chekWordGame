// Define game name and set title
const gameName = "Word Game";
document.title = gameName;

// Set game name in h1 and footer
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
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();
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
        document.querySelector("#winWrapper h2").innerHTML = `You win! The word is ${wordToGuess}`;
        winSound.play();
        document.getElementById('winWrapper').style.display = 'block';
    } else {
        document.querySelector(`.try-${tryCount}`).classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try-${tryCount} input`);
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
    const inputs = document.querySelectorAll('.inputs input');
    const letters = spokenText.split('');

    letters.forEach((letter, index) => {
        if (inputs[index]) {
            inputs[index].value = letter.toUpperCase();
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

// Event listener for backspace key
document.addEventListener('keydown', handleBackspace);

// Run the game when the window loads
window.onload = function () {
    generateInput();
};
