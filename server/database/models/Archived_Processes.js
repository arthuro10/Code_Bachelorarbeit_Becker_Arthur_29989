const { Model } = require('objection');

class Archived_processes extends Model {
    static get tableName() {
      return 'archived_processes';
    }
  
  

  }

  module.exports = Archived_processes;

  // Das get... damit die Funktion wie eine Property aufgerufen werden kann