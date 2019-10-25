
const parameters = new URLSearchParams(window.location.search);
var id = parameters.get('id');

if (typeof id !== 'undefined') {
	var dataAccess = new DataAccess();
	var paths = dataAccess.getPaths(id);

	var headerInstruction = document.getElementById("instruction");
	var headerWord = document.getElementById("word");
	var textInput = document.getElementById("text-input");
	var buttonInput = document.getElementById("button-input");

	if ((typeof paths !== 'undefined')
	&& (typeof headerInstruction !== 'undefined')
	&& (typeof headerWord !== 'undefined')
	&& (typeof textInput !== 'undefined')
	&& (typeof buttonInput !== 'undefined')) {
		var quiz = new Quiz(paths, headerInstruction, headerWord, textInput, buttonInput);
		quiz.loadQuestion();

		var wordCount = quiz.questions.length;
		document.title += ` (${wordCount} mots)`;

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
		headerInstruction.innerHTML = `Une erreur est survenue lors du chargement du quiz.`;
		headerWord.innerHTML = `Oops!`;
	}
} else {
	headerInstruction.innerHTML = `Aucun chemin d'accès ne correspond à l'identifiant donné.`;
	headerWord.innerHTML = `Oops!`;
}
