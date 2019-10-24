class Quiz {
	constructor(paths, headerInstruction, headerWord, textInput, buttonInput) {
		this.questions = this.getQuestionsFromLists(paths);
		this.index = 0;

		// Used to determine which action the button should do when pressed.
		// If set to false: The answer the player has entered will be verified.
		// If set to true: The game will load a new question.
		this.playerAnswered = false;
		
		this.headerInstruction = headerInstruction;
		this.headerWord = headerWord;
		this.textInput = textInput;
		this.buttonInput = buttonInput;
	}

	/**
	 * Return the words array of a list.
	 * @param {string} path Path of the desired list.
	 */
	getWordsFromList(path) {
		if (typeof path === 'string') {
			var request = new XMLHttpRequest();
			request.open("GET", path, false);
			request.send(null);
			var list = JSON.parse(request.responseText);
			return list.words;
		} else {
			return null;
		}
	}

	/**
	 * Return an array of questions.
	 * @param {*} paths Array of paths each leading to a list.
	 */
	getQuestionsFromLists(paths) {
		var questions = [];
		paths.forEach(path => {
			var words = this.getWordsFromList(path);
			if (typeof words !== 'undefined') {
				words.forEach(word => {
					var question = new Question(word.de, word.fr);
					questions.push(question);
				});
			}
		});
		return questions;
	}

	/**
	 * Load a question from the questions array.
	 * @param {number} index Index of the desired question.
	 * If left empty, it will be set to a random number.
	 */
	loadQuestion(index = Math.floor(Math.random() * this.questions.length)) {
		this.index = index;
		// Randomly set the language of the question.
		this.questions[this.index].setLanguage();
		this.playerAnswered = false;

		this.resetUserInterface();

		// Choose a random possibility from the question's word.
		var possibilities = this.questions[this.index].getWord();
		var randomIndex = Math.floor(Math.random() * possibilities.length);

		// Update the user interface.
		switch (this.questions[this.index].language) {
			case 'de':
				this.headerInstruction.innerHTML = 'Traduis en français :';
				break;
			case 'fr':
				this.headerInstruction.innerHTML = 'Traduis en allemand :';
				break;
		}
		this.headerWord.lang = this.questions[this.index].language;
		this.headerWord.innerHTML = `${possibilities[randomIndex]}`;
	}

	/**
	 * Triggered when the player presses the 'Verify' or 'Continue' buttons.
	 * Verify the player's answer or load a new question depending on the 'playerAnswered' variable.
	 */
	onClick() {
		switch (this.playerAnswered) {
			// If the player has not already answered the question, verify their answer.
			case false:
				this.playerAnswered = true;

				var args = this.questions[this.index].verifyAnswer(this.textInput.value);
				
				// Update the user interface.
				if (args.correct) {
					var correctAnswer = this.questions[this.index].getCorrectAnswers()[args.correctAnswersIndex];
					
					this.headerInstruction.style.color = '#239b46';
					this.headerWord.style.color = '#239b46';

					this.headerInstruction.innerHTML = `La bonne réponse est en effet : ${correctAnswer}`;
					this.headerWord.innerHTML = 'Correct !';
				} else {
					var correctAnswer = this.questions[this.index].getCorrectAnswers()[0];
					this.headerInstruction.style.color = '#c83c3c';
					this.headerWord.style.color = '#c83c3c';

					this.headerInstruction.innerHTML = `La bonne réponse est : ${correctAnswer}`;
					this.headerWord.innerHTML = 'Incorrect !';
				}
				this.textInput.disabled = true;
				this.buttonInput.innerHTML = 'Continuer';
				this.buttonInput.focus();
				break;
			// If the player already answered the question, load a new one.
			case true:
				this.loadQuestion();
				break;
		}
	}

	/**
	 * Reset the user interface upon a new question being loaded.
	 */
	resetUserInterface() {
		this.headerInstruction.style.color = 'black';
		this.headerWord.style.color = 'black';

		this.textInput.disabled = false;
		this.textInput.value = '';
		this.textInput.focus();

		this.buttonInput.innerHTML = 'Vérifier';
	}
}
