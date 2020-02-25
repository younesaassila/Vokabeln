// Get the id provided by the url to know what files to load.
const parameters = new URLSearchParams(window.location.search);
const id = parameters.get('id');

// Get all paths associated with the id we just obtained.
const dataAccess = new DataAccess();
const paths = dataAccess.getPaths(id);

// HTML elements in the quiz section.
const quizContainer = document.querySelector("#quiz-container");
const quizInstruction = document.querySelector(".quiz-instruction");
const quizWord = document.querySelector(".quiz-word");
const quizTextInput = document.querySelector("#quiz-text-input");
const quizButton = document.querySelector("#quiz-button-input");
const endQuizButton = document.querySelector("#quiz-end-button");
// HTML elements in the results section.
const resultsContainer = document.querySelector("#results-container");
const resultsScore = document.querySelector("#results-score");
const resultsDetails = document.querySelector("#results-details");

// Get an array of questions from the newly gotten paths and create a new quiz.
const questions = dataAccess.getQuestionsFromListPaths(paths);
const quiz = new Quiz(questions);

// Declare all game states.
const states = {
  // A new question has been loaded and the player has yet to answer it.
  ANSWERING: 'answering',
  // The player has answered the question and is provided with the correct answer.
  ANSWERED: 'answered'
};

// The current state of the game.
let state = states.ANSWERING;

// Reset the UI and display a newly loaded question.
const loadQuestion = () => {
  state = states.ANSWERING;

  // Reset the UI as some elements may have been disabled due to the ANSWERED state.
  quizInstruction.className = "quiz-instruction";
  quizWord.className = "quiz-word";
  quizTextInput.disabled = false;
  quizTextInput.value = "";
  quizTextInput.focus();
  quizButton.innerHTML = "Vérifier";

  // Question has successfully loaded.
  if (quiz.loadQuestion()) {
    // Choose a random variant of the question's word.
    const variants = quiz.questions[quiz.index].getWord();
    const randomVariantIndex = Math.floor(Math.random() * variants.length);

    switch (quiz.questions[quiz.index].language) {
      case "de":
        quizInstruction.innerHTML = "Traduis en français :";
        break;
      case "fr":
        quizInstruction.innerHTML = "Traduis en allemand :";
        break;
    }

    quizWord.lang = quiz.questions[quiz.index].language;
    quizWord.innerHTML = `${variants[randomVariantIndex]}`;
  } else {
    throw new Error("Question couldn't successfully be loaded.");
  }
};

// Change the UI colors and display the correct answer.
const answerQuestion = () => {
  state = states.ANSWERED;

  const args = quiz.answerQuestion(quizTextInput.value);

  if (typeof args !== 'undefined') {
    // The player answered correctly.
    if (args.correct) {
      quizInstruction.className += " correct";
      quizWord.className += " correct";
      
      quizInstruction.innerHTML = "Correct ! La bonne réponse est en effet :";
      quizWord.innerHTML = `${args.correctAnswer}`;
    } else {
      quizInstruction.className += " incorrect";
      quizWord.className += " incorrect";
      
      quizInstruction.innerHTML = "Incorrect ! La bonne réponse est :";
      quizWord.innerHTML = `${args.correctAnswer}`;
    }

    endQuizButton.disabled = false;
    quizTextInput.disabled = true;
    quizButton.innerHTML = "Continuer";
    quizButton.focus();
  } else {
    throw new Error(
      "The quiz object has returned 'undefined' when asked to verify the user's answer."
    );
  }
};

// Display the number of questions in the browser tab's title.
const wordCount = quiz.questions.length;
document.title += ` (${wordCount} mots)`;

// Add a click event to the main button.
quizButton.addEventListener("click", (event) => {
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
      quizButton.click();
      break;
    default:
      // Quit when this doesn't handle the key event.
      return;
  }
  // Cancel the default action to avoid it being handled twice.
  event.preventDefault();
}, true);

endQuizButton.addEventListener("click", (event) => {
  if (event.button === 0) {
    quizContainer.style.display = "none";
    const scoreOn20 = Math.floor((quiz.stats.correctCount / quiz.stats.answeredCount * 20) * 10) / 10;
    resultsScore.innerHTML = `${scoreOn20}/20`;
    resultsDetails.innerHTML = `Tu as répondu correctement à ${quiz.stats.correctCount} questions sur ${quiz.stats.answeredCount}.`;
    resultsContainer.style.display = "block";
  }
}, false);

// Start the game!
endQuizButton.disabled = true;
loadQuestion();
