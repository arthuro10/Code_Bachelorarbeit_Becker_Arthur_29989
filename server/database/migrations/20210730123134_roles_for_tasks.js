exports.up = async function(knex) {
    await knex.schema.createTable("roles_for_tasks", table => {
        table.uuid('id').notNullable();;
        table.string('task_name').notNullable();
        table.json('roles');
        table.boolean('has_role');
    } );

    return true;
  };
  
  exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("roles_for_tasks");
    return true;
  };
  