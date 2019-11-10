// Get the id provided by the url to know what files to load.
const parameters = new URLSearchParams(window.location.search);
const id = parameters.get('id');

// Get all paths associated with the id we just obtained.
const dataAccess = new DataAccess();
const paths = dataAccess.getPaths(id);

// HTML elements the script needs.
const instructionElement = document.querySelector(".quiz-instruction");
const wordElement = document.querySelector(".quiz-word");
const textInputElement = document.querySelector(".quiz-text-input");
const buttonInputElement = document.querySelector(".quiz-button-input");

// Get an array of questions from the newly gotten paths and create a new quiz.
const questions = dataAccess.getQuestionsFromListPaths(paths);
const quiz = new Quiz(questions);

// Declare all game states.
const states = {
  // A new question has been loaded and the player has yet to answer it.
  ANSWERING: 'answering',
  // The player has answered the question and is provided with the correct answer.
  ANSWERED: 'answered'
}

// The current state of the game.
let state = states.ANSWERING;

// Reset the UI and display a newly loaded question.
const loadQuestion = () => {
  state = states.ANSWERING;

  // Reset the UI as some elements may have been disabled due to the ANSWERED state.
  instructionElement.className = "quiz-instruction";
  wordElement.className = "quiz-word";
  textInputElement.disabled = false;
  textInputElement.value = "";
  textInputElement.focus();
  buttonInputElement.innerHTML = "Vérifier";

  // Question has successfully loaded.
  if (quiz.loadQuestion()) {
    // All of the word's variants.
    const variants = quiz.questions[quiz.index].getWord();

    switch (quiz.questions[quiz.index].language) {
      case "de":
        instructionElement.innerHTML = "Traduis en français :";
        break;
      case "fr":
        instructionElement.innerHTML = "Traduis en allemand :";
        break;
    }

    wordElement.lang = quiz.questions[quiz.index].language;
    wordElement.innerHTML = `${variants[0]}`;
  } else {
    throw new Error("Question couldn't successfully be loaded.");
  }
}

// Change the UI colors and display the correct answer.
const answerQuestion = () => {
  state = states.ANSWERED;

  const args = quiz.answerQuestion(textInputElement.value);

  if (typeof args !== 'undefined') {
    // The player answered correctly.
    if (args.correct) {
      instructionElement.className += " correct";
      wordElement.className += " correct";
      
      instructionElement.innerHTML = "Correct ! La bonne réponse est en effet :";
      wordElement.innerHTML = `${args.correctAnswer}`;
    } else {
      instructionElement.className += " incorrect";
      wordElement.className += " incorrect";
      
      instructionElement.innerHTML = "Incorrect ! La bonne réponse est :";
      wordElement.innerHTML = `${args.correctAnswer}`;
    }

    textInputElement.disabled = true;
    buttonInputElement.innerHTML = "Continuer";
    buttonInputElement.focus();
  } else {
    throw new Error(
      "The quiz object has returned 'undefined' when asked to verify the user's answer."
    );
  }
}

// Display the number of questions in the browser tab's title.
const wordCount = quiz.questions.length;
document.title += ` (${wordCount} mots)`;

// Add a click event to the main button.
buttonInputElement.addEventListener("click", (event) => {
  if (event.button === 0) {
    switch (state) {
      case states.ANSWERING:
        answerQuestion();
        break;
      case states.ANSWERED:
        loadQuestion();
        break;
    }
  }
}, false);

// Get keyboard input in order to click on the button when the player presses Enter.
window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) {
    // Do nothing if the event was already processed.
    return;
  }
  switch (event.key) {
    case "Enter":
      buttonInputElement.click();
      break;
    default:
      // Quit when this doesn't handle the key event.
      return;
  }
  // Cancel the default action to avoid it being handled twice.
  event.preventDefault();
}, true);

// Start the game!
loadQuestion();
