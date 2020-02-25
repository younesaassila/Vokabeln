class Question {
  constructor(germanWord, frenchWord) {
    this.word = {
      'de': germanWord,
      'fr': frenchWord
    };
    
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
        return this.word.fr;
      case 'fr':
        return this.word.de;
    }
  }

  /**
   * Used for answer verification in order to normalize a string that may be
   * containing special characters.
   * @param {string} str 
   */
  normalizeString(str) {
    let normalized = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    normalized = normalized.toLowerCase();
    normalized = normalized.replace(/ß/g, 'ss');
    normalized = normalized.replace(/œ/g, 'oe');
    normalized = normalized.replace(/'/g, ' ');
    normalized = normalized.replace(/’/g, ' ');
    
    normalized = normalized.trim();
    return normalized;
  }

  /**
   * Verify the given answer and return arguments specifying the details.
   * @param {string} answer The player's answer.
   */
  verifyAnswer(answer) {
    const args = new VerifiedAnswerArgs();

    // Verify that the answer is a string.
    if (typeof answer === 'string') {
      // Normalize the answer in order to not take into account any
      // language-specific characters.
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
      const answerWords = answer.split(' ');

      // Create an array of arrays each containing every word from a correct answer.
      const correctAnswersWords = new Array();
      for (let correctAnswer of correctAnswers) {
        correctAnswersWords.push(correctAnswer.split(' '));
      }

      // The number of words the player got correctly.
      // This number must be equal or greater than 1 in order to return correct.
      let correctAnswerWordCount = 0;
      let correctAnswerIndex = 0;

      // For each correct answer.
      for (let [index, correctAnswerWords] of correctAnswersWords.entries()) {
        // For each word of the current correct answer.
        for (let correctAnswerWord of correctAnswerWords) {
          // For each word of the player's answer.
          for (let answerWord of answerWords) {
            // If the current player answer's word and current correct answer's
            // word match, increase the correct answer word count.
            if (answerWord === correctAnswerWord) {
              correctAnswerWordCount++;
              correctAnswerIndex = index;
            }
          }
        }
      }

      // The number of words that returned correct in the player's answer has
      // to be at least half of the correct answer word count.
      let threshold = Math.round(correctAnswersWords[correctAnswerIndex].length / 2);
      
      // In case the threshold is lower than 1, set it to 1 to avoid marking
      // an answer as correct if it's not necessarily. 
      if (threshold < 1) {
        threshold = 1;
      }

      if (correctAnswerWordCount >= threshold) {
        // The answer is considered correct.
        args.correct = true;
        args.correctAnswer = this.getCorrectAnswers()[correctAnswerIndex];
        return args;
      }
    }

    // The answer is wrong.
    args.correct = false;
    args.correctAnswer = this.getCorrectAnswers()[0];
    return args;
  }
}
