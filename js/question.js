class Question {
  constructor(germanWord, frenchWord) {
    this.word = {
      'de': germanWord,
      'fr': frenchWord
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
          const languages = ['de', 'fr'];
          const index = Math.floor(Math.random() * languages.length);
          this.language = languages[index];
      }
    }
  }

  /**
   * Return the question's word for the current language.
   */
  getWord() {
    return this.word[this.language];
  }

  /**
   * Return the question's answer depending on the current language.
   */
  getCorrectAnswers() {
    switch (this.language) {
      case 'de':
        return this.word['fr'];
      case 'fr':
        return this.word['de'];
    }
  }

  /**
   * Used for answer verification in order to normalize a string that may be
   * containing special characters.
   * @param {string} str 
   */
  normalizeString(str) {
    let normalized = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    normalized = normalized.replace(/ß/g, 'ss');
    normalized = normalized.replace(/œ/g, 'oe');
    normalized = normalized.replace(/'/g, ' ');
    normalized = normalized.replace(/’/g, ' ');
    normalized = normalized.toLowerCase();
    normalized = normalized.trim();
    return normalized;
  }

  /**
   * Verify the given answer and return arguments specifying the details.
   * @param {string} answer The player's answer.
   */
  verifyAnswer(answer) {
    const args = new VerifiedAnswerArgs();

    if (typeof answer === 'string') {
      // Normalize the answer in order not to take into account any accents.
      answer = this.normalizeString(answer);

      // Test if the user's answer is an empty string.
      // If true, then the answer is not correct.
      if (answer === '') {
        args.correct = false;
        args.correctAnswer = this.getCorrectAnswers()[0];
        return args;
      }

      const correctAnswers = Array.from(this.getCorrectAnswers());

      // Test for a perfect match with every correct answer.
      for (let [index, correctAnswer] of correctAnswers.entries()) {
        let normalized = this.normalizeString(correctAnswer);
        correctAnswers[index] = normalized;

        // It's a match!
        if (answer === correctAnswers[index]) {
          args.correct = true;
          args.correctAnswer = this.getCorrectAnswers()[index];
          return args;
        }
      }

      // Every answer that requires the function to go below this line
      // is an answer that is necessarily composed of more than one word.

      // Create an array containing each word from the answer.
      const answerSplits = answer.split(' ');

      // Create an array of arrays each containing every word from a correct answer.
      const correctAnswersSplits = new Array();
      for (let correctAnswer of correctAnswers) {
        const correctAnswerSplits = correctAnswer.split(' ');
        correctAnswersSplits.push(correctAnswerSplits);
      }

      // The number of words the player got correctly.
      // This number must be equal or greater than 2 in order to return correct.
      let correctCount = 0;
      let correctAnswersIndex = 0;

      // Foreach word in the player's answer.
      for (let i = 0; i < answerSplits.length; i++) {
        // Foreach correct answer in the array of correct answers.
        for (let j = 0; j < correctAnswersSplits.length; j++) {
          // Foreach word in the current correct answer.
          for (let k = 0; k < correctAnswersSplits[j].length; k++) {
            if (answerSplits[i] === correctAnswersSplits[j][k]) {
              correctCount++;
              correctAnswersIndex = j;
            }
          }
        }
      }

      // TODO: Change this threshold to be proportional to the number of words
      // the correct answer contains.
      if (correctCount >= 2) {
        // The answer is correct.
        args.correct = true;
        args.correctAnswer = this.getCorrectAnswers()[correctAnswersIndex];
        return args;
      }
    }

    // The answer is wrong.
    args.correct = false;
    args.correctAnswer = this.getCorrectAnswers()[0];
    return args;
  }
}
