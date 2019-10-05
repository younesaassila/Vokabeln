class Quiz {
	constructor(path) {
		this.vocabulary = this.getVocabulary(path);
		this.headerText = document.getElementById("header-vocabulary");
		this.answerTextbox = document.getElementById("textbox-answer");
		this.answerButton = document.getElementById("button-answer");

		// Index of the current word in the vocabulary array.
		this.index = 0;
		// Language of the current word.
		this.language = 'fr';
		// Set to true when a question has been answered.
		this.answered = false;
	}

	/**
	 * Returns the vocabulary array from a list object.
	 * @param {string} path Path of the list JSON object.
	 */
	getVocabulary(path) {
		if (typeof path === 'string') {
			var request = new XMLHttpRequest();
			request.open("GET", path, false);
			request.send(null);
			var list = JSON.parse(request.responseText);
			document.title = `Vokabeln! ‒ ${list.name}`;
			return list.vocabulary;
		}
	}

	next() {
		// Select a random language.
		var languages = ['de', 'fr'];
		var randomLanguage = Math.floor(Math.random() * languages.length)
		this.language = languages[randomLanguage];

		// Select a random word from the vocabulary array.
		while (true) {
			var randomIndex = Math.floor(Math.random() * this.vocabulary.length);

			if (typeof this.index === null) {
				this.index = 0;
			}

			if (randomIndex != this.index) {
				this.index = Math.floor(Math.random() * this.vocabulary.length);
				break;
			}
		}

		this.answered = false;
		this.headerText.style.color = 'black';
		this.answerTextbox.disabled = false;
		this.answerTextbox.value = '';
		this.answerTextbox.focus();
		this.answerButton.innerHTML = 'Vérifier';

		switch (this.language) {
			case 'de':
				var words = this.vocabulary[this.index].de;
				var randomWord = Math.floor(Math.random() * words.length);
				this.headerText.innerHTML = `${words[randomWord]} → Français`;
				break;
			case 'fr':
				var words = this.vocabulary[this.index].fr;
				var randomWord = Math.floor(Math.random() * words.length);
				this.headerText.innerHTML = `${words[randomWord]} → Deutsch`;
				break;
		}
	}

	/**
	 * Triggered when the player clicks on the answer/continue button
	 * or when it hits the ENTER key on its keyboard.
	 */
	onButtonClick() {
		switch (this.answered) {
			case false:
				var answer = this.setAnswerValues(new Answer(this.answerTextbox.value));
				this.answered = true;

				if (answer.isCorrect) {
					this.headerText.style.color = '#239b46';
					// TODO: Display the answer the player has given in the case of an array of more than one element.
					this.headerText.innerHTML = `Correct ! La bonne réponse est en effet : ${this.getCorrectAnswerArray()[answer.correctAnswerIndex]}`;
				} else {
					this.headerText.style.color = '#c83c3c';
					this.headerText.innerHTML = `Incorrect, la bonne réponse est : ${this.getCorrectAnswerArray()[0]}`;
				}

				this.answerTextbox.disabled = true;
				this.answerButton.innerHTML = 'Continuer';
				this.answerButton.focus();
				break;
			case true:
				this.next();
				break;
		}
	}

	/**
	 * Returns whether the given answer string is correct or not.
	 * @param {string} answer 
	 */
	setAnswerValues(answer) {
		var answerValue = answer.value;

		if (typeof answerValue === 'string') {
			// Normalize the answer in order not to take into account any accents.
			answerValue = answerValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			answerValue = answerValue.replace('ß', 'ss');
			answerValue = answerValue.replace("'", " ");

			// Format the string variable to make it all lowercase letters.
			answerValue = answerValue.toLowerCase();

			var answerWithoutWhitespaces = answerValue.replace(' ', '');

			// The answer is an empty string.
			if (answerWithoutWhitespaces === '') {
				// The answer is not correct.
				return answer;
			}

			var correctAnswers = Array.from(this.getCorrectAnswerArray());

			// Foreach correct answer.
			for (var i = 0; i < correctAnswers.length; i++) {
				var correctAnswer = correctAnswers[i];

				correctAnswer = correctAnswer.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
				correctAnswer = correctAnswer.replace('ß', 'ss');
				correctAnswer = correctAnswer.replace("'", " ");
				correctAnswer = correctAnswer.toLowerCase();

				correctAnswers[i] = correctAnswer;

				// If the answer is a perfect match, return true.
				if (answerValue == correctAnswer) {
					// The answer is correct.
					answer.isCorrect = true;
					answer.correctAnswerIndex = i;
					return answer;
				}
			}

			// Every answer that requires the function to go below this line
			// is an answer that is necessarily composed of more than one word.

			// Create an array containing each word from the answer.
			var answerSplits = answerValue.split(' ');

			// Create an array of arrays each containing each word from a correct answer.
			var correctAnswersSplits = new Array();

			// Foreach element of the correct answers array.
			for (var i = 0; i < correctAnswers.length; i++) {
				var correctAnswer = correctAnswers[i];
				var correctAnswerSplits = correctAnswer.split(' ');

				correctAnswersSplits.push(correctAnswerSplits);
			}

			// The number of words the player got correctly.
			// This number must be equal or greater than 2 in order to return true;
			var correctCount = 0;
			var correctAnswerIndex = 0;

			// Foreach word in the player's answer.
			for (var i = 0; i < answerSplits.length; i++) {
				// Foreach correct answer in the array of correct answers.
				for (var j = 0; j < correctAnswersSplits.length; j++) {
					// Foreach word in the current correct answer.
					for (var k = 0; k < correctAnswersSplits[j].length; k++) {
						if (answerSplits[i] === correctAnswersSplits[j][k]) {
							correctCount++;
							correctAnswerIndex = j;
						}
					}
				}
			}

			if (correctCount >= 2) {
				// The answer is correct.
				answer.isCorrect = true;
				answer.correctAnswerIndex = correctAnswerIndex;
				return answer;
			}
		}

		return answer;
	}

	/**
	 * Returns the correct answer array for the current question depending on the current language.
	 */
	getCorrectAnswerArray() {
		switch (this.language) {
			case 'de':
				return this.vocabulary[this.index].fr;
			case 'fr':
				return this.vocabulary[this.index].de;
		}
	}
}
