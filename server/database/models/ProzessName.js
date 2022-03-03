const { Model } = require('objection');

class ProzessNameAndID extends Model {
    static get tableName() {
      return 'processes';
    }
  
  

  }

  module.exports = ProzessNameAndID;