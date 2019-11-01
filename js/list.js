const parameters = new URLSearchParams(window.location.search);
const id = parameters.get('id');

if (typeof id !== 'undefined') {
	const dataAccess = new DataAccess();
	const paths = dataAccess.getPaths(id);
	const lists = [];
	const container = document.getElementById("container");
	let wordCount = 0;

	if ((typeof paths !== 'undefined')
	&& (typeof lists !== 'undefined')
	&& (typeof container !== 'undefined')) {
		paths.forEach(path => {
			lists.push(dataAccess.getListFromPath(path));
		});
	
		lists.forEach(list => {
			const section = document.createElement("section");
	
			// Create a header for each list displaying the list's name.
			const header = document.createElement("h2");
			header.innerHTML = list.name;
			section.appendChild(header);
	
			// Create a table for each list containing every word.
			const table = document.createElement("table");
	
			list.words.forEach(word => {
				const tr = document.createElement("tr");
				const tdGerman = document.createElement("td");
				const tdFrench = document.createElement("td");
				tdGerman.className = "td-german";
				tdFrench.className = "td-french";
	
				const tdGermanTextNode = document.createTextNode(word.de[0]);
				const tdFrenchTextNode = document.createTextNode(word.fr[0]);
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
		location.href = '/';
	}
} else {
	location.href = '/';
}
