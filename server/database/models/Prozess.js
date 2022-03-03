const { Model } = require('objection');

class Business_process extends Model {
    static get tableName() {
      return 'business_process';
    }
  
  

  }

  module.exports = Business_process;

  // Das get... damit die Funktion wie eine Property aufgerufen werden kann