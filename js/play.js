// Get the id provided by the url to know what files to load.
const parameters = new URLSearchParams(window.location.search);
const id = parameters.get('id');

// Reference the Firebase database used for feedback reports.
const database = firebase.database();

// Get all paths associated with the id we just obtained.
const dataAccess = new DataAccess();
const paths = dataAccess.getPaths(id);

//#region HTML elements references.

// HTML elements in the quiz section.
const quizContainer = document.querySelector("#quiz-container");
const quizInstruction = document.querySelector(".quiz-instruction");
const quizWord = document.querySelector(".quiz-word");
const quizTextInput = document.querySelector("#quiz-text-input");
const quizButton = document.querySelector("#quiz-button-input");
const endQuizButton = document.querySelector("#quiz-end-button");
// HTML elements for the feedback modal.
const feedbackButton = document.querySelector("#feedback-button");
const feedbackModal = document.querySelector("#feedback-modal");
const fbCloseButton = document.querySelector("#feedback-modal #close-button");
const fbOriginalTextInput = document.querySelector("#feedback-modal #input-original");
const fbTranslationsTextInput = document.querySelector("#feedback-modal #input-translations");
const fbSendButton = document.querySelector("#feedback-modal #send-button");
const fbBodyInputs = document.querySelector("#feedback-modal #body-inputs");
const fbBodySuccess = document.querySelector("#feedback-modal #body-success");
const fbBodyError = document.querySelector("#feedback-modal #body-error");
const fbOkayButton = document.querySelector("#feedback-modal #okay-button");
const fbRetryButton = document.querySelector("#feedback-modal #retry-button");
// HTML elements in the results section.
const resultsContainer = document.querySelector("#results-container");
const resultsScore = document.querySelector("#results-score");
const resultsDetails = document.querySelector("#results-details");

//#endregion

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

quizButton.addEventListener("click", event => {
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

quizTextInput.addEventListener("keydown", event => {
  if (event.defaultPrevented) {
    return;
  }
  switch (event.key) {
    case "Enter":
      quizButton.click();
      break;
    default:
      return;
  }
  event.preventDefault();
}, true);

// Display the feedback modal.
const showFeedbackModal = () => {
  if (state == states.ANSWERING) {
    quizButton.click();
  }
  // Show the view with text fields.
  fbBodyInputs.style.display = "block";
  fbBodySuccess.style.display = "none";
  fbBodyError.style.display = "none";
  // Set text fields values.
  fbOriginalTextInput.value = quiz.questions[quiz.index]
    .getWord().toString().replace(/,/g, ', ');
  fbTranslationsTextInput.value = quiz.questions[quiz.index]
    .getCorrectAnswers().toString().replace(/,/g, ', ');
  // Set the send button values.
  fbSendButton.disabled = false;
  fbSendButton.innerHTML = "Envoyer";
  // Display the modal.
  feedbackModal.style.display = "flex";
  fbOriginalTextInput.focus();
};
feedbackButton.addEventListener("click", showFeedbackModal);
feedbackButton.addEventListener("keydown", event => {
  if (event.defaultPrevented) {
    return;
  }
  switch (event.key) {
    case "Enter":
      showFeedbackModal();
      break;
    default:
      return;
  }
  event.preventDefault();
}, true);

// Close the feedback modal when clicking on the close or okay button.
const closeFeedbackModal = () => {
  feedbackModal.style.display = "none";
  quizButton.click();
};
fbCloseButton.addEventListener("click", closeFeedbackModal);
fbOkayButton.addEventListener("click", closeFeedbackModal);

// Check if one of the text fields is empty or whitespaces in order to disable
// the send button.
const feedbackInputUpdate = () => {
  fbSendButton.disabled = 
    (/^\s*$/).test(fbOriginalTextInput.value) || 
    (/^\s*$/).test(fbTranslationsTextInput.value);
};
fbOriginalTextInput.addEventListener("input", feedbackInputUpdate);
fbTranslationsTextInput.addEventListener("input", feedbackInputUpdate);

// Send the feedback report to the database.
fbSendButton.addEventListener("click", () => {
  // Disable the send button.
  fbSendButton.disabled = true;
  fbSendButton.innerHTML = "Envoi...";

  // Send request to the database.
  var newKey = database.ref().child('posts').push().key;
  database.ref(`/feedback-reports/${newKey}`).set({
    datetime: new Date().toString(),
    listID: id,
    quizIndex: quiz.index,
    original: quiz.questions[quiz.index].getWord().toString().replace(/,/g, ', '),
    translations: quiz.questions[quiz.index].getCorrectAnswers().toString().replace(/,/g, ', '),
    originalCorrected: fbOriginalTextInput.value,
    translationsCorrected: fbTranslationsTextInput.value
  })
  .then(() => {
    // Display the success message.
    fbBodyInputs.style.display = "none";
    fbBodySuccess.style.display = "block";
  })
  .catch(error => {
    // Display the error message.
    fbBodyInputs.style.display = "none";
    fbBodyError.style.display = "block";
    console.error(`${error.code}: ${error.message}`);
  });
});

fbRetryButton.addEventListener("click", () => {
  fbBodyError.style.display = "none";
  fbSendButton.disabled = false;
  fbSendButton.innerHTML = "Envoyer";
  fbBodyInputs.style.display = "block";
});

// Display the total score at the end of the quiz.
endQuizButton.addEventListener("click", event => {
  if (event.button === 0) {
    quizContainer.style.display = "none";
    const scoreOn20 = Math.floor((quiz.stats.correctCount / quiz.stats.answeredCount * 20) * 10) / 10;
    resultsScore.innerHTML = `${scoreOn20}/20`;
    resultsDetails.innerHTML = `Tu as répondu correctement à ${quiz.stats.correctCount} questions sur ${quiz.stats.answeredCount}.`;
    resultsContainer.style.display = "block";
  }
}, false);

// Log in the user anonymously.
firebase.auth().signInAnonymously().catch(error => {
  console.error(`${error.code}: ${error.message}`);
});

// Start the game!
endQuizButton.disabled = true;
loadQuestion();
