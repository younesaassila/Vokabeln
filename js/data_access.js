class DataAccess {
  constructor() {
    this.listIDs = {
      "raum_austausch": [
        "vocabulary/raum_austausch/general.json",
        "vocabulary/raum_austausch/reisen.json",
        "vocabulary/raum_austausch/ferien.json",
        "vocabulary/raum_austausch/sprachen.json",
        "vocabulary/raum_austausch/auswanderung.json"
      ],
      "raum_austausch:*": [
        "vocabulary/raum_austausch/general.json",
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
        "vocabulary/linking_words_conjunctions/linking_words.json",
        "vocabulary/linking_words_conjunctions/coordinating_conjunctions.json"
      ]
    }
  }

  /**
   * Returns a list of filepaths associated with the given id. Returns null if
   * the id is not associated with any array.
   * @param {string} id 
   */
  getPaths(id) {
    if ((typeof id === 'string')
    && (typeof this.listIDs[id] !== 'undefined')) {
      return this.listIDs[id];
    } else {
      return null;
    }
  }

  /**
   * Returns a list object from a given path. Returns null if the path is not valid.
   * @param {string} path 
   */
  getListFromPath(path) {
    if (typeof path === 'string') {
      const request = new XMLHttpRequest();
      request.open("GET", path, false);
      request.send(null);
      
      const list = JSON.parse(request.responseText);
      return list;
    } else {
      return null;
    }
  }

  /**
   * Returns an array of questions combining all words from the given lists.
   * @param {*} paths 
   */
  getQuestionsFromListPaths(paths) {
    let questions = [];
    
    paths.forEach(path => {
      const list = this.getListFromPath(path);
      const words = list.words;
      
      if (typeof words !== 'undefined') {
        words.forEach(word => {
          let question = new Question(word.de, word.fr);
          questions.push(question);
        });
      }
    });
    
    return questions;
  }
}
