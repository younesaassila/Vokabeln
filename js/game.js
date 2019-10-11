const parameters = new URLSearchParams(window.location.search);

var files = parameters.get('f');

// The filename parameter is present in the query string.
if (files != null) {
	var lists = files.split(',');
	
	for (var i = 0; i < lists.length; i++) {
		lists[i] = `lists/${lists[i]}`;
	}

	// Create a new quiz object.
	var quiz = new Quiz(lists);
	quiz.loadQuestion();

	// Get keyboard input.
	window.addEventListener("keydown", function (event) {
		if (event.defaultPrevented) {
			// Do nothing if the event was already processed.
			return;
		}
		
		switch (event.key) {
		case "Enter":
			quiz.onButtonClick();
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
