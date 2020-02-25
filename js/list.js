// Get the id provided by the url to know what files to load.
const parameters = new URLSearchParams(window.location.search);
const id = parameters.get('id');

// Get all paths associated with the id we just obtained.
const dataAccess = new DataAccess();
const paths = dataAccess.getPaths(id);

// HTML elements the script needs.
const container = document.getElementById("container");

const lists = [];
let wordCount = 0;

if ((typeof paths !== 'undefined') && (typeof container !== 'undefined')) {
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

      let tdGermanText = "";
      for (let variant of word.de) {
        tdGermanText += `${variant}, `;
      }
      // Removing the extra 2 characters at the end of the finalized string.
      tdGermanText = tdGermanText.substring(0, tdGermanText.length - 2);

      let tdFrenchText = "";
      for (let variant of word.fr) {
        tdFrenchText += `${variant}, `;
      }
      // Removing the extra 2 characters at the end of the finalized string.
      tdFrenchText = tdFrenchText.substring(0, tdFrenchText.length - 2);

      const tdGermanTextNode = document.createTextNode(tdGermanText);
      const tdFrenchTextNode = document.createTextNode(tdFrenchText);
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
  throw new Error(
    "Couldn't load lists as either 'paths' or 'container' is undefined."
  );
}
