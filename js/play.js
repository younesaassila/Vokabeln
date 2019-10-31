
const parameters = new URLSearchParams(window.location.search);
const id = parameters.get('id');

let quiz;

if (typeof id !== 'undefined') {
	const dataAccess = new DataAccess();
	const paths = dataAccess.getPaths(id);

	const headerInstruction = document.getElementById("instruction");
	const headerWord = document.getElementById("word");
	const textInput = document.getElementById("text-input");
	const buttonInput = document.getElementById("button-input");

	if ((typeof paths !== 'undefined')
	&& (typeof headerInstruction !== 'undefined')
	&& (typeof headerWord !== 'undefined')
	&& (typeof textInput !== 'undefined')
	&& (typeof buttonInput !== 'undefined')) {
		quiz = new Quiz(paths, headerInstruction, headerWord, textInput, buttonInput);
		quiz.loadQuestion();

		const wordCount = quiz.questions.length;
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
