const paths = {
	"raum_austausch": [
		"lists/raum_austausch/reisen.json",
		"lists/raum_austausch/ferien.json",
		"lists/raum_austausch/sprachen.json",
		"lists/raum_austausch/auswanderung.json",
		"lists/raum_austausch/docs/airbnb.json",
		"lists/raum_austausch/docs/au_pair.json",
		"lists/raum_austausch/docs/couchsurfing.json",
		"lists/raum_austausch/docs/deutschland_braucht_zuwanderung.json",
		"lists/raum_austausch/docs/erasmus.json",
		"lists/raum_austausch/docs/freiwillige_soziale_jahr.json",
		"lists/raum_austausch/docs/gap_jahr.json",
		"lists/raum_austausch/docs/hochschulprogramm.json",
		"lists/raum_austausch/docs/pro_tandem.json",
		"lists/raum_austausch/docs/voltaire_programm.json"
	],
	"raum_austausch:nodocs": [
		"lists/raum_austausch/reisen.json",
		"lists/raum_austausch/ferien.json",
		"lists/raum_austausch/sprachen.json",
		"lists/raum_austausch/auswanderung.json"
	],
	"raum_austausch:docs": [
		"lists/raum_austausch/docs/airbnb.json",
		"lists/raum_austausch/docs/au_pair.json",
		"lists/raum_austausch/docs/couchsurfing.json",
		"lists/raum_austausch/docs/deutschland_braucht_zuwanderung.json",
		"lists/raum_austausch/docs/erasmus.json",
		"lists/raum_austausch/docs/freiwillige_soziale_jahr.json",
		"lists/raum_austausch/docs/gap_jahr.json",
		"lists/raum_austausch/docs/hochschulprogramm.json",
		"lists/raum_austausch/docs/pro_tandem.json",
		"lists/raum_austausch/docs/voltaire_programm.json"
	],
	"linking_words_conjunctions": [
		"lists/linking_words_conjunctions/common.json"
	]
}

function play(id) {
	if ((typeof id === 'string')
	&& (typeof paths[id] !== 'undefined')) {
		var parameterValue = '';

		paths[id].forEach(path => {
			parameterValue += `${path},`;
		});

		parameterValue = parameterValue.slice(0, -1);

		location.href = `quiz.html?p=${parameterValue}`;
	}
}
