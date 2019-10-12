
const parameters = new URLSearchParams(window.location.search);
var parameter = parameters.get('p');

// The filename parameter is present in the query string.
if (typeof parameter !== 'undefined') {
	var paths = parameter.split(',');
	
	// Create a new quiz object.
	var quiz = new Quiz(paths);
	quiz.loadQuestion();

	// Get keyboard input.
	window.addEventListener("keydown", function (event) {
		if (event.defaultPrevented) {
			// Do nothing if the event was already processed.
			return;
		}
		
		switch (event.key) {
		case "Enter":
			quiz.onClick();
			break;
		default:
			// Quit when this doesn't handle the key event.
			return;
		}

		// Cancel the default action to avoid it being handled twice.
		event.preventDefault();
	}, true);
} else {
	location.href = `index.html`;
}
