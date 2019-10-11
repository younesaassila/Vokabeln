class Quiz {
	constructor(lists) {
		this.questions = this.getQuestions(lists);
		this.playerAnswered = false;
		this.index = 0;
		
		this.header = document.getElementById("header-vocabulary");
		this.textInput = document.getElementById("textbox-answer");
		this.buttonInput = document.getElementById("button-answer");
	}

	/**
	 * Return the words array from a list object.
	 * @param {string} path Path of the list.
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
	 * Return an array of questions made from each of the words array in the given lists.
	 * @param {*} lists 
	 */
	getQuestions(lists) {
		var questions = [];

		lists.forEach(list => {
			var listWords = this.getWordsFromList(list);
			if (typeof listWords !== 'undefined') {
				listWords.forEach(word => {
					var question = new Question(word.de, word.fr);
					questions.push(question);
				});
			}
		});

		return questions;
	}

	/**
	 * Load a random question from the questions array and update the user interface.
	 * @param {number} index The index of the chosen question in the questions array.
	 * If empty, this value is random.
	 */
	loadQuestion(index = Math.floor(Math.random() * this.questions.length)) {
		this.index = index;
		this.questions[this.index].setLanguage();

		// Reset the user interface.
		this.reset();

		// Select a random word from the words the question contains for the current language.
		// This is the case as most words have equivalents.
		var wordArray = this.questions[this.index].getWord();
		var randomWordIndex = Math.floor(Math.random() * wordArray.length);

		// Update the user interface.
		switch (this.questions[this.index].language) {
			case 'de':
				this.header.innerHTML = `${wordArray[randomWordIndex]} → Français`;
				break;
			case 'fr':
				this.header.innerHTML = `${wordArray[randomWordIndex]} → Deutsch`;
				break;
		}
	}

	onButtonClick() {
		switch (this.playerAnswered) {
			case false:
				var args = this.questions[this.index].verifyAnswer(this.textInput.value);
				this.playerAnswered = true;

				if (args.correct) {
					var correctAnswer = this.questions[this.index].getCorrectAnswers()[answer.correctAnswersIndex];
					this.header.style.color = '#239b46';
					this.header.innerHTML = `Correct ! La bonne réponse est en effet : ${correctAnswer}`;
				} else {
					var correctAnswer = this.questions[this.index].getCorrectAnswers()[0];
					this.header.style.color = '#c83c3c';
					this.header.innerHTML = `Incorrect, la bonne réponse est : ${correctAnswer}`;
				}

				this.textInput.disabled = true;
				this.buttonInput.innerHTML = 'Continuer';
				this.buttonInput.focus();
				break;
			case true:
				this.loadQuestion();
				break;
		}
	}

	reset() {
		this.playerAnswered = false;

		this.header.style.color = 'black';
		this.textInput.disabled = false;
		this.textInput.value = '';
		this.textInput.focus();
		this.buttonInput.innerHTML = 'Vérifier';
	}
}
