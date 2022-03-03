const { Model } = require('objection');

class Roles_for_tasks extends Model {
    static get tableName() {
      return 'roles_for_tasks';
    }
  
  

  }

  module.exports = Roles_for_tasks;

  // Das get... damit die Funktion wie eine Property aufgerufen werden kann