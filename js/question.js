class Question {
	constructor(wordGerman, wordFrench) {
		this.word = {
			'de': wordGerman,
			'fr': wordFrench
		}
		
		this.language = 'de';
	}

	/**
	 * Set the current language. The language is set randomly if no parameter is given.
	 * @param {string} language ISO 639-1 code of the desired language.
	 */
	setLanguage(language = '') {
		if (typeof language === 'string') {
			switch (language) {
				case 'de':
					this.language = 'de';
					break;
				case 'fr':
					this.language = 'fr';
					break;
				default:
					// Randomly set the language.
					var languages = ['de', 'fr'];
					var index = Math.floor(Math.random() * languages.length);
					this.language = languages[index];
			}
		}
	}

	getWord() {
		return this.word[this.language];
	}

	getCorrectAnswers() {
		switch (this.language) {
			case 'de':
				return this.word['fr'];
			case 'fr':
				return this.word['de'];
		}
	}

	verifyAnswer(answer) {
		var args = new VerifiedAnswerArgs();

		if (typeof answer === 'string') {
			// Normalize the answer in order not to take into account any accents.
			answer = answer.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			answer = answer.replace('ß', 'ss');
			answer = answer.replace("'", " ");

			// Format the string variable to make it all lowercase letters.
			answer = answer.toLowerCase();

			var answerWithoutWhitespaces = answer.replace(' ', '');

			// The answer is an empty string.
			if (answerWithoutWhitespaces === '') {
				// The answer is not correct.
				return args;
			}

			var correctAnswers = Array.from(this.getCorrectAnswers());

			// Foreach correct answer.
			for (var i = 0; i < correctAnswers.length; i++) {
				var correctAnswer = correctAnswers[i];

				correctAnswer = correctAnswer.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
				correctAnswer = correctAnswer.replace('ß', 'ss');
				correctAnswer = correctAnswer.replace("'", " ");
				correctAnswer = correctAnswer.toLowerCase();

				correctAnswers[i] = correctAnswer;

				// If the answer is a perfect match, return true.
				if (answer == correctAnswer) {
					// The answer is correct.
					args.correct = true;
					args.correctAnswersIndex = i;
					return args;
				}
			}

			// Every answer that requires the function to go below this line
			// is an answer that is necessarily composed of more than one word.

			// Create an array containing each word from the answer.
			var answerSplits = answer.split(' ');

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
			var correctAnswersIndex = 0;

			// Foreach word in the player's answer.
			for (var i = 0; i < answerSplits.length; i++) {
				// Foreach correct answer in the array of correct answers.
				for (var j = 0; j < correctAnswersSplits.length; j++) {
					// Foreach word in the current correct answer.
					for (var k = 0; k < correctAnswersSplits[j].length; k++) {
						if (answerSplits[i] === correctAnswersSplits[j][k]) {
							correctCount++;
							correctAnswersIndex = j;
						}
					}
				}
			}

			if (correctCount >= 2) {
				// The answer is correct.
				args.correct = true;
				args.correctAnswersIndex = correctAnswersIndex;
				return args;
			}
		}

		return args;
	}
}