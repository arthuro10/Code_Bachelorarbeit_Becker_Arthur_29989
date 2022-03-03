exports.up = async function(knex) {
    await knex.schema.alterTable("tasks_tied_to_process", table => {
        table.boolean('firstTask').notNullable();
    } );

    return true;
  };
  
  exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("tasks_tied_to_process");
    return true;
  };
  