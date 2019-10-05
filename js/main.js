/**
 * Loads the vocabulary.html page and sends the specified filename as a parameter.
 * @param {string} path 
 */
function play(filename) {
	if (typeof filename === 'string') {
		location.href = `quiz.html?f=${filename}`;
	}
}
