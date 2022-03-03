exports.up = async function(knex) {
    await knex.schema.createTable("tasks_tied_to_process", table => {
        table.uuid('id').notNullable();;
        table.string('task_name').notNullable();
        table.string('process').notNullable();
    } );

    return true;
  };
  
  exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("tasks_tied_to_process");
    return true;
  };
  