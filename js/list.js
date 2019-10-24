
const parameters = new URLSearchParams(window.location.search);
var id = parameters.get('id');

if (typeof id !== 'undefined') {
	var dataAccess = new DataAccess();
	var paths = dataAccess.getPaths(id);
	var lists = [];
	var container = document.getElementById("container");
	var wordCount = 0;

	paths.forEach(path => {
		lists.push(dataAccess.getListFromPath(path));
	});

	lists.forEach(list => {
		var section = document.createElement("section");

		// Create a header for each list displaying the list's name.
		var header = document.createElement("h2");
		header.innerHTML = list.name;
		section.appendChild(header);

		// Create a table for each list containing every word.
		var table = document.createElement("table");

		list.words.forEach(word => {
			var tr = document.createElement("tr");
			var tdGerman = document.createElement("td");
			var tdFrench = document.createElement("td");
			tdGerman.className = "td-german";
			tdFrench.className = "td-french";

			var tdGermanTextNode = document.createTextNode(word.de[0]);
			var tdFrenchTextNode = document.createTextNode(word.fr[0]);
			tdGerman.appendChild(tdGermanTextNode);
			tdFrench.appendChild(tdFrenchTextNode);

			tr.appendChild(tdGerman);
			tr.appendChild(tdFrench);
			table.appendChild(tr);

			wordCount++;
		});

		section.appendChild(table);
		container.appendChild(section);
	});

	document.title += ` (${wordCount} mots)`;
} else {
	location.href = 'index.html';
}
