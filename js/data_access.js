class DataAccess {
	constructor() {
		this.listIDs = {
			"raum_austausch": [
				"vocabulary/raum_austausch/common.json",
				"vocabulary/raum_austausch/reisen.json",
				"vocabulary/raum_austausch/ferien.json",
				"vocabulary/raum_austausch/sprachen.json",
				"vocabulary/raum_austausch/auswanderung.json"
			],
			"raum_austausch:*": [
				"vocabulary/raum_austausch/common.json",
				"vocabulary/raum_austausch/reisen.json",
				"vocabulary/raum_austausch/ferien.json",
				"vocabulary/raum_austausch/sprachen.json",
				"vocabulary/raum_austausch/auswanderung.json",
				"vocabulary/raum_austausch/docs/airbnb.json",
				"vocabulary/raum_austausch/docs/au_pair.json",
				"vocabulary/raum_austausch/docs/couchsurfing.json",
				"vocabulary/raum_austausch/docs/deutschland_braucht_zuwanderung.json",
				"vocabulary/raum_austausch/docs/erasmus.json",
				"vocabulary/raum_austausch/docs/freiwillige_soziale_jahr.json",
				"vocabulary/raum_austausch/docs/gap_jahr.json",
				"vocabulary/raum_austausch/docs/hochschulprogramm.json",
				"vocabulary/raum_austausch/docs/pro_tandem.json",
				"vocabulary/raum_austausch/docs/voltaire_programm.json"
			],
			"raum_austausch:docs": [
				"vocabulary/raum_austausch/docs/airbnb.json",
				"vocabulary/raum_austausch/docs/au_pair.json",
				"vocabulary/raum_austausch/docs/couchsurfing.json",
				"vocabulary/raum_austausch/docs/deutschland_braucht_zuwanderung.json",
				"vocabulary/raum_austausch/docs/erasmus.json",
				"vocabulary/raum_austausch/docs/freiwillige_soziale_jahr.json",
				"vocabulary/raum_austausch/docs/gap_jahr.json",
				"vocabulary/raum_austausch/docs/hochschulprogramm.json",
				"vocabulary/raum_austausch/docs/pro_tandem.json",
				"vocabulary/raum_austausch/docs/voltaire_programm.json"
			],
			"linking_words_conjunctions": [
				"vocabulary/linking_words_conjunctions/common.json"
			]
		}
	}

	getPaths(id) {
		if ((typeof id === 'string')
		&& (typeof this.listIDs[id] !== 'undefined')) {
			return this.listIDs[id];
		}
	}

	getListFromPath(path) {
		if (typeof path === 'string') {
			var request = new XMLHttpRequest();
			request.open("GET", path, false);
			request.send(null);

			var list = JSON.parse(request.responseText);
			return list;
		} else {
			return null;
		}
	}

	getWordsFromList(path) {
		if (typeof path === 'string') {
			var request = new XMLHttpRequest();
			request.open("GET", path, false);
			request.send(null);
			var list = JSON.parse(request.responseText);
			return list.words;
		} else {
			return null;
		}
	}
}
