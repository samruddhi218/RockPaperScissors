const choices = {
  rock: { beats: "scissors" },
  paper: { beats: "rock" },
  scissors: { beats: "paper" }
};

let mode = "computer";
let playerScore = 0;
let opponentScore = 0;
let waitingForSecondPlayer = false;
let firstPlayerChoice = null;

const computerModeButton = document.getElementById("computerMode");
const humanModeButton = document.getElementById("humanMode");
const choiceButtons = document.querySelectorAll(".choice");
const playerScoreElement = document.getElementById("playerScore");
const opponentScoreElement = document.getElementById("opponentScore");
const leftPlayerName = document.getElementById("leftPlayerName");
const rightPlayerName = document.getElementById("rightPlayerName");
const promptElement = document.getElementById("prompt");
const helperText = document.getElementById("helperText");
const leftPickedLabel = document.getElementById("leftPickedLabel");
const rightPickedLabel = document.getElementById("rightPickedLabel");
const leftPickedName = document.getElementById("leftPickedName");
const rightPickedName = document.getElementById("rightPickedName");
const resultMessage = document.getElementById("resultMessage");
const resetButton = document.getElementById("resetButton");

function setMode(nextMode) {
  mode = nextMode;
  // Each mode starts a fresh match with both scores at zero.
  playerScore = 0;
  opponentScore = 0;
  playerScoreElement.textContent = "0";
  opponentScoreElement.textContent = "0";
  computerModeButton.classList.toggle("active", mode === "computer");
  humanModeButton.classList.toggle("active", mode === "human");

  leftPlayerName.textContent = mode === "computer" ? "YOU" : "PLAYER 1";
  rightPlayerName.textContent = mode === "computer" ? "COMPUTER" : "PLAYER 2";
  leftPickedLabel.textContent = mode === "computer" ? "YOUR PICK" : "PLAYER 1 PICK";
  rightPickedLabel.textContent = mode === "computer" ? "COMPUTER PICK" : "PLAYER 2 PICK";

  resetRoundDisplay();
  promptElement.textContent = mode === "computer" ? "Make your move" : "Player 1, make your move";
  helperText.textContent = mode === "computer"
    ? "Pick one of the three options below."
    : "Take turns choosing. Player 2 picks after Player 1.";
  waitingForSecondPlayer = false;
  firstPlayerChoice = null;
}

function resetRoundDisplay() {
  leftPickedName.textContent = "—";
  rightPickedName.textContent = "—";
  resultMessage.textContent = "Ready?";
  resultMessage.className = "result-message";
}

function getWinner(first, second) {
  if (first === second) return "draw";
  return choices[first].beats === second ? "first" : "second";
}

function showPicks(first, second) {
  leftPickedName.textContent = first;
  rightPickedName.textContent = second;
}

function showResult(winner) {
  resultMessage.className = "result-message";
  if (winner === "draw") {
    resultMessage.textContent = "It's a draw!";
    resultMessage.classList.add("draw");
  } else if (winner === "first") {
    resultMessage.textContent = mode === "computer" ? "You win! " : "Player 1 wins! ";
    resultMessage.classList.add("win");
    playerScore++;
  } else {
    resultMessage.textContent = mode === "computer" ? "Computer wins!" : "Player 2 wins!";
    resultMessage.classList.add("lose");
    opponentScore++;
  }

  playerScoreElement.textContent = playerScore;
  opponentScoreElement.textContent = opponentScore;
}

function play(choice) {
  if (mode === "computer") {
    const computerChoice = Object.keys(choices)[Math.floor(Math.random() * 3)];
    showPicks(choice, computerChoice);
    showResult(getWinner(choice, computerChoice));
    promptElement.textContent = "Round complete!";
    helperText.textContent = "Choose again to play another round.";
    return;
  }

  if (!waitingForSecondPlayer) {
    firstPlayerChoice = choice;
    waitingForSecondPlayer = true;
    leftPickedName.textContent = choice;
    rightPickedName.textContent = "Waiting...";
    resultMessage.className = "result-message";
    resultMessage.textContent = "Player 1 picked!";
    promptElement.textContent = "Player 2, make your move";
    helperText.textContent = "Pass the screen to Player 2, then choose an option.";
    return;
  }

  showPicks(firstPlayerChoice, choice);
  showResult(getWinner(firstPlayerChoice, choice));
  waitingForSecondPlayer = false;
  firstPlayerChoice = null;
  promptElement.textContent = "Round complete!";
  helperText.textContent = "Choose again for the next round. Player 1 goes first.";
}

computerModeButton.addEventListener("click", () => setMode("computer"));
humanModeButton.addEventListener("click", () => setMode("human"));
choiceButtons.forEach(button => {
  button.addEventListener("click", () => play(button.dataset.choice));
});

resetButton.addEventListener("click", () => {
  playerScore = 0;
  opponentScore = 0;
  playerScoreElement.textContent = "0";
  opponentScoreElement.textContent = "0";
  waitingForSecondPlayer = false;
  firstPlayerChoice = null;
  resetRoundDisplay();
  promptElement.textContent = mode === "computer" ? "Make your move" : "Player 1, make your move";
  helperText.textContent = mode === "computer"
    ? "Pick one of the three options below."
    : "Take turns choosing. Player 2 picks after Player 1.";
});
