
const parameters = new URLSearchParams(window.location.search);
var id = parameters.get('id');

if (typeof id !== 'undefined') {
	var dataAccess = new DataAccess();
	var paths = dataAccess.getPaths(id);
	var lists = [];
	var container = document.getElementById("container");

	paths.forEach(path => {
		lists.push(dataAccess.getListFromPath(path));
	});

	lists.forEach(list => {
		// Create a header for each list displaying the list's name.
		var header = document.createElement("p");
		header.className = "header";
		header.innerHTML = list.name;
		container.appendChild(header);

		list.words.forEach(word => {
			// Create a table for each word displaying the word in German
			// and in French in separate cells.
			var table = document.createElement("table");
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
			container.appendChild(table);
		});

		// Break a line in order to add more spacing between lists.
		var br = document.createElement("br");
		container.appendChild(br);
	});
} else {
	location.href = 'index.html';
}
