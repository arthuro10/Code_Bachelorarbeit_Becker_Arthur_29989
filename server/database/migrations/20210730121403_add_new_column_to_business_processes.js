
exports.up = async function(knex) {
    await knex.schema.alterTable("business_process", table => {
      table.json('owner');
    } );  
  
    return true;
  
    };
    
    exports.down = async function(knex) {
      await knex.schema.dropTableIfExists("business_process");
      return true;
  
    };
    