class Quiz {
  constructor(questions) {
    this.questions = questions;
    this.index = 0;
    this.stats = {
      correctCount: 0,
      answeredCount: 0
    }
  }

  /**
   * Load a question from the questions array.
   * @param {number} index Index of the desired question.
   * If left empty, it will be set to a random number.
   */
  loadQuestion(index = Math.floor(Math.random() * this.questions.length)) {
    while (index === this.index) {
      // Reroll the index in order not to prompt the user with the same question.
      index = Math.floor(Math.random() * this.questions.length);
    }

    this.index = index;

    if (typeof this.questions[this.index] !== 'undefined') {
      // Randomly set the question's language.
      this.questions[this.index].setLanguage();
      return true;
    }

    return false;
  }

  /**
   * Verify the player's answer.
   * @param {string} answer 
   */
  answerQuestion(answer) {
    if (typeof answer === 'string') {
      const args = this.questions[this.index].verifyAnswer(answer);
      if (args.correct) {
        this.stats.correctCount++;
      }
      this.stats.answeredCount++;
      return args;
    }
    return null;
  }
}
