const { Model } = require('objection');

class Tasks_tied_to_process extends Model {
    static get tableName() {
      return 'tasks_tied_to_process';
    }
  
  

  }

  module.exports = Tasks_tied_to_process;

  // Das get... damit die Funktion wie eine Property aufgerufen werden kann