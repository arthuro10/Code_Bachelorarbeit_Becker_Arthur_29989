exports.up = async function(knex) {

    await knex.schema.createTable("processes", table => {
        table.uuid('id').notNullable();
        table.json('tasks');
        table.string('name').notNullable();
    } );
  
    return true;
  };
  
  exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("processes");
    return true;
  };
  