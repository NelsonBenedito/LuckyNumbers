var board = [];
var currentGame = [];
var savedGames = [];
let darkMode = localStorage.getItem("darkMode");
var state = { board: [], currentGame: [], savedGames: [] };

function start() {
  readLocalStorage();
  createBoard();
  newGame();
  toggleMode();
  if (darkMode === "enabled") {
    enableDark();
  }
}

const enableDark = () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("darkMode", "enabled");
  console.log("Enabled");
};
const disableDark = () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("darkMode", "disabled");
  console.log("disabled");
};

const toggleMode = () => {
  document.getElementById("toggleBtn").addEventListener("click", () => {
    darkMode = localStorage.getItem("darkMode");
    if (darkMode !== "enabled") {
      enableDark();
    } else {
      disableDark();
    }
  });
};

function readLocalStorage() {
  if (!window.localStorage) {
    return;
  }

  var savedGamesFromLocalStorage = window.localStorage.getItem("saved-games");

  if (savedGamesFromLocalStorage) {
    state.savedGames = JSON.parse(savedGamesFromLocalStorage);
  }
}
function writeToLocalStorage() {
  window.localStorage.setItem("saved-games", JSON.stringify(state.savedGames));
}
function createBoard() {
  state.board = [];
  for (let i = 0; i <= 60; i++) {
    state.board.push(i);
  }
}
function newGame() {
  resetGame();
  render();
}
function render() {
  renderBoard();
  renderButtons();
  renderSavedGames();
}
function renderBoard() {
  var divBoard = document.querySelector("#megasena-board");
  divBoard.innerHTML = "";

  var ulNumbers = document.createElement("ul");
  ulNumbers.classList.add("numbers");

  for (let i = 1; i < state.board.length; i++) {
    var currentNumber = state.board[i];

    var liNumber = document.createElement("li");
    liNumber.textContent = currentNumber;
    liNumber.classList.add("number");

    liNumber.addEventListener("click", handleNumberClick);

    ulNumbers.appendChild(liNumber);

    if (numberInGame(currentNumber)) {
      liNumber.classList.add("selected");
    }
  }
  divBoard.appendChild(ulNumbers);
}
function handleNumberClick(event) {
  var value = Number(event.currentTarget.textContent);
  if (numberInGame(value)) {
    removeNumber(value);
  } else {
    addNumberToGame(value);
  }
  render();
}
function renderButtons() {
  var divButtons = document.querySelector("#bottom-controls");
  divButtons.innerHTML = "";

  var buttonNewGame = createNewGameButton();
  var buttonRadomGame = createRadomGameButton();
  var buttonSaveGame = createSaveGameButton();
  var buttonClearMemory = createClearButton();
  divButtons.appendChild(buttonNewGame);
  divButtons.appendChild(buttonRadomGame);
  divButtons.appendChild(buttonSaveGame);
  divButtons.appendChild(buttonClearMemory);
}
function createRadomGameButton() {
  var button = document.createElement("button");
  button.textContent = "Jogo Aleatório";
  button.addEventListener("click", radomGame);
  return button;
}
function createNewGameButton() {
  var button = document.createElement("button");
  button.textContent = "Novo Jogo";
  button.addEventListener("click", newGame);
  return button;
}
function renderSavedGames() {
  var divSavedGames = document.querySelector("#megasena-saved-games");
  divSavedGames.innerHTML = "";

  if (state.savedGames.length === 0) {
    divSavedGames.innerHTML = "<p> Nenhum jogo salvo <p/>";
  } else {
    var ulSavedGames = document.createElement("ul");

    for (var i = 0; i < state.savedGames.length; i++) {
      var currentGame = state.savedGames[i];

      var liGame = document.createElement("li");
      liGame.classList.add("savedGame");

      liGame.textContent = currentGame.join(" | ");

      ulSavedGames.appendChild(liGame);
    }
    divSavedGames.appendChild(ulSavedGames);
  }
}
function createClearButton() {
  var button = document.createElement("button");
  button.textContent = "Limpar Jogos Salvos";
  button.classList.add("clear-btn");
  button.disabled = !state.savedGames.length;
  button.addEventListener("click", clearMemory);
  return button;
}
function clearMemory() {
  localStorage.removeItem("saved-games");
  state.savedGames = [];
  render();
}
function addNumberToGame(numberToAdd) {
  if (isGameComplete()) {
    console.error("O jogo está completo");
    alert("O jogo está completo");
    return;
  }
  state.currentGame.push(numberToAdd);
}
function createSaveGameButton() {
  var button = document.createElement("button");
  button.textContent = "Salvar Jogo";
  button.addEventListener("click", saveGame);
  button.disabled = !isGameComplete();
  return button;
}
function numberInGame(numberToCheck) {
  return state.currentGame.includes(numberToCheck);
}
function removeNumber(numberToRemove) {
  var newGame = [];
  for (let i = 0; i < state.currentGame.length; i++) {
    var currentNumber = state.currentGame[i];
    if (currentNumber === numberToRemove) {
      continue;
    }
    newGame.push(currentNumber);
  }
  state.currentGame = newGame;
  render();
}
function saveGame() {
  if (!isGameComplete()) {
    console.error("Selecione ao menos 6 numeros");
    alert("Selecione ao menos 6 numeros");
    return;
  }
  state.savedGames.push(state.currentGame);
  writeToLocalStorage();
  newGame();
}
function isGameComplete() {
  return state.currentGame.length === 6;
}
function resetGame() {
  return (state.currentGame = []);
}
function radomGame() {
  resetGame();
  while (!isGameComplete()) {
    var radomNumber = Math.ceil(Math.random() * 60);
    addNumberToGame(radomNumber);
  }
  render();
}
start();
